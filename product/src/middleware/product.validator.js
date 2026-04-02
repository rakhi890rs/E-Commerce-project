const { body, validationResult } = require("express-validator");

//  separate error handler
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
}

//  only validation rules here
const createProductValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("priceAmount")
    .notEmpty().withMessage("Price amount is required")
    .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),

  body("priceCurrency")
    .optional()
    .isIn(["USD", "INR"]).withMessage("Currency must be USD or INR")
];

module.exports = {
  createProductValidator,
  handleValidationErrors
};