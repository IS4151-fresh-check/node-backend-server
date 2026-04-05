const Reading = require('../models/reading');

const createReading = async (req, res) => {
  // const {
  //   sectionId,
  //   humidity,
  //   temperature,
  //   remainingShelfLife,
  //   ppm,
  //   gasStage,
  //   gasConfidence,
  //   action,
  //   cvStage,
  //   cvConfidence,
  //   imageBase64,
  // } = req.body;

  try {
    const newReading = await Reading.create({
      ...req.body,
    });

    res.status(201).json(newReading);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReading,
  createAlert,
};
