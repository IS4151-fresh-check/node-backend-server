const Reading = require('../models/reading');
const Section = require('../models/section');
const {
  calculateShelfLife,
  calculateDiscount,
} = require('../services/calculationService');

const processReading = async (req, res) => {
  const {
    sectionId,
    humidity,
    temperature,
    ppm,
    ppmSlope,
    gasStage,
    gasConfidence,
    action,
    cvStage,
    cvConfidence,
    imageBase64,
  } = req.body;

  try {
    //check if section ID exists
    const sectionExists = await await Section.exists({ _id: sectionId });
    if (!sectionExists) {
      return res.status(404).json({
        error: `Unable to save reading. Section ID ${sectionId} does not exist!`,
      });
    }

    //create new Reading
    const newReading = await Reading.create({
      ...req.body,
    });
    res.status(201).json('New reading saved: ', newReading);

    //calculations
    const remainingShelfLife = await calculateShelfLife(ppm, ppmSlope);
    const discount = await calculateDiscount(cvStage, remainingShelfLife);

    //update relevant values in corresponding Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        remainingShelfLife: remainingShelfLife,
        ppm: ppm,
        humidity: humidity,
        temperature: temperature,
        currentStage: cvStage,
        discountPercentage: discount,
        imageBase64: imageBase64,
      },
      { returnDocument: 'after' },
    );
    res.json({ message: 'Corresponding section updated!', updatedSection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  processReading,
};
