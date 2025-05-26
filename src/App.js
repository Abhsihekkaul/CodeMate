const express = require("express");
const ConnectDB = require("./config/database");
require("dotenv").config();
const User = require("./Models/user"); 

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    // create a new instance of User (don't overwrite the User model)
    const newUser = new User({
      firstName: "Abhishek",
      lastName: "Kaul",
      Age: 22,
      Email: "AbhishekKaul32@gmail.com",
      Password: "Abhi@2003",
    });

    await newUser.save();
    res.send("User Created Successfully");
  } catch (error) {
    console.error("Error creating user:", error.message);
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
