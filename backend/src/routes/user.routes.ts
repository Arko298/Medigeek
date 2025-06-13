import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  // acceptFriendRequest,
  getProfileOfCurrentUser,
  updateProfile,
  searchUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
  getAllUsers,
  seeProfileOfAnotherUser,
} from "../controllers/user.controllers.ts";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middlewares/auth.middlewares";
import { apiLimiter, authLimiter } from "../config/rateLimit.ts";

const router: Router = Router();

router.use(apiLimiter);

router.route("/register").post(authLimiter,registerUser);
router.post("/login",authLimiter, loginUser);
router.post("/logout",authLimiter, logoutUser);

router
  .route("/profile")
  .get(authenticateToken, getProfileOfCurrentUser)
  .put(authenticateToken, updateProfile);

router.route("/profile/:userId").get(authenticateToken, seeProfileOfAnotherUser);

router.route("/search").get(authenticateToken, searchUser);

router.route("/follow/:userId").post(authenticateToken, followUser);
router.route("/unfollow/:userId").post(authenticateToken, unfollowUser);

router.route("/followers").get(authenticateToken, getFollowers);
router.route("/followings").get(authenticateToken, getFollowings);

router.route("/").get(authenticateToken, authorizeAdmin, getAllUsers);

export default router;
