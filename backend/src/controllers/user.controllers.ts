// This file contains all the REST controllers for users.
//We can registerUser,loginUser,logoutUser,getProfileOfCurrentUser,updateProfile,getFollowers,getFollowings,
//seeProfileOfANotherUSer,SearchUser,followUser(Sent friend-request), 

import User from "../models/user.models.ts";
import ApiError from "../config/ApiError.ts";
import ApiResponse from "../config/ApiResponse.ts";
import asyncHandler from "../config/asynchandler.ts";
import bcrypt from "bcrypt";
import createToken from "../config/createToken.ts";
import Post from "../models/post.models.ts";
import mongoose from "mongoose";
import { deleteFile, getFileUrl, uploadFile } from "../config/S3_Util.ts";

// Avatar part should be done. It is currently not done.

const registerUser = asyncHandler(async (req: any, res: any) => {
  const { fullName, email, userName, password, collegeName } = req.body;

  if (!fullName || !email || !userName || !password || !collegeName) {
    throw new ApiError(400, "Please fill all the fields");
  }
  const userExists = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    fullName,
    email,
    userName,
    password: hashedPassword,
    collegeName,
  });

  try {
    await user.save();
    createToken(res, user._id);
    res.status(201).json(
      new ApiResponse(201, "User created successfully", {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        collegeName: user.collegeName,
        bio: user.bio,
        isAdmin: user.isAdmin,
      }),
    );
  } catch (error) {
    throw new ApiError(500, "Failed to create user");
  }
});

const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please fill all the fields");
  }
  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json("Invalid credentials");
    } else {
      createToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        collegeName: user.collegeName,
        bio: user.bio,
        isAdmin: user.isAdmin,
      });
    }
  }
});
const logoutUser = asyncHandler( async (req: any, res: any) => {
  res.cookie("jwt", " ", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json("Logged out successfully");
});







const getProfileOfCurrentUser = asyncHandler(async (req: any, res: any) => {
  // Check if user is authenticated
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const user = await User.findById(req.user._id)
    .select('-password -__v -friendRequests -acceptedRequests -friends -blockedUsers')
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title content createdAt likes comments')
    .populate('likes', 'username')
    .populate('comments.user', 'username avatar')
    .lean();

  // Get profile picture URL if key exists
  const profilePicture = user.profilePictureKey 
    ? await getFileUrl(user.profilePictureKey)
    : null;

  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", {
      data: {
        ...user,
        followers: user.followers?.length || 0,
        followings: user.followings?.length || 0,
        posts_number: posts.length,
        profilePicture,
        posts: posts || [],
      }
    })
  );
});

//profile pages
const updateProfile = asyncHandler(async (req: any, res: any) => {
  const { fullName, email, userName, password, bio } = req.body;
  const userId = req.user._id;

  // Check if username is being updated and if it already exists
  if (userName) {
    const existingUser = await User.findOne({ 
      userName,
      _id: { $ne: userId } // Exclude current user from check
    });

    if (existingUser) {
      throw new ApiError(400, "Username already taken");
    }
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update user fields
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  
  // Only update username if it's provided and different
  if (userName && userName !== user.userName) {
    user.userName = userName;
  }

  // Update password if provided
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();

  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      userName: updatedUser.userName,
      email: updatedUser.email,
      collegeName: updatedUser.collegeName,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
    })
  );
});
const getFollowings = asyncHandler(async (req: any, res: any) => {
  // The people the current user is following
  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [followings, totalFollowings] = await Promise.all([
    User.find({ followers: user._id })
      .select("-password -__v -friendRequests -acceptedRequests -friends -blockedUsers")
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({ followers: user._id })
  ]);

  res.status(200).json(
    new ApiResponse(200, "Followings fetched successfully", {
      followings,
      count: followings.length,
      totalFollowings,
      totalPages: Math.ceil(totalFollowings / limit),
      currentPage: page
    })
  );
});


