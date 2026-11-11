const router = require('express').Router();
const c = require('../controllers/feeController');
const { requireRole } = require('../middleware/auth');
router.get('/mine', requireRole('student'), c.mine);
router.get('/', requireRole('admin'), c.list);
router.post('/', requireRole('admin'), c.create);
router.put('/:id', requireRole('admin'), c.update);
module.exports = router;
