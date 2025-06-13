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


const AuthRouter = require("./routes/AuthRouter");

const ProfileRouter = require("./routes/ProfileRouter");

const RequestRouter = require("./routes/RequestRouter");

const UserRouter = require("./routes/UserRoute.js");


app.use("/", AuthRouter);
app.use("/", ProfileRouter);
app.use("/", RequestRouter);
app.use("/", UserRouter);

// Connect to DB and then start server
ConnectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(10000, () => {
      console.log("Server is running on port 10000");
    });
  })
  .catch((err) => {
    console.error(" Error connecting to DB:", err.message);
  });
