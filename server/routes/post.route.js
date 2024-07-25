import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  bookmarks,
  createPost,
  deletePost,
  filterPost,
  getAllPost,
  getAllPostsOfLoggedInUser,
  getBookmarkPosts,
  getPost,
  searchPosts,
  toggleLikeToPost,
  updatePost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();
router.post("/create", authMiddleware, upload.single("post-image"), createPost);
router.delete("/delete/:postId", authMiddleware, deletePost);
router.put(
  "/update/:postId",
  authMiddleware,
  upload.single("post-image"),
  updatePost
);
router.get("/get/:postId", authMiddleware, getPost);
router.post("/toggle/like/:postId", authMiddleware, toggleLikeToPost);
router.get("/all", authMiddleware, getAllPost);
router.get("/", authMiddleware, getAllPostsOfLoggedInUser);
router.get("/category", authMiddleware, filterPost);
router.post("/save/bookmark/:postId", authMiddleware, bookmarks);
router.get("/bookmark", authMiddleware, getBookmarkPosts);
router.get("/search", authMiddleware, searchPosts);

export default router;
