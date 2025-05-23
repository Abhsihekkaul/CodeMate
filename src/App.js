const express = require("express");
const App = express();

App.get("/",(req,res)=>{
    res.send("Hey Abhishek");
})


App.listen(5000,()=>{
    console.log("You server is build on top of 5000 port number");
})