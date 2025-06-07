import { Request, Response } from "express";
import Post from "../models/post.models";
import ApiError from "../config/ApiError";
import ApiResponse from "../config/ApiResponse";
import asyncHandler from "../config/asynchandler.ts";
import { uploadOnCloudinary, deleteFromCloudinary } from "../config/cloudinary";
import mongoose from "mongoose";

const createPost = asyncHandler(async (req: any, res: Response) => {
  const { title, description, content } = req.body;

  if (!title || !description || !content) {
    throw new ApiError(400, "Title, description, and content are required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  // if (!req.file?.path) {
  //   throw new ApiError(400, "Image file is required");
  // }

  // // Upload image to Cloudinary
  // const image = await uploadOnCloudinary(req.file?.path);
  // if (!image?.url) {
  //   throw new ApiError(500, "Failed to upload image");
  // }

  const post = await Post.create({
    title,
    description,
    content,
    // image: image?.url,
    author: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, "Post created successfully", post));
});

const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username avatar")
    .populate("likes", "username")
    .populate("comments.user", "username avatar");

  const totalPosts = await Post.countDocuments();

  res.status(200).json(
    new ApiResponse(200, "Posts fetched successfully", {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    }),
  );
});

const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findById(id)
    .populate("author", "username avatar")
    .populate("likes", "username")
    .populate("comments.user", "username avatar");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json(new ApiResponse(200, "Post fetched successfully", post));
});

const toggleLikePost = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userId = req.user._id;
  const likeIndex = post.likes.indexOf(userId);

  if (likeIndex === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(likeIndex, 1);
  }

  await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Post like toggled successfully", post));
});

const addComment = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    throw new ApiError(400, "Comment text is required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = {
    user: req.user._id,
    text,
    createdAt: new Date(),
  };

  post.comments.push(comment);
  await post.save();

  // Populate the user details in the newly added comment
  const populatedPost = await Post.findById(id).populate(
    "comments.user",
    "username avatar",
  );

  res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", populatedPost));
});

const getPostComments = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate(
    "comments.user",
    "username avatar",
  );

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", post.comments));
});

const getPostsByUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Validate userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username fullName avatar")
    .populate("likes", "username")
    .populate("comments.user", "username avatar");

  const totalPosts = await Post.countDocuments({ author: userId });

  res.status(200).json(
    new ApiResponse(200, "User posts fetched successfully", {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    }),
  );
});

const deletePost = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the user is the author of the post
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden - You can only delete your own posts");
  }

  // Extract public ID from Cloudinary URL for image deletion
  const publicId = post.image.split("/").pop()?.split(".")[0];
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }

  await post.deleteOne();

  res.status(200).json(new ApiResponse(200, "Post deleted successfully", {}));
});

const updatePost = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, content } = req.body;

  if (!title || !description || !content) {
    throw new ApiError(400, "Title, description, and content are required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden - You can only update your own posts");
  }

  let imageUrl = post.image;
  if (req.file?.path) {
    // Upload new image to Cloudinary
    const image = await uploadOnCloudinary(req.file.path);
    if (!image?.url) {
      throw new ApiError(500, "Failed to upload image");
    }

    // Delete old image from Cloudinary
    const publicId = post.image.split("/").pop()?.split(".")[0];
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    imageUrl = image.url;
  }

  post.title = title;
  post.description = description;
  post.content = content;
  post.image = imageUrl;

  const updatedPost = await post.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", updatedPost));
});

// Search posts
const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const posts = await Post.find({ $text: { $search: query as string } })
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .populate("author", "username avatar");

  const totalPosts = await Post.countDocuments({
    $text: { $search: query as string },
  });

  res.status(200).json(
    new ApiResponse(200, "Posts fetched successfully", {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    }),
  );
});

export {
  searchPosts,
  createPost,
  getPostById,
  getPosts,
  getPostsByUser,
  getPostComments,
  toggleLikePost,
  addComment,
  deletePost,
  updatePost,
};
