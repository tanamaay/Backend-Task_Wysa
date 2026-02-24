const express = require('express');
const router = express.Router();
const controller = require('../controllers/flowController');

router.post('/modules/:moduleId/start', controller.startModule);
router.post('/questions/:questionId/answer', controller.answerQuestion);

router.get('/users/:userId/current', controller.getCurrentQuestion);
router.get('/questions/:questionId', controller.handleDeepLink);

router.post('/users/:userId/back', controller.goBack);

module.exports = router;