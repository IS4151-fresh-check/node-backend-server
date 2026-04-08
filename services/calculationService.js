//may change according to new dataset
const RIPENESS_THRESHOLDS = {
  FRESH_TO_RIPE: 500,
  RIPE_TO_OVERRIPE: 2000,
  OVERRIPE_TO_SPOILED: 5000,
};

const calculateDaysToNextStage = async (ppm, ppmSlope) => {
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

const calculateDiscount = async (currentStage, daysToNextStage) => {
  let remaining = daysToNextStage;
  remaining = Math.max(remaining, 1);
  let discount = 0;

  if (currentStage === 'ripe') {
    discount = 5 + (1 / remaining) * 10;
  } else if (currentStage == 'overripe') {
    discount = 20 + (1 / remaining) * 20;
  }
  return Math.round(discount * 100) / 100;
};

module.exports = {
  calculateDiscount,
  calculateDaysToNextStage,
};
