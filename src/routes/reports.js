const router = require('express').Router();
const c = require('../controllers/reportController');
const { requireRole } = require('../middleware/auth');
router.get('/summary', requireRole('admin'), c.summary);
module.exports = router;
