const express = require('express');
const { getOverview, getSourceBreakdown, getStatusBreakdown, getTrends } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/sources', getSourceBreakdown);
router.get('/status', getStatusBreakdown);
router.get('/trends', getTrends);

module.exports = router;
