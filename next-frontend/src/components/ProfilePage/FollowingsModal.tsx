"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useGetFollowingsQuery, useUnfollowUserMutation } from "@/redux/api/userApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { UserMinus, Loader2 } from "lucide-react"
import { useRouter } from "next/router"

interface FollowingsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  fullName: string
}

const FollowingsModal = ({ isOpen, onClose, userId, fullName }: FollowingsModalProps) => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const {
    data: followingsData,
    isLoading,
    isFetching,
  } = useGetFollowingsQuery({ fullName, page, limit: 10 }, { skip: !isOpen })
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation()
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const followings = followingsData?.data?.followings || []
  const totalPages = followingsData?.data?.totalPages || 1

  const handleUnfollow = async (followingId: string) => {
    try {
      await unfollowUser(followingId).unwrap()
    } catch (error) {
      console.error("Failed to unfollow user:", error)
    }
  }

  const handleViewProfile = (followingId: string) => {
    router.push(`/profile/${followingId}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : followings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Not following anyone yet</div>
          ) : (
            <div className="space-y-4">
              {followings.map((following: any) => (
                <div key={following._id} className="flex items-center justify-between">
                  <div
                    className="flex items-center space-x-3 flex-1 cursor-pointer"
                    onClick={() => handleViewProfile(following._id)}
                  >
                    <Avatar className="h-10 w-10">
                      <img
                        src={following.avatar || "/placeholder-user.jpg"}
                        alt={following.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <p className="font-medium">{following.fullName}</p>
                      <p className="text-sm text-gray-500">@{following.userName}</p>
                    </div>
                  </div>

                  {userInfo && userInfo._id === userId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnfollow(following._id)
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

export default FollowingsModal
// Same as the  FollowersModal component, but for followings.