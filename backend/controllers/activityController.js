const Activity = require('../models/Activity');

// @desc    Get the activity timeline for a lead
// @route   GET /api/leads/:id/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ lead: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivities };
