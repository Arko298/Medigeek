import ApiError from "../../config/ApiError";
import ApiResponse from "../../config/ApiResponse";
import asyncHandler from "../../config/asynchandler";
import { deleteFile, uploadFile, getFileUrl } from "../../config/S3_Util";
import Post from "../../models/post.models";

const uploadPostImage = asyncHandler(async (req: any, res:any) => {
  const { postId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user is author
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only upload images to your own posts");
  }

  // Delete old image if exists
  if (post.imageKey) {
    await deleteFile(post.imageKey);
  }

  // Upload new image
  const fileBuffer = req.file.buffer;
  const key = await uploadFile(fileBuffer, req.file.mimetype, "post-images");

  // Update post with new key
  post.imageKey = key;
  await post.save();

  // Get signed URL for the new image
  const imageUrl = await getFileUrl(key);

  res.status(200).json(
    new ApiResponse(200, "Post image uploaded successfully", {
      imageUrl,
    })
  );
});

const deletePostImage = asyncHandler(async (req: any, res:any) => {
  const { postId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user is author
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete images from your own posts");
  }

  if (!post.imageKey) {
    throw new ApiError(400, "No image to delete");
  }

  // Delete from S3
  await deleteFile(post.imageKey);

  // Update post
  post.imageKey = undefined;
  await post.save();

  res.status(200).json(
    new ApiResponse(200, "Post image deleted successfully", {})
  );
});

export { uploadPostImage, deletePostImage };