const getFollowers = asyncHandler(async (req: any, res: any) => {
  // The people who are following the current user
  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [followers, totalFollowers] = await Promise.all([
    User.find({ followings: user._id })
      .select("-password -__v -friendRequests -acceptedRequests -friends -blockedUsers")
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({ followings: user._id })
  ]);

  // Add isFollowing status for each follower if logged in
  let isFollowing = false;
  if (req.user._id) {
    const currentUser = await User.findById(req.user._id).select("followings");
    followers.forEach(follower => {
      isFollowing = !!currentUser?.followings.includes(follower._id);
    });
  }

  res.status(200).json(
    new ApiResponse(200, "Followers fetched successfully", {
      followers,
      count: followers.length,
      totalFollowers,
      totalPages: Math.ceil(totalFollowers / limit),
      currentPage: page
    })
  );
});

const seeProfileOfAnotherUser = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;
  const currentUserId = req.user?._id;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const [user, posts] = await Promise.all([
    User.findById(userId).select("-password -__v -friendRequests -acceptedRequests -friends -blockedUsers"),
    Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title content createdAt likes comments')
      .populate('author', 'fullName userName avatar')
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if current user is following this user
  let isFollowing = false;
  if (currentUserId) {
    const currentUser = await User.findById(currentUserId).select("followings");
    isFollowing = !!currentUser?.followings.includes(user._id);
  }

  res.status(200).json(new ApiResponse(200, "User profile fetched successfully", {
    user: {
      ...user.toObject(),
      isFollowing
    },
    posts
  }));
});

//to search another user via search bar
const searchUser = asyncHandler(async (req: any, res: any) => {
  const { query, page = 1, limit = 10 } = req.query;
  
  if (!query || query.trim() === "") {
    return res.status(400).json(new ApiError(400, "Search query is required"));
  }

  const regex = new RegExp(query.trim(), "i"); // Case-insensitive search
  const currentUserId = req.user?._id;

  try {
    const users = await User.find({
      $or: [
        { fullName: regex },
        { userName: regex },
        { collegeName: regex },
      ],
      _id: { $ne: currentUserId } // Exclude current user from results
    })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-password -__v -friendRequests -acceptedRequests -friends -blockedUsers")
    .lean(); // Convert to plain JS object

    // Add follow status for each user if logged in
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select("followings");
      users.forEach(user => {
        (user as any).isFollowing = currentUser?.followings.includes(user._id);
      });
    }

    const totalUsers = await User.countDocuments({
      $or: [
        { fullName: regex },
        { userName: regex },
        { collegeName: regex },
      ],
      _id: { $ne: currentUserId }
    });

    if (users.length === 0) {
      return res.status(200).json(new ApiResponse(200, "No users found", {
        users: [],
        count: 0,
        totalPages: 0,
        currentPage: page
      }));
    }

    res.status(200).json(new ApiResponse(200, "Users fetched successfully", {
      users,
      count: users.length,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    }));

  } catch (error) {
    throw new ApiError(500, "Error searching users");
  }
});

//friend-request
const followUser = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  // Prevent users from following themselves
  if (req.user._id.toString() === userId) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const [receiver, sender] = await Promise.all([
    User.findById(userId).select("-password -__v -friendRequests -acceptedRequests -friends -blockedUsers"),
    User.findById(req.user._id)
  ]);

  if (!receiver || !sender) {
    throw new ApiError(404, "User not found");
  }

  // Check if already following
  if (sender.followings.includes(receiver._id)) {
    throw new ApiError(400, `You are already following ${receiver.fullName}`);
  }

  // Update both users in parallel
  await Promise.all([
    User.findByIdAndUpdate(receiver._id, {
      $addToSet: { followers: sender._id } // $addToSet prevents duplicates
    }),
    User.findByIdAndUpdate(sender._id, {
      $addToSet: { followings: receiver._id } // $addToSet prevents duplicates
    })
  ]);

  // Fetch the updated receiver data
  const updatedReceiver = await User.findById(userId)
    .select("-password -__v -friendRequests -acceptedRequests -friends -blockedUsers");

  res.status(200).json(
    new ApiResponse(200, `Successfully followed ${updatedReceiver?.fullName}`, {
      user: updatedReceiver,
      followersCount: updatedReceiver?.followers.length,
      followingCount: updatedReceiver?.followings.length
    })
  );
});

