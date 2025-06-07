"use client"
import { useRouter } from "next/router"
import { useGetUserProfileQuery } from "@/redux/api/userApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import RootLayout from "@/layouts/RootLayout"
import ProfileHeader from "@/components/ProfilePage/ProfileHeader.tsx"
import UserPosts from "@/components/ProfilePage/UserPost"

const UserProfile = () => {
  const router = useRouter()
  const { userId } = router.query
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const {
    data: profileData,
    isLoading,
    isError,
  } = useGetUserProfileQuery(userId as string, {
    skip: !userId,
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

  if (isError || !profileData) {
    return (
      <RootLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-red-500">Profile not found</div>
        </div>
      </RootLayout>
    )
  }

  const user = {
    ...profileData.data,
    followers: profileData.data.followers?.length || 0,
    following: profileData.data.following?.length || 0,
    isFollowing: profileData.data.followers?.includes(userInfo?._id),
  }

  const isOwnProfile = userInfo?._id === user._id

  return (
    <RootLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
          <UserPosts userId={user._id} />
        </div>
      </div>
    </RootLayout>
  )
}

export default UserProfile
