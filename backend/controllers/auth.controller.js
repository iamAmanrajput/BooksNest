const User = require("../models/user.model");

// Register User
module.exports.register = async (req, res) => {
  const { fullName, email, password, gender } = req.body;

  if (!fullName || !email || !password || !gender) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${fullName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${fullName}`;
    const profilePic =
      gender.toLowerCase() === "male" ? boyProfilePic : girlProfilePic;

    const newUser = await User.create({
      fullName,
      email,
      password,
      gender,
      profilePic: {
        imageUrl: profilePic,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "User Registered Successfully" });
  } catch (error) {
    console.error("User Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Login User
