const CaregiverProfile = require('../models/CaregiverProfile');

const upsertCaregiverProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      age,
      gender,
      address,
      longitude,
      latitude,
      education,
      experience,
      skills,
      languages,
      availability,
      willingness,
      strengths,
      caregiverPlan,
      hourlyRate,
      isVolunteer
    } = req.body;

    const profileData = {
      user: userId,
      age,
      gender,
      address,
      education,
      experience,
      strengths,
      caregiverPlan,
      hourlyRate,
      isVolunteer
    };

    if (longitude && latitude) {
      profileData.location = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      };
    }

    if (skills) profileData.skills = skills;
    if (languages) profileData.languages = languages;
    if (availability) profileData.availability = availability;
    if (willingness) profileData.willingness = willingness;

    const profile = await CaregiverProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

const getMyCaregiverProfile = async (req, res, next) => {
  try {
    const profile = await CaregiverProfile.findOne({ user: req.user._id });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

module.exports = { upsertCaregiverProfile, getMyCaregiverProfile };
