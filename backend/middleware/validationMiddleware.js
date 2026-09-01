const { validationResult } = require('express-validator');

// Runs after express-validator's chain of checks (e.g. body('email').isEmail()).
// Collects any failures into a single, consistent 400 response.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { validate };
