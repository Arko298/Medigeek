import { uploadLimiter } from "../config/rateLimit";
import { uploadJobImage, deleteJobImage } from "../controllers/ImagesControllers/JobsImageControllers";
import { uploadPostImage, deletePostImage } from "../controllers/ImagesControllers/PostImageControllers";
import { uploadProfilePicture, deleteProfilePicture, getProfilePicture } from "../controllers/ImagesControllers/userProfileImageControllers";
import { upload } from "../middlewares/multer.middlewares";
import Router from "express";
const router = Router();

// Profile picture routes
router.post("/profile/picture",uploadLimiter, upload.single("image"), uploadProfilePicture);
router.delete("/profile/picture",uploadLimiter, deleteProfilePicture);
router.get("/profile/picture/:userId", getProfilePicture);

// Post image routes
router.post("/posts/:postId/image",uploadLimiter, upload.single("image"), uploadPostImage);
router.delete("/posts/:postId/image", deletePostImage);

// Job image routes
router.post("/jobs/:jobId/image",uploadLimiter, upload.single("image"), uploadJobImage);
router.delete("/jobs/:jobId/image", deleteJobImage);

export default router;