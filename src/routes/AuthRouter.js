const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthRouter = express.Router();
const ValidateSignUp = require("../utils/ValidateSignUp");
const User = require('../Models/user');
const UserAuth = require("../Middlewares/Auth");



// Signup Route
AuthRouter.post('/signup', async (req, res) => {
  try {
    const errorMessage = ValidateSignUp(req);
    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const { firstName, lastName, Password, Email, Age, Skills, PhotoURL } = req.body;
    const encryptedPassword = await bcrypt.hash(Password, 10);

    const ExistEmailAdress = await User.findOne({
      Email : Email,
    })

    if (ExistEmailAdress) {
      return res.status(409).json({ error: "Email already exists. Please try with different email." });
    }


    const newUser = new User({
      firstName,
      lastName,
      Age,
      Skills,
      PhotoURL,
      Email,
      Password: encryptedPassword,
    });

    await newUser.save();
    res.status(201).send("User Created Successfully");
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Login Route
AuthRouter.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Check if user exists
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare password using instance method
    const isPasswordValid = await user.ValidPassword(Password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token using instance method
    const token = await user.JWT_Token();

     // ✅ Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production (HTTPS)
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName : user.lastName,
        Age : user.Age,
        Gender : user.Gender,
        Skills : user.Skills,
        About : user.About,
        PhotoURL : user.PhotoURL,
        Email: user.Email
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete User Route
AuthRouter.delete("/delUser", async (req, res) => {
  try {
    const { userID } = req.body;

    await User.findByIdAndDelete(userID);

    res.send("User Deleted Successfully!");
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});


// Delete User Route
AuthRouter.post("/logout", async (req, res) => {
  
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });
  res.status(200).send("Logout successful!");

});

// Forget password

// AuthRouter.post("/Forgot", UserAuth, async (req, res) => {
  


// });

module.exports = AuthRouter;
