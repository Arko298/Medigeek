// This code defines a modal component for displaying and managing followers of a user.
// It uses the Dialog component from a UI library to create a modal dialog.
"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useGetFollowersQuery, useFollowUserMutation, useUnfollowUserMutation } from "@/redux/api/userApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { useRouter } from "next/router"

interface FollowersModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName: string
}

const FollowersModal = ({ isOpen, onClose, userId, userName }: FollowersModalProps) => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const {
    data: followersData,
    isLoading,
    isFetching,
  } = useGetFollowersQuery({ userName, page, limit: 10 }, { skip: !isOpen })
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation()
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const followers = followersData?.data?.followers || []
  const totalPages = followersData?.data?.totalPages || 1

  const handleFollow = async (followerId: string) => {
    try {
      await followUser(followerId).unwrap()
    } catch (error) {
      console.error("Failed to follow user:", error)
    }
  }

  const handleUnfollow = async (followerId: string) => {
    try {
      await unfollowUser(followerId).unwrap()
    } catch (error) {
      console.error("Failed to unfollow user:", error)
    }
  }

  const handleViewProfile = (followerId: string) => {
    router.push(`/profile/${followerId}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No followers yet</div>
          ) : (
            <div className="space-y-4">
              {followers.map((follower: any) => (
                <div key={follower._id} className="flex items-center justify-between">
                  <div
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => handleViewProfile(follower._id)}
                  >
                    <Avatar className="h-10 w-10">
                      <img
                        src={follower.avatar || "/placeholder-user.jpg"}
                        alt={follower.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">{follower.fullName}</p>
                      <p className="text-sm text-gray-500">@{follower.userName}</p>
                    </div>
                  </div>

                  {userInfo && userInfo._id !== follower._id && (
                    <div>
                      {follower.isFollowing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnfollow(follower._id)
                          }}
                          disabled={isUnfollowing}
                        >
                          {isUnfollowing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserMinus className="h-4 w-4 mr-1" />
                          )}
                          <span className="hidden sm:inline">Unfollow</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFollow(follower._id)
                          }}
                          disabled={isFollowing}
                        >
                          {isFollowing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4 mr-1" />
                          )}
                          <span className="hidden sm:inline">Follow</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isFetching}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FollowersModal
