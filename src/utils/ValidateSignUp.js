const validator = require('validator')
const ValidateSignUp = (req) =>{
    const {firstName, lastName, Age, Skills, PhotoURL, Password, Email } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not Valid!")
    }else if(!validator.isEmail(Email)){
        throw new Error("Email is not Valid")
    }else if(!validator.isStrongPassword(Password)){
        throw new Error("Password you have entered is not strong please try again!")
    }else if(!validator.isURL(PhotoURL)){
        throw new Error("PhotoURL is not valid!")
    }else if(!(Age < 100 && Age > 16)){
        throw new Error("Age is not Valid")
    }
}


module.exports = ValidateSignUp;