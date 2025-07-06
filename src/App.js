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
const cors = require('cors');
// CORS Configuration - MUST be before other middleware
// const corsOptions = {
//   , // Add both variations
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
//   credentials: true,
//   optionsSuccessStatus: 200 // For legacy browser support
//};

// Apply CORS middleware FIRST
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
// Other middleware AFTER CORS
app.use(express.json());
app.use(cookieParser());

// Routes
const AuthRouter = require("./routes/AuthRouter");
const ProfileRouter = require("./routes/ProfileRouter");
const RequestRouter = require("./routes/RequestRouter");
const UserRouter = require("./routes/UserRoute.js");

app.use("/", AuthRouter);
app.use("/", ProfileRouter);
app.use("/", RequestRouter);
app.use("/", UserRouter);

const http = require('http');
const initilizeSocket = require("./utils/socket.js");
const server = http.createServer(app);
initilizeSocket(server);
// Connect to DB and then start server
ConnectDB()
  .then(() => {
    console.log("DB connected successfully");
    server.listen(10000, () => {
      console.log("Server is running on port 10000");
      // console.log("CORS enabled for:", corsOptions.origin);
    });
  })
  .catch((err) => {
    console.error(" Error connecting to DB:", err.message);
  });