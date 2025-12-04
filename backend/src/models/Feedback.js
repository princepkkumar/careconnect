const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    roleOfRater: { type: String, enum: ['caregiver', 'careseeker'], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
