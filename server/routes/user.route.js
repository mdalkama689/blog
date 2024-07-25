import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  userProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authMiddleware, userProfile);
router.post(
  "/update/profile",
  authMiddleware,
  upload.single("user-profile-pic"),
  updateUserProfile
);
export default router;
