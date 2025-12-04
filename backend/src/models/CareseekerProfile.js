const mongoose = require('mongoose');

const careseekerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    disabilityType: String,
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    },
    supportNeeds: [String],
    preferences: {
      caregiverGender: String,
      languages: [String],
      maxDistanceKm: { type: Number, default: 10 },
      budget: Number
    },
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

careseekerProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CareseekerProfile', careseekerProfileSchema);
