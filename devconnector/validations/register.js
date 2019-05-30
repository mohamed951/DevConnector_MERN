const Validator = require("validator");
const isEmpty = require("./isEmpty");
const validateRegisterData = obj => {
  const errors = {};
  obj.name = !isEmpty(obj.name) ? obj.name : "";
  obj.email = !isEmpty(obj.email) ? obj.email : "";
  obj.password = !isEmpty(obj.password) ? obj.password : "";
  obj.password2 = !isEmpty(obj.password2) ? obj.password2 : "";

  if (!Validator.isLength(obj.name, { min: 2, max: 12 }))
    errors.name = "Name must be between 2 and 12 charachters";

  if (isEmpty(obj.name)) errors.name = "Name required";

  if (!Validator.isEmail(obj.email)) errors.email = "Invalid Email";

  if (isEmpty(obj.email)) errors.email = "Email required";

  if (!Validator.isLength(obj.password, { min: 2, max: 12 }))
    errors.password = "Password must be between 2 and 12 charachters";

  if (isEmpty(obj.password)) errors.password = "Password required";

  if (!Validator.equals(obj.password, obj.password2))
    errors.password2 = "Password Not Match";

  if (isEmpty(obj.password2)) errors.password2 = "Confirm Password required";

  const isValid = isEmpty(errors);
  return { errors, isValid };
};

module.exports = validateRegisterData;
