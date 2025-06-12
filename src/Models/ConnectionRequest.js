const mongoose = require('mongoose');

const ConnectionRequestSchema = mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ["interested", "ignored", "accepted", "rejected"],
        required: true
    }
}, {
    timestamps: true,
});

// making compound index
// will get optimized by mongoose 
ConnectionRequestSchema.index({ toUserId : 1, fromUserId : 1,})

// Using the UserRequest pre does not exist 

ConnectionRequestSchema.pre("save", function(next){
    const ConnectionRequest = this;
    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("Cannot send Connection request to yourself")
    }

    next();
})
const ConnectionRequest = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
module.exports = ConnectionRequest;
