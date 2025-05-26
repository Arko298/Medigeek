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



const router :Router = Router();

// Public routes (no authentication)
router.get("/", getPosts); // Get all 
router.get("/:id", getPostById); // Get post by ID
router.get("/user/:userId", getPostsByUser); // Get  by user
router.get("/:id/comments", getPostComments); // Get comments for a post
router.get("/search", searchPosts); // Search 

// Protected routes (require authentication)
router.post("/", authenticateToken, upload.single("image"), createPost); // Create post
router.post("/:id/like", authenticateToken, toggleLikePost); // Like/unlike post
router.post("/:id/comment", authenticateToken, addComment); // Add comment
router.delete("/:id", authenticateToken, deletePost); // Delete post
router.put("/:id", authenticateToken, upload.single("image"), updatePost); // Update post

export default router;