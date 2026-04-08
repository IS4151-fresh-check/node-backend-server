////////////////////////////not in use///////////////////////////////////////

// const Reading = require('../models/reading');
// const Section = require('../models/section');
// const { evaluateSection } = require('./evaluateSection');
// const axios = require('axios');

// const ingestingNow = new Set();

// async function ingestSection(sectionId) {
//   if (ingestingNow.has(sectionId.toString())) return;
//   ingestingNow.add(sectionId.toString());

//   try {
//     const response = await axios.get(`${process.env.RPI_URL}/latest`);
//     const data = await response.data;

//     await Reading.create({ sectionId, ...data });
//     await evaluateSection(sectionId, data);
//   } catch (err) {
//     console.error(`Ingestion failed for ${sectionId}: ${error.message}`);
//   } finally {
//     ingestingNow.delete(sectionId.toString());
//   }
// }

// async function ingestAllSections() {
//   const sections = await Section.find();
//   await Promise.all(sections.map((s) => ingestSection(s._id)));
// }

// module.exports = { ingestSection, ingestAllSections };
