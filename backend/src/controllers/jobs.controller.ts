import type { Request, Response } from "express";
import Job from "../models/jobs.model.ts";
import ApiError from "../config/ApiError";
import ApiResponse from "../config/ApiResponse";
import asyncHandler from "../config/asynchandler.ts";

const createJob = asyncHandler(async (req: any, res: Response) => {
  const {
    title,
    company,
    location,
    description,
    requirements,
    salary,
    jobType,
    applicationLink,
    applicationDeadline,
  } = req.body;

  if (
    !title ||
    !company ||
    !location ||
    !description ||
    !requirements ||
    !jobType
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const job = await Job.create({
    title,
    company,
    location,
    description,
    requirements,
    salary,
    jobType,
    applicationLink,
    applicationDeadline,
    author: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Job posting created successfully", job));
});

const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username avatar")
    .populate("likes", "username")
    .populate("comments.user", "username avatar");

  const totalJobs = await Job.countDocuments();

  res.status(200).json(
    new ApiResponse(200, "Jobs fetched successfully", {
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
    }),
  );
});

const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id)
    .populate("author", "username avatar")
    .populate("likes", "username")
    .populate("comments.user", "username avatar");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.status(200).json(new ApiResponse(200, "Job fetched successfully", job));
});

const toggleLikeJob = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const userId = req.user._id;
  const likeIndex = job.likes.indexOf(userId);

  if (likeIndex === -1) {
    job.likes.push(userId);
  } else {
    job.likes.splice(likeIndex, 1);
  }

  await job.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Job like toggled successfully", job));
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

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const comment = {
    user: req.user._id,
    text,
    createdAt: new Date(),
  };

  job.comments.push(comment);
  await job.save();

  const populatedJob = await Job.findById(id).populate(
    "comments.user",
    "username avatar",
  );

  res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", populatedJob));
});

const getJobComments = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const job = await Job.findById(id).populate(
    "comments.user",
    "username avatar",
  );

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", job.comments));
});

const deleteJob = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check if the user is the author of the job or an admin
  if (job.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    throw new ApiError(
      403,
      "Forbidden - You can only delete your own job postings",
    );
  }

  await job.deleteOne();

  res.status(200).json(new ApiResponse(200, "Job deleted successfully", {}));
});

const updateJob = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const {
    title,
    company,
    location,
    description,
    requirements,
    salary,
    jobType,
    applicationLink,
    applicationDeadline,
  } = req.body;

  if (
    !title ||
    !company ||
    !location ||
    !description ||
    !requirements ||
    !jobType
  ) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const job = await Job.findById(id);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    throw new ApiError(
      403,
      "Forbidden - You can only update your own job postings",
    );
  }

  job.title = title;
  job.company = company;
  job.location = location;
  job.description = description;
  job.requirements = requirements;
  job.salary = salary;
  job.jobType = jobType;
  job.applicationLink = applicationLink;
  job.applicationDeadline = applicationDeadline;

  const updatedJob = await job.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Job updated successfully", updatedJob));
});

// Search jobs
const searchJobs = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const jobs = await Job.find({ $text: { $search: query as string } })
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .populate("author", "username avatar");

  const totalJobs = await Job.countDocuments({
    $text: { $search: query as string },
  });

  res.status(200).json(
    new ApiResponse(200, "Jobs fetched successfully", {
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
    }),
  );
});

export {
  searchJobs,
  createJob,
  getJobById,
  getJobs,
  getJobComments,
  toggleLikeJob,
  addComment,
  deleteJob,
  updateJob,
};
