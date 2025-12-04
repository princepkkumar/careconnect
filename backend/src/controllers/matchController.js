const CaregiverProfile = require('../models/CaregiverProfile');
const CareseekerProfile = require('../models/CareseekerProfile');
const Request = require('../models/Request');
const Match = require('../models/Match');

// simple similarity of tags
const computeScore = (needTags, skills, distanceKm) => {
  let overlap = 0;
  if (needTags && skills) {
    const setSkills = new Set(skills.map((s) => s.toLowerCase()));
    needTags.forEach((t) => {
      if (setSkills.has(String(t).toLowerCase())) overlap += 1;
    });
  }
  const distanceScore = distanceKm != null ? Math.max(0, 10 - distanceKm) / 10 : 0.5;
  return overlap * 2 + distanceScore;
};

const matchRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const careseekerProfile = await CareseekerProfile.findOne({ user: request.careseeker });
    if (!careseekerProfile) {
      return res.status(400).json({ message: 'Careseeker profile not found' });
    }

    const { preferences } = careseekerProfile;
    const maxDist = (preferences && preferences.maxDistanceKm) || 10;

    const query = {};
    if (preferences?.caregiverGender) {
      query.gender = preferences.caregiverGender;
    }

    let caregivers = await CaregiverProfile.find(query).populate('user');

    const results = caregivers
      .map((cg) => {
        let distanceKm = null;
        if (cg.location && careseekerProfile.location) {
          // We skip precise distance; you can plug haversine formula here.
          distanceKm = 5; // placeholder constant
        }

        const score = computeScore(request.needTags, cg.skills, distanceKm);
        return { cg, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const matches = [];
    for (const r of results) {
      const m = await Match.create({
        request: request._id,
        careseeker: request.careseeker,
        caregiver: r.cg.user._id,
        matchScore: r.score,
        assignedBy: 'system'
      });
      matches.push(m);
    }

    request.status = 'matched';
    await request.save();

    res.json({ request, matches });
  } catch (err) {
    next(err);
  }
};

module.exports = { matchRequest };
