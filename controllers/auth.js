const User = require("../models/UserModel");
const InvitationCode = require('../models/invitation')
const { attachCookiesToResponse, createToken } = require("../utils/token");
const createTokenUser = require("../utils/createTokenUser");

const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      username,
      password,
      phone,
      invitationCode,
      totalInvest,
      totalWithdrawal
    } = req.body;

    if (
      !firstname || !lastname || !email || !username || !password || !phone || !invitationCode
    ) {
      return res.status(400).json({ error: "all fields are required" });
    }

    const existingUser = await User.findOne({username})

    if(existingUser) {
      return res.status(400).json({ error: "username already exist" });

    }

    const existingInvite = await InvitationCode.findOne({ invitationCode })
    if(!existingInvite) {
      return res.status(400).json({ error: "invalid invitation code" });
    }

    const existingEmail = await User.findOne({ email})

    if(existingEmail) {
            return res.status(400).json({ error: "email already exists" });

    }

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      phone,
      password,
      invitationCode,
      totalInvest,
      totalWithdrawal
    });
  

    const tokenUser = createTokenUser(user);
    
    attachCookiesToResponse({ res, user: tokenUser });
    return res.status(201).json({
       token: createToken({user: tokenUser}),
      status: "success",
      message: "user created successfully",
      user: tokenUser,
  
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrusername, password } = req.body;
    if (!emailOrusername || !password) {
      return res
        .status(400)
        .json({ error: "Email/username and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrusername }, { username: emailOrusername }],
    });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ status: "unauthorized", error: "password or username/email incorrect" });
    }

    const validUser = await user.comparePassword(password);
    console.log(validUser);
    if (!validUser) {
      return res
        .status(401)
        .json({ status: "unauthorized", error: "invalid credentials" });
    }
    
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    return res.status(200).json({
      token: createToken({user: tokenUser}),
      status: "success",
      message: "login successful",
      user: tokenUser,
     
    
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
