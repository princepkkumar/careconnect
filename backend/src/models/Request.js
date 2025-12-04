const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    careseeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    needTags: [String],
    status: {
      type: String,
      enum: ['open', 'matched', 'in_progress', 'completed', 'cancelled'],
      default: 'open'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
