const Validator = require("validator")
const isEmpty = require("./is-empty")

module.exports = function ValidatePostInput(data) {
  let errors = {}

  data.text = !isEmpty(data.text) ? data.text : ""

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Text needs to be between 10 and 300 characters"
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required"
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}
