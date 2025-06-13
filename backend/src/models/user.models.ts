import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: null,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // From sendFriendRequest
    // acceptedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePictureKey: {
      type: String,
      default: null,
    },
    profilePicture:{
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true,
   
   },
);

const User = mongoose.model("User", userSchema);
export default User;
