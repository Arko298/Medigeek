"use client"
import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useBlockUserMutation,
  useUpdateProfileMutation,
} from "@/redux/api/userApiSlice"
import { UserPlus, UserMinus, UserX, Edit, Users } from "lucide-react"
import FollowersModal from "./FollowersModal"
import FollowingsModal from "./FollowingsModal"

interface ProfileHeaderProps {
  user: {
    _id: string
    fullName: string
    userName: string
    email: string
    bio?: string
    avatar?: string
    collegeName: string
    followers: number
    following: number
    isFollowing?: boolean
    hasSentFriendRequest?: boolean
    isBlocked?: boolean
  }
  isOwnProfile: boolean
}

const ProfileHeader = ({ user, isOwnProfile }: ProfileHeaderProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
  const [isFollowingsModalOpen, setIsFollowingsModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: user.fullName,
    bio: user.bio || "",
    collegeName: user.collegeName,
  })

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [blockUser] = useBlockUserMutation()
  const [updateProfile] = useUpdateProfileMutation()

  const handleFollow = async () => {
    try {
      await followUser(user._id).unwrap()
    } catch (error) {
      console.error("Failed to follow user:", error)
    }
  }

  const handleUnfollow = async () => {
    try {
      await unfollowUser(user._id).unwrap()
    } catch (error) {
      console.error("Failed to unfollow user:", error)
    }
  }

  const handleBlock = async () => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        await blockUser(user._id).unwrap()
      } catch (error) {
        console.error("Failed to block user:", error)
      }
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(editForm).unwrap()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const getActionButton = () => {
    if (isOwnProfile) {
      return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">College</label>
                <Input
                  value={editForm.collegeName}
                  onChange={(e) => setEditForm({ ...editForm, collegeName: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    if (user.isBlocked) {
      return (
        <Button variant="destructive" disabled>
          <UserX className="h-4 w-4 mr-2" />
          Blocked
        </Button>
      )
    }

    if (user.hasSentFriendRequest) {
      return (
        <Button variant="outline" disabled>
          <UserPlus className="h-4 w-4 mr-2" />
          Request Sent
        </Button>
      )
    }

    if (user.isFollowing) {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUnfollow}>
            <UserMinus className="h-4 w-4 mr-2" />
            Unfollow
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBlock}>
            <UserX className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex space-x-2">
        <Button onClick={handleFollow}>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </Button>
        <Button variant="destructive" size="sm" onClick={handleBlock}>
          <UserX className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <Avatar className="h-32 w-32">
          <img
            src={user.avatar || "/placeholder-user.jpg"}
            alt={user.fullName}
            className="h-32 w-32 rounded-full object-cover"
          />
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-gray-600">@{user.userName}</p>
              <p className="text-sm text-gray-500">{user.collegeName}</p>
            </div>
            <div className="mt-4 md:mt-0">{getActionButton()}</div>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 mb-4">
            <button
              onClick={() => setIsFollowersModalOpen(true)}
              className="text-center hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <div className="font-bold text-xl">{user.followers}</div>
              <div className="text-gray-600 text-sm flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Followers
              </div>
            </button>
            <button
              onClick={() => setIsFollowingsModalOpen(true)}
              className="text-center hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <div className="font-bold text-xl">{user.following}</div>
              <div className="text-gray-600 text-sm flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Following
              </div>
            </button>
          </div>

          {user.bio && (
            <div className="text-gray-700">
              <p>{user.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Followers Modal */}
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        userId={user._id}
        userName={user.userName}
      />

      {/* Followings Modal */}
      <FollowingsModal
        isOpen={isFollowingsModalOpen}
        onClose={() => setIsFollowingsModalOpen(false)}
        userId={user._id}
        userName={user.userName}
      />
    </Card>
  )
}

export default ProfileHeader
// This component displays the profile header with user information, action buttons, and modals for followers and following lists.
// It allows users to edit their profile, follow/unfollow/block other users, and view followers and following lists in modals.