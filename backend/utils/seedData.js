// Populates the database with a demo admin and realistic fictional leads so
// the dashboard looks useful immediately. Run with: npm run seed
// WARNING: this clears existing Lead/Note/Activity data.
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Note = require('../models/Note');
const Activity = require('../models/Activity');

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'];

const companies = [
  'Northwind Traders', 'Bluepeak Studio', 'Rivergate Consulting', 'Amberline Media',
  'Solstice Analytics', 'Fernwood Interiors', 'Cobalt Logistics', 'Harborlight Finance',
  'Maple & Co', 'Ironvale Systems', 'Sundial Marketing', 'Willowbrook Retail',
  'Cedarpoint Legal', 'Brightfield Realty', 'Lantern Digital', 'Crestview Architects',
];

const firstNames = ['Ava', 'Liam', 'Maya', 'Noah', 'Priya', 'Ethan', 'Zara', 'Kabir', 'Elena', 'Omar', 'Sofia', 'Leo', 'Anika', 'Diego', 'Nora', 'Rohan'];
const lastNames = ['Sharma', 'Bennett', 'Patel', 'Novak', 'Reyes', 'Klein', 'Iyer', 'Foster', 'Mehta', 'Larsen', 'Costa', 'Wallace', 'Nair', 'Green', 'Dubey', 'Hayes'];

const services = ['Web Design', 'SEO Consulting', 'Brand Strategy', 'App Development', 'Marketing Automation'];

const sampleMessages = [
  "We're looking for a partner to redesign our client onboarding flow.",
  'Interested in learning more about your pricing and timelines.',
  'Referred by a colleague — would love a quick intro call.',
  'Our current vendor isn\'t meeting our needs; exploring alternatives.',
  'Saw your recent case study and wanted to discuss a similar project.',
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (daysAgoMin, daysAgoMax) => {
  const days = Math.floor(Math.random() * (daysAgoMax - daysAgoMin + 1)) + daysAgoMin;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};
const futureDate = (daysMin, daysMax) => {
  const days = Math.floor(Math.random() * (daysMax - daysMin + 1)) + daysMin;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const seed = async () => {
  await connectDB();

  console.log('Clearing existing Lead, Note, and Activity data...');
  await Lead.deleteMany({});
  await Note.deleteMany({});
  await Activity.deleteMany({});

  let admin = await User.findOne({ email: 'admin@leadflow.dev' });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: 'admin@leadflow.dev', password: 'admin123' });
    console.log('Created demo admin: admin@leadflow.dev / admin123');
  } else {
    console.log('Demo admin already exists: admin@leadflow.dev');
  }

  const leadsToCreate = 42;
  const createdLeads = [];

  for (let i = 0; i < leadsToCreate; i += 1) {
    const first = randomFrom(firstNames);
    const last = randomFrom(lastNames);
    const status = randomFrom(STATUSES);
    const createdAt = randomDate(1, 75);

    // Overdue / today / upcoming follow-ups get deliberately distributed so
    // the Follow-ups board and dashboard "overdue" count are meaningful.
    let followUpDate = null;
    if (!['Converted', 'Lost'].includes(status)) {
      const bucket = Math.random();
      if (bucket < 0.2) followUpDate = randomDate(1, 6); // overdue
      else if (bucket < 0.3) followUpDate = new Date(); // today
      else if (bucket < 0.8) followUpDate = futureDate(1, 14); // upcoming
    }

    const lead = new Lead({
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      company: randomFrom(companies),
      source: randomFrom(SOURCES),
      message: randomFrom(sampleMessages),
      service: randomFrom(services),
      status,
      priority: randomFrom(PRIORITIES),
      followUpDate,
      lastContacted: status !== 'New' ? randomDate(0, 20) : undefined,
      convertedAt: status === 'Converted' ? randomDate(0, 15) : undefined,
      createdAt,
      updatedAt: createdAt,
    });

    await lead.save();
    createdLeads.push(lead);

    await Activity.create({
      lead: lead._id,
      type: 'lead_created',
      description: 'Lead submitted via public contact form',
      createdAt,
    });

    if (status !== 'New') {
      await Activity.create({
        lead: lead._id,
        type: 'status_changed',
        description: `Status changed from New to ${status}`,
        author: admin._id,
        createdAt: randomDate(0, 20),
      });

      await Note.create({
        lead: lead._id,
        text: randomFrom([
          'Sent introductory email.',
          'Client requested pricing details.',
          'Follow-up scheduled after positive call.',
          'Waiting on internal budget approval.',
          'Shared proposal deck for review.',
        ]),
        author: admin._id,
      });
    }
  }

  console.log(`Seeded ${createdLeads.length} leads with notes and activity history.`);
  console.log('Done.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
