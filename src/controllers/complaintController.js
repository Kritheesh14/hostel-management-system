const { pool, wrap, studentIdFor } = require('../utils/helpers');

const CATEGORIES = ['plumbing', 'electrical', 'furniture', 'cleanliness', 'internet', 'other'];

// FR-09
exports.create = wrap(async (req, res) => {
  const category = String(req.body.category || '').toLowerCase().trim();
  const description = String(req.body.description || '').trim();
  const errors = [];
  if (!CATEGORIES.includes(category)) errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
  if (description.length < 5 || description.length > 500) errors.push('description must be 5-500 characters');
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  const sid = await studentIdFor(req.session.user.id);
  if (!sid) return res.status(400).json({ error: 'No student profile linked to this account' });
  const [r] = await pool.query('INSERT INTO complaints (student_id, category, description) VALUES (?,?,?)', [sid, category, description]);
  res.status(201).json({ message: 'Complaint submitted', complaint_id: r.insertId, status: 'open' });
});

// FR-10: own complaints only
exports.mine = wrap(async (req, res) => {
  const sid = await studentIdFor(req.session.user.id);
  if (!sid) return res.json([]);
  const [rows] = await pool.query(
    'SELECT complaint_id, category, description, status, created_on, updated_on FROM complaints WHERE student_id=? ORDER BY created_on DESC', [sid]);
  res.json(rows);
});

exports.list = wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.complaint_id, c.category, c.description, c.status, c.created_on, s.srn, s.name AS student_name,
            u.full_name AS assigned_name, c.assigned_to
       FROM complaints c JOIN students s ON s.student_id=c.student_id
       LEFT JOIN users u ON u.user_id=c.assigned_to ORDER BY c.created_on DESC`);
  res.json(rows);
});

exports.staff = wrap(async (req, res) => {
  const [rows] = await pool.query("SELECT user_id, full_name FROM users WHERE role='maintenance'");
  res.json(rows);
});

// FR-11: assign
exports.assign = wrap(async (req, res) => {
  const staffId = Number(req.body.assigned_to);
  if (!Number.isInteger(staffId)) return res.status(400).json({ error: 'assigned_to is required' });
  const [u] = await pool.query("SELECT user_id FROM users WHERE user_id=? AND role='maintenance'", [staffId]);
  if (!u[0]) return res.status(400).json({ error: 'Selected user is not maintenance staff' });
  const [r] = await pool.query(
    "UPDATE complaints SET assigned_to=?, status=IF(status='open','assigned',status) WHERE complaint_id=? AND status<>'resolved'",
    [staffId, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Complaint not found or already resolved' });
  res.json({ message: 'Complaint assigned' });
});

// maintenance staff: view own assigned requests
exports.assigned = wrap(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.complaint_id, c.category, c.description, c.status, c.created_on, s.srn
       FROM complaints c JOIN students s ON s.student_id=c.student_id
      WHERE c.assigned_to=? ORDER BY c.created_on DESC`, [req.session.user.id]);
  res.json(rows);
});

// FR-11: update status (maintenance only on their own assignments)
exports.updateStatus = wrap(async (req, res) => {
  const status = String(req.body.status || '');
  if (!['in_progress', 'resolved'].includes(status)) return res.status(400).json({ error: "status must be 'in_progress' or 'resolved'" });
  const isStaff = req.session.user.role === 'maintenance';
  const [r] = await pool.query(
    `UPDATE complaints SET status=? WHERE complaint_id=? ${isStaff ? 'AND assigned_to=?' : ''}`,
    isStaff ? [status, req.params.id, req.session.user.id] : [status, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Request not found or not assigned to you' });
  res.json({ message: 'Status updated' });
});

exports.CATEGORIES = CATEGORIES;
