import { Router } from "express"
import { 
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
} from "../controllers/post.controllers"
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/auth.middlewares.ts";
import { upload } from "../middlewares/multer.middlewares.ts";
import { apiLimiter } from "../config/rateLimit.ts";



const router :Router = Router();

router.use(apiLimiter);

router.get("/",authenticateToken, getPosts); // Get all 
router.get("/:id",authenticateToken, getPostById); // Get post by ID
router.get("/user/:userId",authenticateToken, getPostsByUser); // Get  by user
router.get("/:id/comments",authenticateToken, getPostComments); // Get comments for a post
router.get("/search",authenticateToken, searchPosts); // Search 

// Protected routes (require authentication)
router.post("/", authenticateToken,  createPost); // Create post upload.single("image"),
router.post("/:id/like", authenticateToken, toggleLikePost); // Like/unlike post
router.post("/:id/comment", authenticateToken, addComment); // Add comment
router.delete("/:id", authenticateToken, deletePost); // Delete post
router.put("/:id", authenticateToken, upload.single("image"), updatePost); // Update post

export default router;