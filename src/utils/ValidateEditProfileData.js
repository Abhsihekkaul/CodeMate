// utils/validateEditProfileData.js
const validator = require("validator");

const allowedFields = ["firstName", "lastName", "Age", "Gender", "Skills", "About", "PhotoURL"];

function validateEditProfileData(req) {
  const updates = Object.keys(req.body);

  // Check for disallowed fields
  const isValidUpdate = updates.every((field) => allowedFields.includes(field));
  if (!isValidUpdate) return false;

  const { Gender, Age, Password, PhotoURL, About } = req.body;

  if (Gender && !["male", "female", "other", "others"].includes(Gender.toLowerCase())) return false;

  if (Age && (isNaN(Age) || Age < 16 || Age > 100)) return false;

  if (PhotoURL && !validator.isURL(PhotoURL)) return false;

  if (About && (About.length < 15 || About.length > 200)) return false;

  return true;
}

module.exports = validateEditProfileData;
