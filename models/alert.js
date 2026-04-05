const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['critical', 'info', 'warning'],
      required: true,
    },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Alert', AlertSchema);
