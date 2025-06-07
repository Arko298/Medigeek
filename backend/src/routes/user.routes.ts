import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  acceptFriendRequest,
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

const router: Router = Router();

router.route("/register").post(registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(authenticateToken, getProfileOfCurrentUser)
  .put(authenticateToken, updateProfile);

router.route("/profile/:userId").get(authenticateToken, seeProfileOfAnotherUser);

router.route("/search").get(authenticateToken, searchUser);
router
  .route("/friend-request/accept")
  .post(authenticateToken, acceptFriendRequest);
router.route("/follow/:userId").post(authenticateToken, followUser);
router.route("/unfollow/:userId").post(authenticateToken, unfollowUser);

router.route("/followers").get(authenticateToken, getFollowers);
router.route("/followings").get(authenticateToken, getFollowings);

router.route("/").get(authenticateToken, authorizeAdmin, getAllUsers);

export default router;
