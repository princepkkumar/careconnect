const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

const {
  getStats,
  listCaregivers,
  listCareseekers,
  listRequests,
  listUsersWithProfiles, // 👈 NEW
} = require('../controllers/adminController');

// All admin routes protected + only for admin role
router.use(authMiddleware);
router.use(requireRole(['admin']));

// Stats
router.get('/stats', getStats);

// Old endpoints (optional but still useful)
router.get('/caregivers', listCaregivers);
router.get('/careseekers', listCareseekers);
router.get('/requests', listRequests);

// ✅ NEW combined users endpoint
router.get('/users', listUsersWithProfiles);

module.exports = router;
