const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const Note = require('../models/Note');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilter = (query) => {
  const filter = {};

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(escapeRegex(query.search.trim()), 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { company: searchRegex },
    ];
  }
  if (query.status && query.status !== 'All') {
    filter.status = query.status;
  }
  if (query.priority) {
    filter.priority = query.priority;
  }
  if (query.source) {
    filter.source = query.source;
  }
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  return filter;
};

const buildSort = (sort) => {
  switch (sort) {
    case 'oldest':
      return { createdAt: 1 };
    case 'name':
      return { name: 1 };
    case 'priority': {
      return null;
    }
    case 'followUpDate':
      return { followUpDate: 1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

// @desc    Get all leads with search, filter, sort, pagination
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const skip = (page - 1) * limit;

    const filter = buildFilter(req.query);
    const sort = buildSort(req.query.sort);

    let leadsQuery = Lead.find(filter);
    if (sort) {
      leadsQuery = leadsQuery.sort(sort);
    }

    let leads = await leadsQuery.skip(skip).limit(limit).lean();

    // Priority has a business-defined order (High > Medium > Low), not an
    // alphabetical one, so it's applied in-memory on the paginated page.
    if (req.query.sort === 'priority') {
      leads = leads.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }

    const total = await Lead.countDocuments(filter);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit) || 1,
        totalResults: total,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a lead (admin-created, e.g. via "+ Add Lead")
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);

    await Activity.create({
      lead: lead._id,
      type: 'lead_created',
      description: `Lead created by ${req.user.name}`,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead's details
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const previousStatus = lead.status;
    Object.assign(lead, req.body);
    await lead.save();

    await Activity.create({
      lead: lead._id,
      type: 'lead_updated',
      description: `Lead details updated by ${req.user.name}`,
      author: req.user._id,
    });

    if (req.body.status && req.body.status !== previousStatus) {
      await Activity.create({
        lead: lead._id,
        type: 'status_changed',
        description: `Status changed from ${previousStatus} to ${req.body.status}`,
        author: req.user._id,
      });
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update only a lead's status (pipeline transitions)
// @route   PATCH /api/leads/:id/status
// @access  Private
const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const previousStatus = lead.status;
    lead.status = status;

    if (status === 'Contacted' && !lead.lastContacted) {
      lead.lastContacted = new Date();
    }
    if (status === 'Converted') {
      lead.convertedAt = new Date();
    }

    await lead.save();

    await Activity.create({
      lead: lead._id,
      type: status === 'Converted' ? 'lead_converted' : 'status_changed',
      description: `Status changed from ${previousStatus} to ${status}`,
      author: req.user._id,
    });

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await Note.deleteMany({ lead: lead._id });
    await Activity.deleteMany({ lead: lead._id });
    await lead.deleteOne();

    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get follow-ups grouped into overdue / today / upcoming
// @route   GET /api/leads/followups/board
// @access  Private
const getFollowUps = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const baseFilter = {
      followUpDate: { $ne: null },
      status: { $nin: ['Converted', 'Lost'] },
    };

    const [overdue, today, upcoming] = await Promise.all([
      Lead.find({ ...baseFilter, followUpDate: { $lt: startOfToday } }).sort({ followUpDate: 1 }),
      Lead.find({ ...baseFilter, followUpDate: { $gte: startOfToday, $lte: endOfToday } }).sort({
        followUpDate: 1,
      }),
      Lead.find({ ...baseFilter, followUpDate: { $gt: endOfToday } }).sort({ followUpDate: 1 }),
    ]);

    res.json({
      success: true,
      data: { overdue, today, upcoming },
      counts: { overdue: overdue.length, today: today.length, upcoming: upcoming.length },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule (or set) a lead's follow-up date
// @route   PATCH /api/leads/:id/followup
// @access  Private
const rescheduleFollowUp = async (req, res, next) => {
  try {
    const { followUpDate } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const hadPrevious = Boolean(lead.followUpDate);
    lead.followUpDate = followUpDate;
    await lead.save();

    await Activity.create({
      lead: lead._id,
      type: hadPrevious ? 'follow_up_updated' : 'follow_up_scheduled',
      description: hadPrevious
        ? `Follow-up rescheduled to ${new Date(followUpDate).toLocaleDateString()}`
        : `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}`,
      author: req.user._id,
    });

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getFollowUps,
  rescheduleFollowUp,
};
