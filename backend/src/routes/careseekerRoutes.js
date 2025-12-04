const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const {
  upsertCareseekerProfile,
  getMyCareseekerProfile,
  createRequest,
  getMyRequests
} = require('../controllers/careseekerController');

router.use(authMiddleware);
router.use(requireRole(['careseeker']));

router.post('/profile', upsertCareseekerProfile);
router.get('/profile/me', getMyCareseekerProfile);
router.post('/requests', createRequest);
router.get('/requests', getMyRequests);

module.exports = router;
