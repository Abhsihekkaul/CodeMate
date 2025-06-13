const express = require("express");
const UserAuth = require("../Middlewares/Auth");
const ConnectionRequest = require("../Models/ConnectionRequest");
const UserRouter = express.Router();

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
        .populate("fromUserId", ["firstName", "lastName", "Age", "Gender", "About", "PhotoURL"])
        .populate("toUserId", ["firstName", "lastName", "Age", "Gender", "About", "PhotoURL"]);

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


module.exports = UserRouter;
