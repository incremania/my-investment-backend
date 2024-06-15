const User = require("../models/UserModel");
const InvitationCode = require('../models/invitation')
const { attachCookiesToResponse, createToken } = require("../utils/token");
const createTokenUser = require("../utils/createTokenUser");


const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const timestamp = Date.now().toString(36).slice(-4); // Using last 4 characters of the timestamp
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return timestamp + '-' + result; // Combining timestamp and random characters
};


const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phone,
      country,
      totalInvest,
      totalWithdrawal
    } = req.body;

    if (!firstname || !lastname || !email || !password || !phone || !country) {
      return res.status(400).json({ error: "all fields are required" });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: "email already exists" });
    }

    const accountId = generateRandomString(); // Generate random account ID

    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password,
      country,
      accountId,
      totalInvest,
      totalWithdrawal
    });

    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({ res, user: tokenUser });
    return res.status(201).json({
      token: createToken({ user: tokenUser }),
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
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ status: "unauthorized", error: "invalid email or password" });
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
