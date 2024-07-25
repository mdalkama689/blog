import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    postOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    contentImage: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    contentText: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "Technology",
        "Programming",
        "Entrepreneurship",
        "Startups",
        "Artificial Intelligence",
        "Finance",
      ],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },

  { timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;
