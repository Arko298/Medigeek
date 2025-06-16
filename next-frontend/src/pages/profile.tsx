"use client"
import { useGetProfileOfCurrentUserQuery } from "@/redux/api/userApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import RootLayout from "@/layouts/RootLayout"
import ProfileHeader from "@/components/ProfilePage/ProfileHeader"
import UserPosts from "@/components/ProfilePage/UserPost"

const Profile = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const {
    data : apiUserInfo,
    isLoading,
    isError,
    error,
  } = 
  
   useGetProfileOfCurrentUserQuery("")

  if (isLoading) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading profile...</div>
        </div>
      </RootLayout>
    )
  }

  if (isError) {
    console.error("Profile error:", error)
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">{"Error loading profile"}</div>
        </div>
      </RootLayout>
    )
  }

  if ( !apiUserInfo ||  !userInfo) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">Profile data not available</div>
        </div>
      </RootLayout>
    )
  }

  // Extract user data from API response
  const userData = apiUserInfo?.data?.data
  console.log("User Data:", userData.data)

  // Safely transform data for ProfileHeader
  const profileHeaderData = {
    _id: userData.data._id,
    fullName: userData.data.fullName || "Unknown User",
    userName: userData.data.userName || "unknown",
    bio: userData.data.bio || "",
    email: userData.data.email || "Not provided",
    isVerified: userData.data.isVerified || false,
    avatar: userData.data.profilePicture || "", // Use the profilePicture from API
    collegeName: userData.data.collegeName || "Not specified",
    followers: Array.isArray(userData.data.followers) ? userData.data.followers.length : 0,
    followings: Array.isArray(userData.data.followings) ? userData.data.following.length : 0,
    isFollowing: false, // Not relevant for own profile
    hasSentFriendRequest: false, // Not relevant for own profile
    isBlocked: false, // Not relevant for own profile
  }
  console.log("Profile Header Data:", profileHeaderData)

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <ProfileHeader user={profileHeaderData} isOwnProfile={true} />
          <UserPosts userId={userInfo._id} />
        </div>
      </div>
    </RootLayout>
  )
}

export default Profile
