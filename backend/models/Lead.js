const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'],
      default: 'Website',
    },
    message: {
      type: String,
      trim: true,
    },
    service: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    followUpDate: {
      type: Date,
    },
    lastContacted: {
      type: Date,
    },
    convertedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Speeds up the common list-page queries: search, filter, and sort.
leadSchema.index({ name: 'text', email: 'text', company: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ followUpDate: 1 });

module.exports = mongoose.model('Lead', leadSchema);
