const router = require('express').Router();
const c = require('../controllers/leaveController');
const { requireRole } = require('../middleware/auth');
router.post('/', requireRole('student'), c.create);
router.get('/mine', requireRole('student'), c.mine);
router.get('/', requireRole('warden', 'admin'), c.list);
router.put('/:id/decision', requireRole('warden', 'admin'), c.decide);
module.exports = router;
