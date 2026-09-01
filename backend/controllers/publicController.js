const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Submit a lead from the public /contact form
// @route   POST /api/public/contact
// @access  Public
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, message, service } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      source: source || 'Website',
      message,
      service,
      status: 'New',
      priority: 'Medium',
    });

    await Activity.create({
      lead: lead._id,
      type: 'lead_created',
      description: 'Lead submitted via public contact form',
    });

    res.status(201).json({
      success: true,
      message: "Thanks! Your inquiry has been received. Our team will get back to you shortly.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContactForm };
