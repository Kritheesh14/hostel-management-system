const { pool, wrap, isDateTime } = require('../utils/helpers');

// FR-15
exports.create = wrap(async (req, res) => {
  const name = String(req.body.visitor_name || '').trim();
  const purpose = String(req.body.purpose || '').trim();
  const errors = [];
  if (!name || name.length > 100) errors.push('visitor_name is required (max 100 chars)');
  if (!purpose || purpose.length > 200) errors.push('purpose is required (max 200 chars)');
  let when = req.body.visit_time;
  if (!when) when = new Date().toISOString().slice(0, 19).replace('T', ' ');
  else if (!isDateTime(when)) errors.push('visit_time must be YYYY-MM-DD HH:MM');
  else when = String(when).replace('T', ' ');
  let studentId = null;
  if (req.body.srn) {
    const [s] = await pool.query('SELECT student_id FROM students WHERE srn=?', [String(req.body.srn).trim().toUpperCase()]);
    if (!s[0]) errors.push('No student with that SRN');
    else studentId = s[0].student_id;
  }
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  const [r] = await pool.query(
    'INSERT INTO visitors (visitor_name, purpose, visit_time, student_id, recorded_by) VALUES (?,?,?,?,?)',
    [name, purpose, when, studentId, req.session.user.id]);
  res.status(201).json({ message: 'Visitor recorded', visitor_id: r.insertId });
});

exports.list = wrap(async (req, res) => {
  const q = `%${String(req.query.q || '').trim()}%`;
  const [rows] = await pool.query(
    `SELECT v.visitor_id, v.visitor_name, v.purpose, v.visit_time, s.srn, s.name AS student_name
       FROM visitors v LEFT JOIN students s ON s.student_id=v.student_id
      WHERE v.visitor_name LIKE ? ORDER BY v.visit_time DESC LIMIT 200`, [q]);
  res.json(rows);
});
