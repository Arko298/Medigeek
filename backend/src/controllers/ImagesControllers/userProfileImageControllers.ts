import ApiError from "../../config/ApiError";
import ApiResponse from "../../config/ApiResponse";
import asyncHandler from "../../config/asynchandler";
import { deleteFile, uploadFile, getFileUrl } from "../../config/S3_Util";
import User from "../../models/user.models";

const uploadProfilePicture = asyncHandler(async (req: any, res: any) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!req.file) {
    throw new ApiError(400, "Profile picture file is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete old picture if exists
  if (user.profilePictureKey) {
    await deleteFile(user.profilePictureKey);
  }

  // Upload new picture
  const fileBuffer = req.file.buffer;
  const key = await uploadFile(fileBuffer, req.file.mimetype, "profile-pictures");
  if (!key) {
    throw new ApiError(500, "Failed to upload profile picture");
  }

  // Update user with new key
  user.profilePictureKey = key;
  await user.save();

  // Get signed URL for the new image
  const imageUrl = await getFileUrl(key);
  if(!imageUrl) {
    throw new ApiError(500, "Failed to retrieve image URL");

  }

  res.status(200).json(
    new ApiResponse(200, "Profile picture uploaded successfully", {
      profilePicture: imageUrl,
    })
  );
});

const deleteProfilePicture = asyncHandler(async (req: any, res: any) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.profilePictureKey) {
    throw new ApiError(400, "No profile picture to delete");
  }

  // Delete from S3
  await deleteFile(user.profilePictureKey);

  // Update user
  user.profilePictureKey = "";
  await user.save();

  res.status(200).json(
    new ApiResponse(200, "Profile picture deleted successfully", {})
  );
});

const getProfilePicture = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.profilePictureKey) {
    throw new ApiError(404, "No profile picture found");
  }

  // Get signed URL
  const imageUrl = await getFileUrl(user.profilePictureKey);

  res.status(200).json(
    new ApiResponse(200, "Profile picture retrieved successfully", {
      profilePicture: imageUrl,
    })
  );
});
export {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
};