const express = require('express');
const { body } = require('express-validator');
const { submitContactForm } = require('../controllers/publicController');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').optional({ checkFalsy: true }).isString(),
    body('message').optional({ checkFalsy: true }).isString(),
    body('source')
      .optional({ checkFalsy: true })
      .isIn(['Website', 'Referral', 'LinkedIn', 'Instagram', 'Email', 'Other'])
      .withMessage('Invalid source value'),
  ],
  validate,
  submitContactForm
);

module.exports = router;
