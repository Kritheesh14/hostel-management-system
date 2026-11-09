const router = require('express').Router();
const c = require('../controllers/visitorController');
const { requireRole } = require('../middleware/auth');
router.post('/', requireRole('warden', 'admin'), c.create);
router.get('/', requireRole('warden', 'admin'), c.list);
module.exports = router;
