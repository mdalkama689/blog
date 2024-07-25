import Post from "../models/post.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import User from "../models/user.model.js";

const createPost = async (req, res) => {
  try {
    const userId = req.user._id;

    const { title, contentText, category } = req.body;

    if (!title?.trim() || !contentText?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const post = await Post.create({
      postOwner: userId,
      title,
      contentText,
      category,
    });

    if (req.file) {
      const uploadFile = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "blog",
      });

      if (uploadFile) {
        post.contentImage.public_id = uploadFile.public_id;
        post.contentImage.secure_url = uploadFile.secure_url;
        fs.rm(`uploads/${req.file.filename}`);
      } else {
        return res.status(400).json({
          success: false,
          messsage: "File not uploaded!, please try again!",
        });
      }
    }

    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post upload successfully",
      post,
    });
  } catch (error) {
    console.log("Error during upload post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during upload post",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }

    if (post.postOwner.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete this post because you are not the owner!.",
      });
    }

    await post.deleteOne();

    return res.status(201).json({
      success: true,
      message: "Post delete  successfully",
      post,
    });
  } catch (error) {
    console.log("Error during delete post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during delete post",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, contentText, category } = req.body;

    if (!title?.trim() && !contentText?.trim() && !category && !req.file) {
      return res.status(400).json({
        success: false,
        messsage: "Please enter some values!",
      });
    }

    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }

    if (post.postOwner.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot update this post because you are not the owner!.",
      });
    }

    if (title) {
      post.title = title;
    }
    if (contentText) {
      post.contentText = contentText;
    }
    if (category) {
      post.category = category;
    }
    if (req.file) {
      await cloudinary.v2.uploader.destroy(post.contentImage.public_id);

      if (req.file) {
        const uploadFile = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "blog",
        });

        if (uploadFile) {
          post.contentImage.public_id = uploadFile.public_id;
          post.contentImage.secure_url = uploadFile.secure_url;
          fs.rm(`uploads/${req.file.filename}`);
        } else {
          return res.status(400).json({
            success: false,
            messsage: "File not uploaded!, please try again!",
          });
        }
      }
    }

    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post updated  successfully",
      post,
    });
  } catch (error) {
    console.log("Error during updated post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during updated post",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("postOwner");
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Post fetch successfully",
      post,
    });
  } catch (error) {
    console.log("Error during fetching post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during fetching post",
    });
  }
};

const toggleLikeToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }
    const findIndex = post.likes.indexOf(userId);
    let message = "";

    if (findIndex === -1) {
      post.likes.push(userId);
      message = "Post liked successfully!";
    } else {
      post.likes.splice(findIndex, 1);
      message = "Post unliked successfully!";
    }
    await post.save();
    return res.status(201).json({
      success: true,
      message,
      post,
    });
  } catch (error) {
    console.log("Error during toggle like post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during toggle like post",
    });
  }
};

const getAllPost = async (req, res) => {
  try {
    const allPosts = await Post.find().populate("postOwner");
    allPosts.map((post) => {
      post.postOwner.password = undefined;
    });
    return res.status(201).json({
      success: true,
      message: "Post fetch successfully",
      allPosts,
    });
  } catch (error) {
    console.log("Error during fetching post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during fetching post",
    });
  }
};

const getAllPostsOfLoggedInUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const allPosts = await Post.find({ postOwner: userId }).populate(
      "postOwner"
    );

    return res.status(201).json({
      success: true,
      message: "Post fetch of loggedIn user successfully",
      postLength: allPosts.length,
      allPosts,
    });
  } catch (error) {
    console.log(
      "Error during fetching posts of loggedIn user : ",
      error.message
    );
    return res.status(400).json({
      success: false,
      message: "Error during fetching posts of loggedIn user",
    });
  }
};

const filterPost = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const allFilterPosts = await Post.find({ category: filter }).sort({
      timestamps: -1,
    });

    return res.status(201).json({
      success: true,
      message: "Fetch all filter posts successfully",
      allFilterPosts,
    });
  } catch (error) {
    console.log("Error during fetching filter posts : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during fetching filter posts",
    });
  }
};

const bookmarks = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const user = await User.findById({ _id: userId });

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }
    let message = "";
    const findIndex = user.bookmarks.indexOf(postId);
    if (findIndex === -1) {
      user.bookmarks.push(post._id);
      message = "Post  bookmark successfully";
    } else {
      user.bookmarks.splice(findIndex, 1);
      message = "Post removed from bookmarks successfully";
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message,
      user,
    });
  } catch (error) {
    console.log("Error during post saved in bookmark : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during post saved in bookmark",
    });
  }
};

const getBookmarkPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: {
        path: "postOwner",
        model: "User",
      },
    });
    return res.status(201).json({
      success: true,
      message: "Get all bookmark posts successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.log("Error during fetching bookmark  post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during fetching bookmark  post",
    });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { filter } = req.query;

    const posts = await Post.find({
      $or: [
        { title: { $regex: filter, $options: "i" } },
        { contentText: { $regex: filter, $options: "i" } },
      ],
    });
    return res.status(201).json({
      success: true,
      message: "Posts got successfully",
      posts,
    });
  } catch (error) {
    console.log("Error during searching post : ", error.message);
    return res.status(400).json({
      success: false,
      message: "Error during searching post",
    });
  }
};

export {
  createPost,
  deletePost,
  updatePost,
  getPost,
  toggleLikeToPost,
  getAllPost,
  getAllPostsOfLoggedInUser,
  filterPost,
  bookmarks,
  getBookmarkPosts,
  searchPosts,
};
