import mongoose, { Schema } from "mongoose"

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["friend_request", "friend_accepted", "follow", "like", "comment", "post"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    relatedJob: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: false,
    },
  },
  { timestamps: true },
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
