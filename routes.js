const express = require('express');
const router = express.Router();
const alertController = require('./controllers/alertController');
const sectionController = require('./controllers/sectionController');
const readingController = require('./controllers/readingController');

//called by frontend to display all alerts on alerts page
router.get('/alert', alertController.getActiveAlerts);

//called by frontend to update alertStatus from active -> resolved
router.patch('/alert/:alertId', alertController.resolveAlert);

//called by Rpi to
// - create a new Reading
// - calculate remainingShelfLife & discount
// - update Section with latest values
router.post('/save', readingController.processReading);

// router.post('/section/refresh', sectionController.refreshAll);
// router.post('/section/:sectionId/refresh', sectionController.refreshOne);

//not to be used by frontend, for us to create sections quickly using postman
router.post('/section/', sectionController.createSection);

//called by frontend to display all sections in homepage
router.get('/section/', sectionController.getAllSections);

//called by frontend to display specific section page
//also generate alerts if needed
router.get('/section/:sectionId', sectionController.getSectionById);

module.exports = router;
