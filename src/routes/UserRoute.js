const express = require("express");
const UserAuth = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");
const User = require("../Models/user");
const UserRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "Age", "Gender", "About", "PhotoURL"];

UserRouter.get("/user/request/received", UserAuth, async (req, res) => {
    try {
        console.log("🔐 Logged in user:", req.user);

        const requests = await ConnectionRequest.find({
            toUserId: req.user._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "Age", "Gender", "About", "PhotoURL"]);

        if (requests.length === 0) {
            return res.status(404).json({
                message: "No connection requests found",
                data: [],
            });
        }

        res.status(200).json({
            message: "Connection requests fetched successfully",
            data: requests,
        });
    } catch (err) {
        console.error("❌ Error in GET /user/request:", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});


UserRouter.get("/user/connections", UserAuth, async (req, res) => {
    try {
        console.log("🔐 Logged in user:", req.user);

        const requests = await ConnectionRequest.find({
            $or: [
                { toUserId: req.user._id },
                { fromUserId: req.user._id },
            ],
            status: "accepted",
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        if (requests.length === 0) {
            return res.status(404).json({
                message: "No connection requests found",
                data: [],
            });
        }

        const data = requests.map((row) => {
            if (row.fromUserId._id.toString() === req.user._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({
            message: "Connection requests fetched successfully",
            data: data,
        });
    } catch (err) {
        console.error("❌ Error in GET /user/connections:", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});


UserRouter.get("/feed", UserAuth, async (req, res) => {
    try {
        const LoggedInUser = req.user;

        // Step 1: Find all connection requests involving the user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: LoggedInUser._id },
                { fromUserId: LoggedInUser._id },
            ]
        }).select("toUserId fromUserId");

        // Step 2: Create a Set of user IDs to exclude from feed
        const hiddenUserIdsSet = new Set();

        connectionRequests.forEach((r) => {
            hiddenUserIdsSet.add(r.toUserId.toString());
            hiddenUserIdsSet.add(r.fromUserId.toString());
        });

        // Also exclude the logged-in user themselves
        // hiddenUserIdsSet.add(LoggedInUser._id.toString()); // Uncomment if needed

        // Step 3: Fetch users not in hidden list
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUserIdsSet) } }, // ✅ FIXED: Changed HiddenUser to hiddenUserIdsSet
                { _id: { $ne: LoggedInUser._id } }
            ]
        });

        res.status(200).json({
            message: "Feed data fetched successfully",
            data: users,
        });

    } catch (err) {
        console.error("❌ Error in GET /feed:", err.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
});


module.exports = UserRouter;
