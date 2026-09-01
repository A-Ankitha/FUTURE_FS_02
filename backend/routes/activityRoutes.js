const express = require('express');
const { param } = require('express-validator');
const { getActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.get('/:id/activities', param('id').isMongoId(), validate, getActivities);

module.exports = router;
