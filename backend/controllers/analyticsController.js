const Lead = require('../models/Lead');

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'];

// @desc    High-level KPI overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res, next) => {
  try {
    const [total, newCount, contacted, qualified, converted, lost] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Qualified' }),
      Lead.countDocuments({ status: 'Converted' }),
      Lead.countDocuments({ status: 'Lost' }),
    ]);

    const conversionRate = total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      data: {
        total,
        new: newCount,
        contacted,
        qualified,
        converted,
        lost,
        conversionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lead counts grouped by source
// @route   GET /api/analytics/sources
// @access  Private
const getSourceBreakdown = async (req, res, next) => {
  try {
    const results = await Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(results.map((r) => [r._id, r.count]));

    // Ensure every known source appears, even with a zero count, so the
    // chart doesn't silently omit categories with no leads yet.
    const data = SOURCES.map((source) => ({ source, count: counts[source] || 0 }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Lead counts grouped by status
// @route   GET /api/analytics/status
// @access  Private
const getStatusBreakdown = async (req, res, next) => {
  try {
    const results = await Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(results.map((r) => [r._id, r.count]));

    const data = STATUSES.map((status) => ({ status, count: counts[status] || 0 }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Lead creation trend over the last N days (default 30)
// @route   GET /api/analytics/trends
// @access  Private
const getTrends = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 30, 365);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const results = await Lead.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    const counts = Object.fromEntries(results.map((r) => [r._id, r.count]));

    // Fill in every day in the range, even with zero leads, so the line
    // chart shows a continuous trend rather than gaps.
    const data = [];
    for (let i = 0; i < days; i += 1) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      data.push({ date: key, count: counts[key] || 0 });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getSourceBreakdown, getStatusBreakdown, getTrends };
