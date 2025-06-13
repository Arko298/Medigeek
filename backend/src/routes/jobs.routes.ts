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
import { apiLimiter } from "../config/rateLimit.ts"

const router: Router = Router()

router.use(apiLimiter);


router.get("/",authenticateToken, getJobs) // Get all jobs
router.get("/:id",authenticateToken, getJobById) // Get job by ID
router.get("/:id/comments",authenticateToken, getJobComments) // Get comments for a job
router.get("/search",authenticateToken, searchJobs) // Search jobs

// Protected routes (require authentication)
router.post("/", authenticateToken, createJob) // Create job
router.post("/:id/like", authenticateToken, toggleLikeJob) // Like/unlike job
router.post("/:id/comment", authenticateToken, addComment) // Add comment
router.delete("/:id", authenticateToken, deleteJob) // Delete job
router.put("/:id", authenticateToken, updateJob) // Update job

export default router
