const Section = require('../models/section');
const Alert = require('../models/alert');

const evaluateSection = async (sectionId, data) => {
  await updateSection(sectionId, data);
  await checkEnvironmentAlerts(sectionId, data);
  await checkRipenessAlerts(sectionId, data, discrepancy);
};

const updateSection = async (sectionId, data) => {
  const discount = calculateDiscount(data);

  await Section.findByIdAndUpdate(sectionId, {
    currentStage: data.cvStage,
    remainingShelfLife: data.remainingShelfLife,
    discountPercentage: discount,
  });
};

const checkEnvironmentAlerts = async (sectionId, data) => {
  const TEMP_MIN = 13.5,
    TEMP_MAX = 20;
  const HUM_MIN = 85,
    HUM_MAX = 95;

  if (data.temperature < TEMP_MIN || data.temperature > TEMP_MAX) {
    await createAlert({
      sectionId,
      title: 'Adjust Temperature',
      message: `Temperature ${data.temperature}°C is out of optimal range (${TEMP_MIN}–${TEMP_MAX}°C)`,
      type: 'Warning',
    });
  }

  if (data.humidity < HUM_MIN || data.humidity > HUM_MAX) {
    await createAlert({
      sectionId,
      title: 'Adjust Humidity',
      message: `Humidity ${data.humidity}% is out of optimal range (${HUM_MIN}–${HUM_MAX}%)`,
      type: 'Warning',
    });
  }
};

const checkRipenessAlerts = async (sectionId, data) => {
  if (data.cvStage === 'spoiled') {
    await createAlert({
      sectionId,
      title: 'Spoiled',
      message: `Dispose immediately`,
      type: 'Critical',
    });
  } else if (data.cvStage === 'overripe') {
    await createAlert({
      sectionId,
      title: 'Overripe',
      message: `Apply discount`,
      type: 'Info',
    });
  }
};

const createAlert = async (data) => {
  try {
    const newAlert = await Alert.create({
      ...data,
      status: 'active',
    });

    res.status(201).json(newAlert);
  } catch (err) {
    console.error('Alert Creation Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const calculateDiscount = (data) => {
  if (data.cvStage === 'overripe') {
    switch (Math.floor(daysLeft)) {
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

module.exports = { evaluateSection };
