const Section = require('../models/section');
const Alert = require('../models/alert');

const generateAlerts = async (sectionId, data) => {
  await checkEnvironmentAlerts(sectionId, data);
  await checkRipenessAlerts(sectionId, data, discrepancy);
};

const now = new Date();
const COOLDOWN = 15 * 60 * 1000;
const COOLDOWN2 = 12 * 60 * 60 * 1000;

const checkEnvironmentAlerts = async (sectionId, data) => {
  const TEMP_MIN = 13.5,
    TEMP_MAX = 20;
  const HUM_MIN = 85,
    HUM_MAX = 95;

  const section = await Section.findById(sectionId);

  if (data.temperature < TEMP_MIN || data.temperature > TEMP_MAX) {
    const existingTempAlert = section.tempAlert;
    if (!existingTempAlert || now > new Date(existingTempAlert) > COOLDOWN) {
      await createAlert({
        sectionId,
        title: 'Adjust Temperature',
        message: `Temperature ${data.temperature}°C is out of optimal range (${TEMP_MIN}–${TEMP_MAX}°C)`,
        type: 'Warning',
      });
      section.tempAlert = now;
      await section.save();
    }
  }
  if (data.humidity < HUM_MIN || data.humidity > HUM_MAX) {
    const existingHumAlert = section.humAlert;
    if (!existingHumAlert || now > new Date(existingHumAlert) > COOLDOWN) {
      await createAlert({
        sectionId,
        title: 'Adjust Humidity',
        message: `Humidity ${data.humidity}% is out of optimal range (${HUM_MIN}–${HUM_MAX}%)`,
        type: 'Warning',
      });
      section.humAlert = now;
      await section.save();
    }
  }
};

const checkRipenessAlerts = async (sectionId, data) => {
  const section = await Section.findById(sectionId);

  if (data.cvStage === 'spoiled') {
    const existingDisposeAlert = section.disposeAlert;
    if (
      !existingDisposeAlert ||
      now > new Date(existingDisposeAlert) > COOLDOWN
    ) {
      await createAlert({
        sectionId,
        title: 'Spoiled',
        message: `Dispose immediately`,
        type: 'Critical',
      });
      section.disposeAlert = now;
      await section.save();
    }
  } else if (data.cvStage === 'overripe') {
    const existingDiscountAlert = section.discountAlert;
    if (
      !existingDiscountAlert ||
      now > new Date(existingDiscountAlert) > COOLDOWN2
    ) {
      await createAlert({
        sectionId,
        title: 'Overripe',
        message: `Apply discount`,
        type: 'Info',
      });
      section.discountAlert = now;
      await section.save();
    }
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

module.exports = { generateAlerts };
