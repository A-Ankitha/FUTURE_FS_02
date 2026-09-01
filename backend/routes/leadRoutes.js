const express = require('express');
const { body, param } = require('express-validator');
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getFollowUps,
  rescheduleFollowUp,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// All lead management routes require an authenticated admin.
router.use(protect);

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').optional({ checkFalsy: true }).isString(),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'])
    .withMessage('Invalid source value'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Converted', 'Lost'])
    .withMessage('Invalid status value'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority value'),
  body('followUpDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid follow-up date'),
];

router.get('/', getLeads);
router.get('/followups/board', getFollowUps);
router.get('/:id', param('id').isMongoId().withMessage('Invalid lead id'), validate, getLeadById);
router.post('/', leadValidation, validate, createLead);
router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead id'), ...leadValidation],
  validate,
  updateLead
);
router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid lead id'),
    body('status')
      .isIn(['New', 'Contacted', 'Qualified', 'Converted', 'Lost'])
      .withMessage('Invalid status value'),
  ],
  validate,
  updateLeadStatus
);
router.patch(
  '/:id/followup',
  [param('id').isMongoId().withMessage('Invalid lead id'), body('followUpDate').isISO8601().withMessage('Invalid follow-up date')],
  validate,
  rescheduleFollowUp
);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid lead id'), validate, deleteLead);

module.exports = router;
