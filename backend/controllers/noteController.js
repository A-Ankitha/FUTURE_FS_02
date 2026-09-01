const Note = require('../models/Note');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all notes for a lead
// @route   GET /api/leads/:id/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ lead: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addNote = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const note = await Note.create({
      lead: lead._id,
      text: req.body.text,
      author: req.user._id,
    });

    await Activity.create({
      lead: lead._id,
      type: 'note_added',
      description: `Note added by ${req.user.name}`,
      author: req.user._id,
    });

    const populated = await note.populate('author', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, addNote };
