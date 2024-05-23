const User = require("../models/UserModel");
const { attachCookiesToResponse } = require("../utils/token");
const createTokenUser = require("../utils/createTokenUser");
const authorizePermissions = require('../utils/authorizePermission')
const InvitationCode = require('../models/invitation');


const createInvitationCode = async (req, res) => {
  try {
    const invitationCode = await InvitationCode.create(req.body);
    console.log(req.body);
    res.status(200).json({ success: true, invitationCode });
  } catch (error) {
    console.log(error);
     res.status(500).json({ error: error.message });
  }
}

const getAllInvitationCode = async(req, res) => {
  try {
    const invitations = await InvitationCode.find({})
    console.log(invitations);
    res.status(200).json({ nbHits: invitations.length, invitations})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message })
  }
}

const getSingleUser = async (req, res) => {
  try {
 
    const { userId } = req.params;
    const user = await User.findById(userId);
    authorizePermissions(req.user, user._id)
    
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "no user found",
      });
    }

     console.log(req.user);
     console.log(user);
    
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({})

    res.status(200).json({
      status: "success",
      nbHits: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, userName, phone } = req.body;
    const userId = req.user.userId;
    const updatedUser = await User.findOne({ _id: userId });
    authorizePermissions(req.user, updateUser._id);
    updatedUser.firstName = firstName;
    updatedUser.lastName = lastName;
    updatedUser.email = email;
    updatedUser.userName = userName;
    updatedUser.phone = phone;

    await updatedUser.save();

    const tokenUser = createTokenUser(updatedUser);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(200).json({
      status: "success",
      message: "updated successfully",
      user: tokenUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "provide old password and new password",
      });
    }

    const user = await User.findOne({ _id: userId });
    console.log(user.password);
    const isPasswordMatch = await user.comparePassword(oldPassword);

    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "error",
        message: "old password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "password updated successfully",
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const showCurrentUser = async (req, res) => {
    console.log(req.token);
  res.status(200).json({ status: "success", user: req.user });
};

module.exports = {
  updateUser,
  updatePassword,
  getSingleUser,
  getAllUser,
  showCurrentUser,
  createInvitationCode,
  getAllInvitationCode
};
