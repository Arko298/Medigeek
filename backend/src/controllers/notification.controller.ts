import type { Response } from "express";
import Notification from "../models/notification.models";
import ApiError from "../config/ApiError";
import ApiResponse from "../config/ApiResponse";
import asyncHandler from "../config/asynchandler.ts";

// Create notification helper function
export const createNotification = async (
  recipientId: string,
  senderId: string,
  type: string,
  message: string,
  relatedPost?: string,
  relatedJob?: string,
) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      relatedPost,
      relatedJob,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const getNotifications = asyncHandler(async (req: any, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "username fullName avatar")
    .populate("relatedPost", "title")
    .populate("relatedJob", "title");

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  const totalNotifications = await Notification.countDocuments({
    recipient: req.user._id,
  });

  res.status(200).json(
    new ApiResponse(200, "Notifications fetched successfully", {
      notifications,
      unreadCount,
      totalNotifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: page,
    }),
  );
});

const markAsRead = asyncHandler(async (req: any, res: Response) => {
  const { notificationId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: req.user._id },
    { isRead: true },
    { new: true },
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", notification));
});

const markAllAsRead = asyncHandler(async (req: any, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true },
  );

  res
    .status(200)
    .json(new ApiResponse(200, "All notifications marked as read", {}));
});

const deleteNotification = asyncHandler(async (req: any, res: Response) => {
  const { notificationId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Notification deleted successfully", {}));
});

export { getNotifications, markAsRead, markAllAsRead, deleteNotification };
