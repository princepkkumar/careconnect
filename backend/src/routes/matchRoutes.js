const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { matchRequest } = require('../controllers/matchController');

router.use(authMiddleware);
router.use(requireRole(['admin']));

router.post('/:id/match', matchRequest);

module.exports = router;
