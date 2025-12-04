const CareseekerProfile = require('../models/CareseekerProfile');
const Request = require('../models/Request');

const upsertCareseekerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      disabilityType,
      address,
      longitude,
      latitude,
      supportNeeds,
      preferences
    } = req.body;

    const profileData = {
      user: userId,
      disabilityType,
      address,
      preferences
    };

    if (longitude && latitude) {
      profileData.location = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)]
      };
    }

    if (supportNeeds) profileData.supportNeeds = supportNeeds;

    const profile = await CareseekerProfile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    next(err);
  }
};

const getMyCareseekerProfile = async (req, res, next) => {
  try {
    const profile = await CareseekerProfile.findOne({ user: req.user._id });
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const { description, needTags } = req.body;
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const request = await Request.create({
      careseeker: req.user._id,
      description,
      needTags: needTags || []
    });

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ careseeker: req.user._id });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upsertCareseekerProfile,
  getMyCareseekerProfile,
  createRequest,
  getMyRequests
};
