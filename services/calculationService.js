//may change according to new dataset
const RIPENESS_THRESHOLDS = {
  FRESH_TO_RIPE: 500,
  RIPE_TO_OVERRIPE: 2000,
  OVERRIPE_TO_SPOILED: 5000,
};

const calculateShelfLife = async (ppm, ppmSlope) => {
  if (ppmSlope <= 0) return null;

  if (ppm < RIPENESS_THRESHOLDS.FRESH_TO_RIPE) {
    nextThreshold = RIPENESS_THRESHOLDS.FRESH_TO_RIPE;
  } else if (ppm < RIPENESS_THRESHOLDS.RIPE_TO_OVERRIPE) {
    nextThreshold = RIPENESS_THRESHOLDS.RIPE_TO_OVERRIPE;
  } else if (ppm < RIPENESS_THRESHOLDS.OVERRIPE_TO_SPOILED) {
    nextThreshold = RIPENESS_THRESHOLDS.OVERRIPE_TO_SPOILED;
  } else {
    return 0;
  }

  const hoursRemaining = (nextThreshold - ppm) / ppmSlope;
  const daysRemaining = hoursRemaining / 24;

  return Math.max(0, parseFloat(daysRemaining.toFixed(1)));
};

const calculateDiscount = async (cvStage, remainingShelfLife) => {
  if (cvStage === 'overripe') {
    switch (Math.floor(remainingShelfLife)) {
      case 3:
        return 20;
      case 2:
        return 40;
      case 1:
        return 70;
      case 0:
        return 90;
      default:
        return 0;
    }
  }
};

module.exports = {
  calculateDiscount,
  calculateShelfLife,
};
