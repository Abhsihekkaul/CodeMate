const validator = require('validator')
const ValidateSignUp = (req) =>{
    const {firstName, lastName, Password, Email} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not Valid!")
    }else if(!validator.isEmail(Email)){
        throw new Error("Email is not Valid")
    }else if(!validator.isStrongPassword(Password)){
        throw new Error("Password you have entered is not strong please try again!")
    }
}


module.exports = ValidateSignUp;