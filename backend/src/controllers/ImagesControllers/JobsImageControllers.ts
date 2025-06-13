import ApiError from "../../config/ApiError";
import ApiResponse from "../../config/ApiResponse";
import asyncHandler from "../../config/asynchandler";
import { deleteFile, uploadFile, getFileUrl } from "../../config/S3_Util";
import Job from "../../models/jobs.model";

const uploadJobImage = asyncHandler(async (req: any, res: any) => {
  const { jobId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check if user is author or admin
  if (job.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    throw new ApiError(403, "You can only upload images to your own job postings");
  }

  // Delete old image if exists
  if (job.imageKey) {
    await deleteFile(job.imageKey);
  }

  // Upload new image
  const fileBuffer = req.file.buffer;
  const key = await uploadFile(fileBuffer, req.file.mimetype, "job-images");

  // Update job with new key
  job.imageKey = key;
  await job.save();

  // Get signed URL for the new image
  const imageUrl = await getFileUrl(key);

  res.status(200).json(
    new ApiResponse(200, "Job image uploaded successfully", {
      imageUrl,
    })
  );
});

const deleteJobImage = asyncHandler(async (req: any, res: any) => {
  const { jobId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check if user is author or admin
  if (job.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    throw new ApiError(403, "You can only delete images from your own job postings");
  }

  if (!job.imageKey) {
    throw new ApiError(400, "No image to delete");
  }

  // Delete from S3
  await deleteFile(job.imageKey);

  // Update job
  job.imageKey = undefined;
  await job.save();

  res.status(200).json(
    new ApiResponse(200, "Job image deleted successfully", {})
  );
});

export { uploadJobImage, deleteJobImage };