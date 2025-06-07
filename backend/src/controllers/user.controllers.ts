import User from "../models/user.models.ts";
import ApiError from "../config/ApiError.ts";
import ApiResponse from "../config/ApiResponse.ts";
import asyncHandler from "../config/asynchandler.ts";
import bcrypt from "bcrypt";
import createToken from "../config/createToken.ts";
import Post from "../models/post.models.ts";

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
const logoutUser = async (req: any, res: any) => {
  res.cookie("jwt", " ", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json("Logged out successfully");
};

const getProfileOfCurrentUser = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);
   const posts = await Post.find({ author: user?._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title content createdAt likes comments');

  if (user) {
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      bio: user.bio,
      collegeName: user.collegeName,
      followers: user.followers.length,
      following: user.followings.length,
      posts_number: posts.length,
      profilePicture: user.profilePicture || null,
      posts:posts || [],
    });
  } else {
    res.status(404).json("User not found");
  }
});

//profile pages
const updateProfile = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio;
    user.userName = req.body.userName || user.userName;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      userName: updatedUser.userName,
      email: updatedUser.email,
      collegeName: updatedUser.collegeName,
      bio: updatedUser.bio,
    });
  } else {
    res.status(400).json("Failed to update profile");
  }
});
const getFollowings = asyncHandler(async (req: any, res: any) => {
  // the person whom i am following.
  const user = await User.findById(req.user._id);
  if (user) {
    const followers = await User.find({ followers: user.id });
    res.status(200).json({
      count: followers.length,
      message: "The person you follows fetched successfully",
      followers: followers,
    });
  } else {
    res.status(500).json("Failed to fetch followers");
  }
});
const getFollowers = asyncHandler(async (req: any, res: any) => {
  // the person who is  following me.
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const user: any = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const following = await User.find({ followings: user.id });
    res
      .status(200)
      .json(new ApiResponse(200, "Followers fetched successfully", following));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Failed to fetch followers"));
  }
});

const seeProfileOfAnotherUser = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('title content createdAt likes comments');
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    bio: user.bio,
    collegeName: user.collegeName,
    followers: user.followers.length,
    following: user.followings.length,
    posts: posts
  });
});

const searchUser = asyncHandler(async(req:any, res: any)=>{
  const { query, page = 1, limit = 10 } = req.query;
  if (!query) {
    return res.status(400).json(new ApiError(400, "Query parameter is required"));
  }

  const regex = new RegExp(query, "i"); // Case-insensitive search
  const users = await User.find({
    $or: [
      { fullName: regex },
      { userName: regex },
      { email: regex },
      { collegeName: regex },
    ],
  })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-password -__v");

  if (users.length === 0) {
    return res.status(404).json(new ApiError(404, "No users found"));
  }

  res.status(200).json({
    count: users.length,
    users,
  });
})

//friend-request
const followUser = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const receiver = await User.findById(userId);
  const sender = await User.findById(req.user._id);

  if (!receiver || !sender) {
    throw new ApiError(404, "User not found");
  }

  if (receiver.friendRequests.includes(sender._id)) {
    throw new ApiError(400, "Friend request already sent");
  }

  receiver.friendRequests.push(sender._id);
  await receiver.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, "Friend request sent successfully", receiver));
});
const unfollowUser = asyncHandler(async (req: any, res: any) => {
  const { userId } = req.params;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const targetUser = await User.findById(userId);
  const currentUser = await User.findById(req.user._id);

  if (!targetUser || !currentUser) {
    throw new ApiError(404, "User not found");
  }

  // Check if following
  if (!currentUser.followings.includes(userId)) {
    throw new ApiError(400, "Not following this user");
  }

  // Remove from following and followers
  currentUser.followings = currentUser.followings.filter(
    (id) => id.toString() !== userId,
  );
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== req.user!._id,
  );

  await Promise.all([currentUser.save(), targetUser.save()]);

  res.status(200).json(
    new ApiResponse(200, `Unfollowed ${targetUser.fullName}`, {
      followers: targetUser.followers.length,
      following: currentUser.followings.length,
    }),
  );
});
const acceptFriendRequest = asyncHandler(async (req: any, res: any) => {
  const { senderId } = req.body;

  if (!req.user) {
    throw new ApiError(401, "User not authorized");
  }

  const receiver = await User.findById(req.user._id);
  const sender = await User.findById(senderId);

  if (!receiver || !sender) {
    throw new ApiError(404, "User not found");
  }

  if (!receiver.friendRequests.includes(sender._id)) {
    throw new ApiError(400, "No friend request found");
  }

  if (receiver.friends.includes(sender._id)) {
    throw new ApiError(400, "Already friends");
  }

  // Add to friends list
  receiver.friends.push(sender._id);
  sender.friends.push(receiver._id);

  // Add to followers and following (mutual follow)
  receiver.followers.push(sender._id);
  sender.followings.push(receiver._id);

  // Remove friend request
  receiver.friendRequests = receiver.friendRequests.filter(
    (id) => id.toString() !== sender._id.toString(),
  );

  await Promise.all([
    receiver.save({ validateBeforeSave: false }),
    sender.save({ validateBeforeSave: false }),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Friend request accepted successfully", {
      _id: receiver._id,
      fullName: receiver.fullName,
      email: receiver.email,
      collegeName: receiver.collegeName,
      bio: receiver.bio,
      followers: receiver.followers.length,
      following: receiver.followings.length,
    }),
  );
});
const declineFriendRequest = async (req: any, res: any) => {
  try {
    const { senderId } = req.body;
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const receiver: any = await User.findById(req.user.id);
    if (!receiver) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const sender: any = await User.findById(senderId);
    if (!sender) {
      return res.status(401).json(new ApiError(401, "User not found"));
    }
    if (!receiver.friendRequests.includes(sender.id)) {
      return res.status(400).json(new ApiError(400, "No friend request found"));
    }
    receiver.friendRequests = receiver.friendRequests.filter(
      (id: any) => id !== sender.id,
    );
    await receiver.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(
        new ApiResponse(200, "Friend request declined successfully", receiver),
      );
  } catch (error) {
    res.status(400).json(new ApiError(400, "Failed to decline friend request"));
  }
};
const blockFriend = async (req: any, res: any) => {
  try {
    const { friendId } = req.body;
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const user: any = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const friend: any = await User.findById(friendId);
    if (!friend) {
      return res.status(401).json(new ApiError(401, "User not found"));
    }
    if (user.blockedUsers.includes(friend.id)) {
      return res.status(400).json(new ApiError(400, "Already blocked"));
    }
    user.blockedUsers.push(friend.id);
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(200, "Friend blocked successfully", user));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Failed to block friend"));
  }
};
const unblockFriend = async (req: any, res: any) => {
  try {
    const { friendId } = req.body;
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const user: any = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json(new ApiError(401, "User not authorized"));
    }
    const friend: any = await User.findById(friendId);
    if (!friend) {
      return res.status(401).json(new ApiError(401, "User not found"));
    }
    if (!user.blockedUsers.includes(friend.id)) {
      return res.status(400).json(new ApiError(400, "Not blocked"));
    }
    user.blockedUsers = user.blockedUsers.filter((id: any) => id !== friend.id);
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(200, "Friend unblocked successfully", user));
  } catch (error) {
    res.status(400).json(new ApiError(400, "Failed to unblock friend"));
  }
};

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
  acceptFriendRequest,
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
