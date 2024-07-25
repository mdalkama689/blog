import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profilePic: {
      secure_url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
      },
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
  },

  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
