const userModel = require("../models/user.model");

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username }).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

module.exports = { getUserProfile };
