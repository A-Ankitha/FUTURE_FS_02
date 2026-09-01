const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

noteSchema.index({ lead: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
