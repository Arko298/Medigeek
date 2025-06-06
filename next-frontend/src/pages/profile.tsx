"use client"
import { useGetProfileQuery } from "@/redux/api/userApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import RootLayout from "@/layouts/RootLayout"
import ProfileHeader from "@/components/ProfilePage/ProfileHeader"
import UserPosts from "@/components/ProfilePage/UserPost"

const Profile = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { data: profileData, isLoading, isError } = useGetProfileQuery("")

  if (isLoading) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg">Loading profile...</div>
        </div>
      </RootLayout>
    )
  }

  if (isError || !profileData || !userInfo) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">Please log in to view your profile</div>
        </div>
      </RootLayout>
    )
  }

  const user = {
    ...profileData.data,
    followers: Array.isArray(profileData.data?.followers) ? profileData.data.followers.length : 0,
    following: Array.isArray(profileData.data?.followings) ? profileData.data.followings.length : 0,
  }

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <ProfileHeader user={user} isOwnProfile={true} />
          <UserPosts userId={user._id} />
        </div>
      </div>
    </RootLayout>
  )
}




export default Profile
// This code defines a Profile page in a Next.js application that fetches and displays the user's profile information and their posts.
// It uses Redux for state management and RTK Query for data fetching.