//unfollow user
const unfollowUser = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  // Prevent users from unfollowing themselves (though this shouldn't happen if follow is blocked)
  if (req.user._id.toString() === userId) {
    throw new ApiError(400, "You cannot unfollow yourself");
  }

  const [targetUser, currentUser] = await Promise.all([
    User.findById(userId).select("fullName followers"),
    User.findById(req.user._id).select("followings")
  ]);

  if (!targetUser || !currentUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if following
  if (!currentUser.followings.some(id => id.toString() === userId)) {
    throw new ApiError(400, `You are not following ${targetUser.fullName}`);
  }

  // Use atomic updates instead of fetching and saving
  await Promise.all([
    User.findByIdAndUpdate(currentUser._id, {
      $pull: { followings: userId }
    }),
    User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: currentUser._id }
    })
  ]);

  // Get updated counts
  const updatedCounts = await Promise.all([
    User.findById(userId).select("followers"),
    User.findById(req.user._id).select("followings")
  ]);

  res.status(200).json(
    new ApiResponse(200, `Successfully unfollowed ${targetUser.fullName}`, {
      followersCount: updatedCounts[0]?.followers.length || 0,
      followingCount: updatedCounts[1]?.followings.length || 0,
      isFollowing: false
    })
  );
});

const blockFriend = asyncHandler(async (req: any, res: any) => {
  const { friendId } = req.body;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  // Prevent self-blocking
  if (req.user._id.toString() === friendId) {
    throw new ApiError(400, "You cannot block yourself");
  }

  const [user, friend] = await Promise.all([
    User.findById(req.user._id),
    User.findById(friendId).select("-password")
  ]);

  if (!user || !friend) {
    throw new ApiError(404, "User not found");
  }

  if (user.blockedUsers.includes(friend._id)) {
    throw new ApiError(400, "User is already blocked");
  }

  // Remove any existing follow relationships
  const updates = [
    User.findByIdAndUpdate(user._id, {
      $addToSet: { blockedUsers: friend._id },
      $pull: { 
        followings: friend._id,
        followers: friend._id,
        friends: friend._id,
        friendRequests: friend._id,
        acceptedRequests: friend._id
      }
    }),
    User.findByIdAndUpdate(friend._id, {
      $pull: { 
        followings: user._id,
        followers: user._id,
       
      }
    })
  ];

  await Promise.all(updates);

  // Get updated user data
  const updatedUser = await User.findById(user._id)
    .select("-password -__v");

  res.status(200).json(
    new ApiResponse(200, "User blocked successfully", {
      user: updatedUser,
      isBlocked: true,
      isFollowing: false,
      isFriend: false
    })
  );
});

const unblockFriend = asyncHandler(async (req: any, res: any) => {
  const { friendId } = req.body;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const [user, friend] = await Promise.all([
    User.findById(req.user._id),
    User.findById(friendId).select("-password")
  ]);

  if (!user || !friend) {
    throw new ApiError(404, "User not found");
  }

  if (!user.blockedUsers.includes(friend._id)) {
    throw new ApiError(400, "User is not blocked");
  }

  await User.findByIdAndUpdate(user._id, {
    $pull: { blockedUsers: friend._id }
  });

  // Get updated user data
  const updatedUser = await User.findById(user._id)
    .select("-password -__v");

  res.status(200).json(
    new ApiResponse(200, "User unblocked successfully", {
      user: updatedUser,
      isBlocked: false
    })
  );
});

