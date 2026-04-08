const Section = require('../models/section');
const Alert = require('../models/alert');

const generateAlerts = async (sectionId, data) => {
  await checkEnvironmentAlerts(sectionId, data);
  await checkRipenessAlerts(sectionId, data);
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
    if (!existingTempAlert || now - new Date(existingTempAlert) > COOLDOWN) {
      await createAlert({
        sectionId,
        title: `Adjust Temperature for ${data.name} at ${data.location}`,
        message: `Temperature ${data.temperature}°C is out of optimal range (${TEMP_MIN}–${TEMP_MAX}°C)`,
        type: 'warning',
      });
      section.tempAlert = now;
      await section.save();
      console.log('new temperature alert created');
    } else {
      console.log('cooldown not over for temperature alert');
    }
  }
  if (data.humidity < HUM_MIN || data.humidity > HUM_MAX) {
    const existingHumAlert = section.humAlert;
    if (!existingHumAlert || now - new Date(existingHumAlert) > COOLDOWN) {
      await createAlert({
        sectionId,
        title: `Adjust Humidity for ${data.name} at ${data.location}`,
        message: `Humidity ${data.humidity}% is out of optimal range (${HUM_MIN}–${HUM_MAX}%)`,
        type: 'warning',
      });
      section.humAlert = now;
      await section.save();
      console.log('new humidity alert created');
    } else {
      console.log('cooldown not over for humidity alert');
    }
  }
};

const checkRipenessAlerts = async (sectionId, data) => {
  const section = await Section.findById(sectionId);

  if (data.currentStage === 'spoiled') {
    const existingDisposeAlert = section.disposeAlert;
    if (
      !existingDisposeAlert ||
      now - new Date(existingDisposeAlert) > COOLDOWN
    ) {
      await createAlert({
        sectionId,
        title: `${data.name} at ${data.location} is spoiled.`,
        message: `Dispose immediately.`,
        type: 'critical',
      });
      section.disposeAlert = now;
      await section.save();
      console.log('new dispose alert created');
    } else {
      console.log('cooldown not over for spoil alert');
    }
  } else if (data.currentStage === 'overripe' || data.currentStage === 'ripe') {
    const existingDiscountAlert = section.discountAlert;
    if (
      !existingDiscountAlert ||
      now - new Date(existingDiscountAlert) > COOLDOWN2
    ) {
      await createAlert({
        sectionId,
        title: `${data.name} at ${data.location} is ${data.currentStage}.`,
        message: `We recommend you to apply discount of ${data.discountPercentage}%`,
        type: 'info',
      });
      section.discountAlert = now;
      await section.save();
      console.log('new discount alert created');
    } else {
      console.log('cooldown not over for discount alert');
    }
  }
};

const createAlert = async (data) => {
  try {
    const newAlert = await Alert.create({
      ...data,
      status: 'active',
    });
    return newAlert;
  } catch (err) {
    console.error('Alert Creation Error:', err);
    throw err;
  }
};

module.exports = { generateAlerts };
