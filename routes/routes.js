const express = require('express');
const router = express.Router();

const EventsControllers = require('../controllers/index');

router.get('/', EventsControllers.getIndex);

router.get('/processevents', EventsControllers.processEvents);

router.get('/summary/:merchantid', EventsControllers.summaryEvents);

router.get('/allevents', EventsControllers.allEvents);


module.exports = router;
