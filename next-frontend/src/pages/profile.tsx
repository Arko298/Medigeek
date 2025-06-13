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
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = 
  
   useGetProfileOfCurrentUserQuery(undefined, {
    skip: !userInfo,
  })

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

  if (!apiResponse?.data || !userInfo) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">Profile data not available</div>
        </div>
      </RootLayout>
    )
  }

  // Extract user data from API response
  const userData = apiResponse.data

  // Safely transform data for ProfileHeader
  const profileHeaderData = {
    _id: userData._id,
    fullName: userData.fullName || "Unknown User",
    userName: userData.userName || "unknown",
    email: userData.email || "",
    bio: userData.bio || "",
    avatar: userData.profilePicture || "", // Use the profilePicture from API
    collegeName: userData.collegeName || "Not specified",
    followers: userData.followers || 0,
    following: userData.followings || 0,
    isFollowing: false, // Not relevant for own profile
    hasSentFriendRequest: false, // Not relevant for own profile
    isBlocked: false, // Not relevant for own profile
  }

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
