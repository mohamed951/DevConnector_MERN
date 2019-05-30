const Validator = require("validator");
const isEmpty = require("./isEmpty");
const validateLoginData = obj => {
  const errors = {};
  obj.email = !isEmpty(obj.email) ? obj.email : "";
  obj.password = !isEmpty(obj.password) ? obj.password : "";

  if (!Validator.isEmail(obj.email)) errors.email = "Invalid Email";

  if (isEmpty(obj.email)) errors.email = "Email required";

  if (!Validator.isLength(obj.password, { min: 2, max: 12 }))
    errors.password = "Password must be between 2 and 12 charachters";

  if (isEmpty(obj.password)) errors.password = "Password required";

  const isValid = isEmpty(errors);
  return { errors, isValid };
};

module.exports = validateLoginData;
