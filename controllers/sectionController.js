const mongoose = require('mongoose');
const Section = require('../models/section');
// const {
//   ingestSection,
//   ingestAllSections,
// } = require('../services/ingestSection');

const createSection = async (req, res) => {
  try {
    // const { name, location, arrivedAt, currentStage } = req.body

    const newSection = await Section.create({
      ...req.body,
    });
    res.status(201).json(newSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .select('-imageBase64')
      .lean();
    res.json(
      sections.map((s) => ({
        ...s,
        _id: String(s._id),
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSectionById = async (req, res) => {
  const { sectionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(sectionId)) {
    return res.status(400).json({
      error: 'Invalid section id',
      message: `Not a valid section id: ${sectionId}`,
    });
  }
  try {
    const section = await Section.findById(sectionId)
      .select('-imageBase64')
      .lean();
    if (!section) {
      return res
        .status(404)
        .json({ message: `Section with id ${sectionId} not found` });
    }
    res.status(200).json({
      ...section,
      _id: String(section._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const refreshOne = async (req, res) => {
//   try {
//     await ingestSection(req.params.id);
//     const section = await Section.findById(req.params.id);
//     req.io.emit('sections_updated');
//     res.json(section);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const refreshAll = async (req, res) => {
//   try {
//     await ingestAllSections();
//     const sections = await Section.find({ isActive: true });
//     req.io.emit('sections_updated');
//     res.json(sections);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateSection = async (req, res) => {
//   const { sectionId } = req.params;
//   const sectionData = req.body;

//   try {
//     const section = await Section.findByIdAndUpdate(sectionId, sectionData, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json(section);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

module.exports = {
  createSection,
  getAllSections,
  getSectionById,
  // refreshOne,
  // refreshAll,
};
