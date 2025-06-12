const express= require('express');
const User = require('../Models/user');
const UserAuth = require('../Middlewares/Auth');
const validateEditProfileData = require('../utils/ValidateEditProfileData');
const ProfileRouter = express.Router();
const bcrypt = require('bcrypt')

ProfileRouter.get("/Profile/View", UserAuth , async (req, res) => {

  const email = req.user.Email;

  try {
    const GetUser = await User.find({ Email: email });
    console.log("User Found:", GetUser);
    res.send(GetUser);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Internal Server Error");
  }
});


// ProfileRouter.patch("/Profile/edit/:userID", UserAuth, async (req, res) => {

//   const UserID = req.params?.userID;
//   const data = req.body;

//   try {

//     // Making sure only right things are there for the update
//     const AllowedUpdates = ["firstName","Skills", "About", "PhotoURL","Age"];
//     const isUpdateAllowed = Object.keys(data).every((k)=> AllowedUpdates.includes(k));
//     if(!isUpdateAllowed){
//       throw new Error("Updates not Allowed!");
//     }

//     // Making sure number of skills added or updates are not more than 10
//     if(data?.Skills?.length > 10){
//       throw new Error("You can not allowed to add more than 10 skills!");
//     }
//     const GetUser = await User.findByIdAndUpdate(UserID, data, { returnDocument : 'after', runValidators : true});
//     res.send("User Updated Successfully!");
//   } catch (err) {
//     console.error("Error fetching user:", err.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

ProfileRouter.patch("/Profile/edit", UserAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ error: "Invalid profile data" });
    }

    const user = req.user;
    const updates = Object.keys(req.body);

    updates.forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s profile was successfully updated.`,
      updatedAt: new Date().toISOString(),
      user,
    });

  } catch (error) {
    console.error("Profile update error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


ProfileRouter.patch("/Profile/edit", UserAuth, async (req, res) => {

  const {currentPassword, newPassword} = req.body;
  try{

    const user = req.user;

    const compareOldPassword = await bcrypt.compare(currentPassword, user.Password);
    if(!compareOldPassword){
      throw new Error("Password do not Match!");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.Password = newPasswordHash;

    await user.save();
    res.json({ message: "Password updated successfully" });

  }catch(err){
    res.status(404).send("Error" + err.message);
  }

})



module.exports = ProfileRouter;