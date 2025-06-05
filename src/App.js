const express = require("express");
const ConnectDB = require("./config/database");
require("dotenv").config();
const User = require("./Models/user"); 
const app = express();
const ValidateSignUp = require("../src/utils/ValidateSignUp");
const bcyrpt = require('bcrypt');
const validator = require('validator');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const UserAuth = require("./Middlewares/Auth")

// Middleware to convert the req.body data from json object to js object so that our server can return this
app.use(express.json());
app.use(cookieParser());



// Sign up user
app.post('/signup', async (req, res) => {
  try {
    // Validate the req.body
    ValidateSignUp(req);

    const {firstName,lastName,Password,Email, Age} = req.body;

    // Encrypt the password
    const unEncryptedPass = req.body.Password;
    const encryptedPassword = await bcyrpt.hash(unEncryptedPass, 10);


    // create a new instance of User (don't overwrite the User model)
    const newUser = new User({
      firstName : firstName,
      lastName : lastName,
      Email : Email,
      Password : encryptedPassword,
      Age : Age,
    });

    console.log(newUser);

    await newUser.save();
    res.send("User Created Successfully");
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Get User by Email
app.get("/getUser", async (req, res) => {

  const email = req.body.Email;

  try {
    const GetUser = await User.find({ Email: email });
    console.log("User Found:", GetUser);
    res.send(GetUser);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});


// Del user api
app.delete("/delUser", async (req, res) => {

  const UserID = req.body.userID;

  try {
    const GetUser = await User.findByIdAndDelete(UserID);
    res.send("User Deleted Successfully!");
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Del user api
app.patch("/updateUser/:userID", async (req, res) => {

  const UserID = req.params?.userID;
  const data = req.body;

  try {

    // Making sure only right things are there for the update
    const AllowedUpdates = ["firstName","Skills", "About", "PhotoURL","Age"];
    const isUpdateAllowed = Object.keys(data).every((k)=> AllowedUpdates.includes(k));
    if(!isUpdateAllowed){
      throw new Error("Updates not Allowed!");
    }

    // Making sure number of skills added or updates are not more than 10
    if(data?.Skills?.length > 10){
      throw new Error("You can not allowed to add more than 10 skills!");
    }
    const GetUser = await User.findByIdAndUpdate(UserID, data, { returnDocument : 'after', runValidators : true});
    res.send("User Updated Successfully!");
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/Login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      throw new Error("Please enter the email and password.");
    }

    if (!validator.isEmail(Email)) {
      throw new Error("Email ID is not valid.");
    }

    const user = await User.findOne({ Email });
    if (!user) {
      throw new Error("User not found in the database.");
    }

    const isValidPassword = ValidPassword(Password);
    if (!isValidPassword) {
      throw new Error("Password is not valid.");
    }

    // creating jwt token
    const token = await JWT_Token();

    // attaching the token to the cookie
    res.cookie("token", token);

    res.send("User logged in successfully.");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});



app.get("/profile", UserAuth ,  async (req,res)=>{
  try{
    const user = req.user;
    res.send("user");
  }catch(err){
    res.status(400).send(err.message);
  }
})

// Connect to DB and then start server
ConnectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error(" Error connecting to DB:", err.message);
  });
