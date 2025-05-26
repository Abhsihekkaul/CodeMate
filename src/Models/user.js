const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        require : true,
    },
    lastName : {
        type : String,
        require : true,
    },
    Age : {
        type : Number,
        require : true,
    },
    Email : {
        type : String,
        require : true,
    },
    Password : {
        type : String,
        require : true,
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;