//admins part
const getAllUsers = asyncHandler(async (req: any, res: any) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    if (users.length === 0) {
      res.status(404).json("No users found");
    }
    res.status(200).json({
      count: users.length,
      users: users,
    });
  } catch (error) {
    res.status(500).json("Error fetching users");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
 unblockFriend,
  getProfileOfCurrentUser,
  updateProfile,
  seeProfileOfAnotherUser,
  searchUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
  getAllUsers,
  blockFriend,
};



///Just did it...

// const acceptFriendRequest = asyncHandler(async (req: any, res: any) => {
//   const { senderId } = req.params;

//   if (!req.user) {
//     throw new ApiError(401, "User not authorized");
//   }

//   const receiver = await User.findById(req.user._id);
//   const sender = await User.findById(senderId).select("-password -_v ");

//   if (!receiver || !sender) {
//     throw new ApiError(404, "User not found");
//   }

//   if (!receiver.friendRequests.includes(sender._id)) {
//     throw new ApiError(400, "No friend request found");
//   }

//   // Add sender to receiver's acceptedRequests
//   if (!receiver.acceptedRequests.includes(sender._id)) {
//     receiver.acceptedRequests.push(sender._id);
    
//   }

//   // Check if sender has also accepted receiver
//   if (sender.acceptedRequests && sender.acceptedRequests.includes(receiver._id)) {
//     // Both have accepted, establish friendship

    

//     // Add to followers and following (mutual follow)
//     receiver.followers.push(sender._id);
//     sender.followings.push(receiver._id);

//     // Remove friend request
//     receiver.friendRequests = receiver.friendRequests.filter(
//       (id) => id.toString() !== sender._id.toString(),
//     );
//     // Remove from acceptedRequests
//     receiver.acceptedRequests = receiver.acceptedRequests.filter(
//       (id) => id.toString() !== sender._id.toString(),
//     );
//     sender.acceptedRequests = sender.acceptedRequests.filter(
//       (id) => id.toString() !== receiver._id.toString(),
//     );

//     await Promise.all([
//       receiver.save({ validateBeforeSave: false }),
//       sender.save({ validateBeforeSave: false }),
//     ]);

//     return res.status(200).json(
//       new ApiResponse(200, "Friend request accepted by both users, friendship established", {
//         _id: receiver._id,
//         fullName: receiver.fullName,
//         email: receiver.email,
//         collegeName: receiver.collegeName,
//         bio: receiver.bio,
//         followers: receiver.followers.length,
//         following: receiver.followings.length,
//       }),
//     );
//   } else {
//     // Only one side accepted, wait for the other
//     await receiver.save({ validateBeforeSave: false });
//     return res.status(200).json(
//       new ApiResponse(200, "Friend request accepted, waiting for the other user to accept", {
//         _id: receiver._id,
//         fullName: receiver.fullName,
//         email: receiver.email,
//         collegeName: receiver.collegeName,
//         bio: receiver.bio,
//         followers: receiver.followers.length,
//         following: receiver.followings.length,
//       }),
//     );
//   }
// });
// const declineFriendRequest = async (req: any, res: any) => {
//   try {
//     const { senderId } = req.body;
//     if (!req.user) {
//       return res.status(401).json(new ApiError(401, "User not authorized"));
//     }
//     const receiver: any = await User.findById(req.user.id);
//     if (!receiver) {
//       return res.status(401).json(new ApiError(401, "User not authorized"));
//     }
//     const sender: any = await User.findById(senderId);
//     if (!sender) {
//       return res.status(401).json(new ApiError(401, "User not found"));
//     }
//     if (!receiver.friendRequests.includes(sender.id)) {
//       return res.status(400).json(new ApiError(400, "No friend request found"));
//     }
//     receiver.friendRequests = receiver.friendRequests.filter(
//       (id: any) => id !== sender.id,
//     );
//     await receiver.save({ validateBeforeSave: false });
//     res
//       .status(200)
//       .json(
//         new ApiResponse(200, "Friend request declined successfully", receiver),
//       );
//   } catch (error) {
//     res.status(400).json(new ApiError(400, "Failed to decline friend request"));
//   }
// };