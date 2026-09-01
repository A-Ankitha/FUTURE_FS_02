const express = require('express');
const { body, param } = require('express-validator');
const { getNotes, addNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router.get('/:id/notes', param('id').isMongoId(), validate, getNotes);
router.post(
  '/:id/notes',
  [param('id').isMongoId(), body('text').trim().notEmpty().withMessage('Note text is required')],
  validate,
  addNote
);

module.exports = router;
