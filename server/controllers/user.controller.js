import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const registerUser = async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;

    if (
      !fullname?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const fullnameRegex = /^[a-zA-Z\s'-]{2,40}$/;
    if (!fullnameRegex.test(fullname)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name",
      });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid username",
      });
    }

    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email  already exists",
      });
    }

    if (password.trim().length < 7) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast of eight characters",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      username,
      email,
      password: hashPassword,
    });

    await user.save();
    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Error during user registered : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during user registered",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exists",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Email or password incorrect!",
      });
    }

    const payload = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      username: user.username,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);

    user.password = undefined;
    user.bookmarks = undefined;
    return res.status(201).json({
      success: true,
      message: "User logged in",
      user,
      token,
    });
  } catch (error) {
    console.log("Error during userlogged in : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during userlogged in",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(201).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error during userlogged out : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during userlogged out",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User details fetch successfully",
      user,
    });
  } catch (error) {
    console.log("error message : ", error);
    return res.status(400).json({
      success: false,
      message: "Error during fetching user details ",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    const { fullname, username, email } = req.body;
    if (!fullname?.trim() && !username?.trim() && !email?.trim() && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No values provided for update",
      });
    }
    if (fullname?.trim()) {
      const fullnameRegex = /^[a-zA-Z\s'-]{2,40}$/;
      if (!fullnameRegex.test(fullname)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid fullname. It should only contain letters, spaces, apostrophes, or hyphens and be between 2 and 40 characters long.",
        });
      }
      user.fullname = fullname;
    }

    if (email?.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid email format. Please provide a valid email address.",
        });
      }
      const isEmailExists = await User.findOne({ email });
      if (user.email != email && isEmailExists) {
        return res.status(400).json({
          success: false,
          message:
            "Email already exists. Please provide a different email address.",
        });
      }
      user.email = email;
    }

    if (username?.trim()) {
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid username. It should be between 3 and 16 characters long and contain only letters, numbers, or underscores.",
        });
      }

      const isUsernameExists = await User.findOne({ username });
      if (user.username != username && isUsernameExists) {
        return res.status(400).json({
          success: false,
          message:
            "Username already exists. Please choose a different username.",
        });
      }
      user.username = username;
    }

    if (req.file) {
      if (user?.profilePic?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.profilePic?.public_id);
      }
      const uploadFile = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "blog",
      });
      if (uploadFile) {
        user.profilePic.secure_url = uploadFile.secure_url;
        user.profilePic.public_id = uploadFile.public_id;
        fs.rm(`uploads/${req.file.filename}`);
      } else {
        return res.status(400).json({
          success: false,
          messsage: "File not uploaded!, please try again!",
        });
      }
    }

    await user.save();
    const updatedUser = await User.findById(userId).select("-password");

    return res.status(201).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error during update user profile : ", error.message);
    return res.status(400).json({
      success: false,
      message:
        "An error occurred while updating the user profile. Please try again later.",
    });
  }
};

export { registerUser, loginUser, logoutUser, userProfile, updateUserProfile };
