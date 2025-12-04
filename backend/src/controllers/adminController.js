const User = require('../models/User');
const CaregiverProfile = require('../models/CaregiverProfile');
const CareseekerProfile = require('../models/CareseekerProfile');
const Request = require('../models/Request');
const Match = require('../models/Match');

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const caregivers = await User.countDocuments({ role: 'caregiver' });
    const careseekers = await User.countDocuments({ role: 'careseeker' });
    const openRequests = await Request.countDocuments({ status: 'open' });

    res.json({ totalUsers, caregivers, careseekers, openRequests });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/caregivers
// (old endpoint – still available if you want to use it)
const listCaregivers = async (req, res, next) => {
  try {
    const profiles = await CaregiverProfile.find()
      .populate('user')        // name, email, role
      .sort({ createdAt: -1 }); // latest first
    res.json(profiles);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/careseekers
// (old endpoint – still available)
const listCareseekers = async (req, res, next) => {
  try {
    const profiles = await CareseekerProfile.find()
      .populate('user')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/requests
const listRequests = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('careseeker') // if your schema has 'careseeker'
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

// ✅ NEW: GET /api/admin/users
// Combined list: caregivers + careseekers with user info
const listUsersWithProfiles = async (req, res, next) => {
  try {
    const caregivers = await CaregiverProfile.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    const careseekers = await CareseekerProfile.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      caregivers,
      careseekers,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  listCaregivers,
  listCareseekers,
  listRequests,
  listUsersWithProfiles, // 👈 NEW export
};
