const { pool, wrap } = require('../utils/helpers');

// FR-17: totals computed directly from underlying records
exports.summary = wrap(async (req, res) => {
  const [[beds]] = await pool.query(
    `SELECT COUNT(*) AS total_beds, SUM(a.allocation_id IS NOT NULL) AS occupied_beds
       FROM beds b LEFT JOIN allocations a ON a.bed_id=b.bed_id AND a.status='active'`);
  const [[fees]] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(paid_amount >= amount),0) AS paid,
            COALESCE(SUM(paid_amount > 0 AND paid_amount < amount),0) AS partially_paid,
            COALESCE(SUM(paid_amount = 0),0) AS pending,
            COALESCE(SUM(amount),0) AS total_billed, COALESCE(SUM(paid_amount),0) AS total_collected
       FROM fees`);
  const [[comp]] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(status='open'),0) AS open_count, COALESCE(SUM(status='assigned'),0) AS assigned,
            COALESCE(SUM(status='in_progress'),0) AS in_progress, COALESCE(SUM(status='resolved'),0) AS resolved
       FROM complaints`);
  const total = Number(beds.total_beds), occ = Number(beds.occupied_beds || 0);
  res.json({
    occupancy: { total_beds: total, occupied_beds: occ, available_beds: total - occ, occupancy_percent: total ? Math.round((occ / total) * 100) : 0 },
    fees, complaints: comp,
  });
});
