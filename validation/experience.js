const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function ValidateExperienceInput(data) {
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ""
  data.company = !isEmpty(data.company) ? data.company : ""
  data.from = !isEmpty(data.from) ? data.from : ""

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required"
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required"
  }

  if (!Validator.isISO8601(data.from)) {
    errors.from = "Please format to YYYY-MM-DD"
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required"
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}
