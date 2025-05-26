const express = require("express");
const ConnectDB = require("./config/database");
require("dotenv").config(); 

const app = express();

app.get("/", (req, res) => {
    res.send("Hey Abhishek");
});

// Connect to DB and then start server
ConnectDB()
  .then(() => {
    console.log("✅ DB connected successfully");

    app.listen(5000, () => {
      console.log("🚀 Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err.message);
  });
