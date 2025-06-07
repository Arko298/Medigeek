import { Router } from "express"
import {
  searchJobs,
  createJob,
  getJobById,
  getJobs,
  getJobComments,
  toggleLikeJob,
  addComment,
  deleteJob,
  updateJob,
} from "../controllers/jobs.controller.ts"
import { authenticateToken } from "../middlewares/auth.middlewares.ts"

const router: Router = Router()

// Public routes (no authentication)
router.get("/", getJobs) // Get all jobs
router.get("/:id", getJobById) // Get job by ID
router.get("/:id/comments", getJobComments) // Get comments for a job
router.get("/search", searchJobs) // Search jobs

// Protected routes (require authentication)
router.post("/", authenticateToken, createJob) // Create job
router.post("/:id/like", authenticateToken, toggleLikeJob) // Like/unlike job
router.post("/:id/comment", authenticateToken, addComment) // Add comment
router.delete("/:id", authenticateToken, deleteJob) // Delete job
router.put("/:id", authenticateToken, updateJob) // Update job

export default router
