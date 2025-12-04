const mongoose = require('mongoose');

const caregiverProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: Number,
    gender: String,
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    },
    education: String,
    experience: String,
    skills: [String],
    languages: [String],
    availability: {
      days: [String],
      timeSlots: [String]
    },
    willingness: {
      weekend: { type: Boolean, default: false },
      travel: { type: Boolean, default: false },
      emergencySupport: { type: Boolean, default: false }
    },
    strengths: String,
    caregiverPlan: String,
    hourlyRate: Number,
    isVolunteer: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

caregiverProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CaregiverProfile', caregiverProfileSchema);
