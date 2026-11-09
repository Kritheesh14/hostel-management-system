const { pool, wrap, studentIdFor, isDate } = require('../utils/helpers');

// FR-08: status derived from stored amounts so it always matches records
function statusOf(amount, paid) {
  amount = Number(amount); paid = Number(paid);
  if (paid >= amount) return 'Paid';
  if (paid > 0) return 'Partially Paid';
  return 'Pending';
}
const withStatus = (rows) => rows.map((r) => ({ ...r, status: statusOf(r.amount, r.paid_amount) }));

function validate(b, partial) {
  const errors = [], d = {};
  if (!partial || b.student_id !== undefined) { const v = Number(b.student_id); Number.isInteger(v) ? (d.student_id = v) : errors.push('student_id is required'); }
  if (!partial || b.amount !== undefined) { const v = Number(b.amount); v > 0 ? (d.amount = v) : errors.push('amount must be greater than 0'); }
  if (b.paid_amount !== undefined) { const v = Number(b.paid_amount); v >= 0 ? (d.paid_amount = v) : errors.push('paid_amount must be 0 or more'); }
  if (!partial || b.due_date !== undefined) { isDate(b.due_date) ? (d.due_date = b.due_date) : errors.push('due_date must be YYYY-MM-DD'); }
  if (b.description) d.description = String(b.description).trim().slice(0, 100);
  if (d.amount !== undefined && d.paid_amount !== undefined && d.paid_amount > d.amount) errors.push('paid_amount cannot exceed amount');
  return { errors, data: d };
}

// FR-07
exports.create = wrap(async (req, res) => {
  const { errors, data } = validate(req.body, false);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  const [s] = await pool.query('SELECT student_id FROM students WHERE student_id=?', [data.student_id]);
  if (!s[0]) return res.status(404).json({ error: 'Student not found' });
  const [r] = await pool.query('INSERT INTO fees SET ?', [{ ...data, updated_by: req.session.user.id }]);
  res.status(201).json({ message: 'Fee record created', fee_id: r.insertId });
});

exports.update = wrap(async (req, res) => {
  const { errors, data } = validate(req.body, true);
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  delete data.student_id;
  if (!Object.keys(data).length) return res.status(400).json({ error: 'No fields to update' });
  const [cur] = await pool.query('SELECT amount, paid_amount FROM fees WHERE fee_id=?', [req.params.id]);
  if (!cur[0]) return res.status(404).json({ error: 'Fee record not found' });
  const amount = data.amount ?? Number(cur[0].amount), paid = data.paid_amount ?? Number(cur[0].paid_amount);
  if (paid > amount) return res.status(400).json({ error: 'paid_amount cannot exceed amount' });
  await pool.query('UPDATE fees SET ?, updated_by=? WHERE fee_id=?', [data, req.session.user.id, req.params.id]);
  res.json({ message: 'Fee record updated' });
});

exports.list = wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT f.*, s.srn, s.name FROM fees f JOIN students s ON s.student_id=f.student_id ORDER BY f.due_date DESC`);
  res.json(withStatus(rows));
});

// student sees only own fees (SO-01)
exports.mine = wrap(async (req, res) => {
  const sid = await studentIdFor(req.session.user.id);
  if (!sid) return res.json([]);
  const [rows] = await pool.query('SELECT * FROM fees WHERE student_id=? ORDER BY due_date DESC', [sid]);
  res.json(withStatus(rows));
});

exports.statusOf = statusOf;
