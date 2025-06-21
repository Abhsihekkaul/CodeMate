const validator = require("validator");

const ValidateSignUp = (req) => {
  const { firstName, lastName, Age, Skills, PhotoURL, Password, Email } = req.body;

  const numericAge = Number(Age);

  if (!firstName || !lastName) {
    return "Name is not valid!";
  } else if (!validator.isEmail(Email)) {
    return "Email is not valid!";
  } else if (!validator.isStrongPassword(Password)) {
    return "Password is not strong!";
  } else if (!validator.isURL(PhotoURL)) {
    return "Photo URL is not valid!";
  } else if (!(numericAge > 16 && numericAge <= 100)) {
    return "Age must be between 17 and 100.";
  }

  return null; // valid
};

module.exports = ValidateSignUp;
