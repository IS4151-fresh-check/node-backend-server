const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },

    humidity: { type: Number, required: true },
    temperature: { type: Number, required: true },

    ppm: { type: Number, required: true },
    ppmSlope: { type: Number, required: true },
    gasStage: {
      type: String,
      enum: ['fresh', 'ripe', 'overripe', 'spoiled'],
      required: true,
    },
    gasConfidence: { type: Number, min: 0, max: 1, required: true },
    action: { type: String, required: true },

    cvStage: {
      type: String,
      enum: ['fresh', 'ripe', 'overripe', 'spoiled'],
      required: true,
    },
    cvConfidence: { type: Number, required: true, min: 0, max: 1 },
    imageBase64: { type: String, required: true },

    createdAt: { type: Date, expires: '3d' }, //auto remove readings after 3 days
  },
  { timestamps: true },
);

module.exports = mongoose.model('Reading', ReadingSchema);
