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
        res.send(user);
        next();
    }catch(err){
        res.status(400).send("The Error is " , err.message)
    }
} 

module.exports = UserAuth;