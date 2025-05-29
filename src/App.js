const express = require("express");
const ConnectDB = require("./config/database");
require("dotenv").config();
const User = require("./Models/user"); 
const app = express();

// Middleware to convert the req.body data from json object to js object so that our server can return this
app.use(express.json());



// Sign up user
app.post('/signup', async (req, res) => {
  try {
    // create a new instance of User (don't overwrite the User model)
    const newUser = new User(req.body);

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
app.patch("/updateUser", async (req, res) => {

  const UserID = req.body.userID;
  const data = req.body;

  try {
    const GetUser = await User.findByIdAndUpdate(UserID, data, { returnDocument : 'after'});
    res.send("User Updated Successfully!");
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});




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
