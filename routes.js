const express = require('express');
const router = express.Router();
const alertController = require('./controllers/alertController');
const sectionController = require('./controllers/sectionController');
const readingController = require('./controllers/readingController');

router.get('/alert', alertController.getActiveAlerts);
router.patch('/alert/:alertId', alertController.resolveAlert);

router.post('/save', readingController.createReading);

// router.post('/section/refresh', sectionController.refreshAll);
// router.post('/section/:sectionId/refresh', sectionController.refreshOne);
router.post('/section/', sectionController.createSection); //not to be used by frontend, for us to create sections quickly
router.get('/section/', sectionController.getAllSections);
router.get('/section/:sectionId', sectionController.getSectionById);

module.exports = router;
