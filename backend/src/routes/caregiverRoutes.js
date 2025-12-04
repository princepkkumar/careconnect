const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const {
  upsertCaregiverProfile,
  getMyCaregiverProfile
} = require('../controllers/caregiverController');

router.use(authMiddleware);
router.use(requireRole(['caregiver']));

router.post('/profile', upsertCaregiverProfile);
router.get('/profile/me', getMyCaregiverProfile);

module.exports = router;
