const router = require('express').Router();
const c = require('../controllers/announcementController');
const { requireLogin, requireRole } = require('../middleware/auth');
router.get('/', requireLogin, c.list);
router.post('/', requireRole('admin', 'warden'), c.create);
module.exports = router;
