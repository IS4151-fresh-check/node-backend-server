const Reading = require('../models/reading');
const Section = require('../models/section');
const {
  calculateDaysToNextStage,
  calculateDiscount,
} = require('../services/calculationService');
const { generateAlerts } = require('../services/alertsService');

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
    const sectionExists = await Section.exists({ _id: sectionId });
    if (!sectionExists) {
      return res.status(404).json({
        error: `Unable to save reading. Section ID ${sectionId} does not exist!`,
      });
    }

    //create new Reading
    const newReading = await Reading.create({
      ...req.body,
    });

    //calculations
    const daysToNextStage = await calculateDaysToNextStage(ppm, ppmSlope);
    const discountPercentage = await calculateDiscount(
      cvStage,
      daysToNextStage,
    );

    //update relevant values in corresponding Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        daysToNextStage: daysToNextStage,
        ppm: ppm,
        humidity: humidity,
        temperature: temperature,
        currentStage: cvStage,
        discountPercentage: discountPercentage,
        imageBase64: imageBase64,
      },
      { returnDocument: 'after' },
    );

    //generate alerts if needed
    await generateAlerts(sectionId, updatedSection);

    res.status(201).json({
      message: 'Data processed successfully',
      reading: newReading,
      section: updatedSection,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  processReading,
};
