const express = require("express");
const RequestRouter = express.Router();
const UserAuth = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");
const User = require("../Models/user");

RequestRouter.post("/request/send/:status/:userID", UserAuth, async (req, res) => {
    try {
        const toUserId = req.params.userID;
        const fromUserId = req.user._id;
        const status = req.params.status.toLowerCase();

        // Checking whether the user is provinding the right status type
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid Status Type!");
        }

        // Check whether the toUser provided by the user exist or not 
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message : "User not Found!"});
        }

        // did the following inside the schema level
        // if (toUserId === fromUserId.toString()) {
        //     return res.status(400).json({ message: "You cannot send a request to yourself." });
        // }


        // Check if a connection already exists in either direction
        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                { toUserId, fromUserId },
                { toUserId: fromUserId, fromUserId: toUserId }
            ]
        });

        if (existingConnection) {
            return res.status(409).json({ message: "Connection request already exists." });
        }

        const request = new ConnectionRequest({
            toUserId,
            fromUserId,
            status,
        });

        const data = await request.save();

        res.status(201).json({
            message: "Connection Request sent successfully",
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
RequestRouter.post("/request/review/:status/:requestID", UserAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user;
    const Status = req.params.status;
    const RequestID = req.params.requestID;

    const connectionReq = await ConnectionRequest.findOne({
      _id: RequestID,
      toUserId: LoggedInUser._id,
      status: "interested",
    });

    // Check if connection request exists
    if (!connectionReq) {
      return res.status(404).json({ message: "Connection request does not exist or you are not authorized to review it." });
    }

    // Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(Status)) {
      return res.status(400).json({ message: "Invalid status type!" });
    }

    // Double-check if already reviewed (optional due to previous query)
    if (["accepted", "rejected"].includes(connectionReq.status)) {
      return res.status(400).json({ message: "This request has already been reviewed." });
    }

    // Update and save status
    connectionReq.status = Status;
    await connectionReq.save();

    res.json({
      message: `Request ${Status} successfully.`,
      data: connectionReq,
    });

  } catch (err) {
    console.error("Review request error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

RequestRouter.get("/connection/accepted/:FriendID", UserAuth, async (req, res) => {
  try {
    const LoggedInUser = req.user._id;
    const FriendID = req.params.FriendID;

    if (!FriendID) {
      return res.status(400).json({ message: "FriendID is required" });
    }

    // Check if FriendID is a valid user
    const friendUser = await User.findById(FriendID);
    if (!friendUser) {
      return res.status(404).json({ message: "FriendID does not exist in the database" });
    }

    // Find the accepted connection request between users
    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: LoggedInUser, toUserId: FriendID },
        { fromUserId: FriendID, toUserId: LoggedInUser },
      ],
      status: "accepted" 
    });

    if (!connection) {
      return res.status(404).json({ message: "No accepted connection found between users" });
    }

    res.status(200).json({ connectionId: connection._id});
  } catch (err) {
    res.status(500).json({
      message: `Error: ${err.message}`,
    });
  }
});

RequestRouter.delete("/connections/delete/:requestId", UserAuth, async (req, res) => {
  try {
    const userID = req.user._id; // ensure you're using ._id
    const RequestID = req.params.requestId;

    const CheckRequest = await ConnectionRequest.findById(RequestID);

    if (
      !CheckRequest ||
      (CheckRequest.fromUserId.toString() !== userID.toString() &&
       CheckRequest.toUserId.toString() !== userID.toString())
    ) {
      return res.status(403).json({ message: "Not authorized or request not found" });
    }

    await ConnectionRequest.findByIdAndDelete(RequestID);
    res.status(200).json({ message: "Connection request removed" });

  } catch (err) {
    res.status(500).json({
      message: `Error: ${err.message}`,
    });
  }
});


module.exports = RequestRouter;
