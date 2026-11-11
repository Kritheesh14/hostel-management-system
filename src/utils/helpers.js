const pool = require('../config/db');

// Wraps async handlers; never leaks internals in error responses (SEC-06)
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error('request failed:', e.code || 'error');
    res.status(500).json({ error: 'Server error' });
  });

async function studentIdFor(userId) {
  const [r] = await pool.query('SELECT student_id FROM students WHERE user_id = ?', [userId]);
  return r[0] ? r[0].student_id : null;
}

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !isNaN(Date.parse(s));
const isDateTime = (s) => /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(String(s)) && !isNaN(Date.parse(String(s).replace(' ', 'T')));

module.exports = { pool, wrap, studentIdFor, isDate, isDateTime };
