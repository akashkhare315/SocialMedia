// const userModel = require("../models/user.model");
// const jwt = require("jsonwebtoken");

// async function registerController(req, res) {
//   const { username, password } = req.body;

//   const isUserAlreadyExists = await userModel.findOne({ username });

//   if (isUserAlreadyExists) {
//     return res.status(400).json({ message: "user already exist" });
//   }

//   const user = await userModel.create({ username, password });

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//   res.cookie("token", token);

//   return res.status(201).json({ message: "user registered successfully" });
// }

// async function loginController(req, res) {
//   const { username, password } = req.body;
//   const user = await userModel.findOne({
//     username,
//   });
//   if (!user) {
//     return res.status(400).json({ message: "User Not found" });
//   }
// }

// const isPasswordValid = user.password === password;
// if (!isPasswordValid) {
//   return res.status(400).json({ message: "invalid password" });
// }

// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

// res.cookie("token", token);

// res.status(200).json({
//   message: " User logged in Successfully",
//   user: {
//     username: user.username,
//     id: user._id,
//   },
// });
// module.exports = { registerController, loginController };

const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerController(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({ username });
    if (isUserAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await userModel.create({ username, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        username: user.username,
        id: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { registerController, loginController };
