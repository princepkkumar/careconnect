const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    careseeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caregiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending_caregiver', 'active', 'ended'],
      default: 'pending_caregiver'
    },
    matchScore: { type: Number, default: 0 },
    assignedBy: { type: String, enum: ['system', 'admin'], default: 'system' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
