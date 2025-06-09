const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const UserAuth = async (req,res,next) => {
    try{
        const cookies = req.cookies;
        if(!cookies){
            throw new Error("Cookies not found!")
        }
        const {token} = cookies;
        if(!token){
            throw new Error("Token does not Exist");
        }
        const decodedMessage = await jwt.verify(token, "CodeMate$123");
        if(!decodedMessage){
            throw new Error("Token is not getting verified");
        }

        const { _id } = decodedMessage;
        const user = User.findById(_id);
        if(!user){
            throw new Error("User does not exist!");
        }
        req.user = user;
        next();
    }catch(err){
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(400).json({ error: err.message });
    }
} 

module.exports = UserAuth;