const mongoose = require("mongoose");

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
    } catch (err) {
        console.error("❌ There is a problem in DB connection:", err.message);
        throw err;
    }
};

module.exports = ConnectDB;
