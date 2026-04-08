const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // e.g., "Banana"
    },
    location: {
      type: String,
      required: true,
    }, // e.g., "Section 2A"
    arrivedAt: {
      type: Date,
      required: true,
    },
    remainingShelfLife: {
      type: Number,
    },
    ethylenePpm: { type: Number },
    humidity: { type: Number },
    temperature: { type: Number },
    currentStage: {
      type: String,
      enum: ['pending', 'fresh', 'ripe', 'overripe', 'spoiled'],
      default: 'pending',
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    imageBase64: { type: String },
    tempAlert:{ type: Date},
    humAlert:{ type: Date},
    discountAlert:{ type: Date},
    disposeAlert:{ type: Date},
  },
  { timestamps: true },
);

module.exports = mongoose.model('Section', SectionSchema);
