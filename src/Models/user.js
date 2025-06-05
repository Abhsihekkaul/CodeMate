const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 50,
    },
    lastName : {
        type : String,
        minLength : 3,
        maxLength : 50,
    },
    Age : {
        type : Number,
        required : true,
        min : 16,
        max : 100
    },
    Gender : {
        type : String,
        lowercase : true,
        validate(value){
            if(!["male", "female", "others", "other"].includes(value)){
                throw new Error("Gender is not correct!");
            }
        }
    },
    Email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid " + value);
            }
        }

    },
    Password : {
        type : String,
        required : true,
    },
    Skills : {
        type : [String],

    },
    About : {
        type : String,
        default : "I am the About Section",
        trim : true,
        maxLength : 200,
        minLength : 15,
    },
    PhotoURL : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT48Ke_Q2uphy_MQect9sVe9j0zRyea2Kp26g&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Url is not valid " + value);
            }
        }
    }
},
 {
    timestamps : true,
});


// creating schema methods (Always make sure to keep it all in terms of function not arrow function as we will be using this )

UserSchema.method.JWT_Token = async function(){
     const user = this;

     const token = await jwt.sign({_id : user._id}, "CodeMate$123", {
        expiresIn : "1d",
     });

     return token;
}  

UserSchema.method.ValidPassword = async function(userInputPassword){
    const user = this;
    const passwordHash = user.Password;

    const verifyPassword = await bcrypt.compare(userInputPassword, passwordHash);

    return verifyPassword;
}

const User = mongoose.model("User", UserSchema);
module.exports = User;