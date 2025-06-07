"use client"
import { useGetPostsByUserQuery } from "@/redux/api/postApiSlice"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share } from "lucide-react"

interface UserPostsProps {
  userId: string
}

const UserPosts = ({ userId }: UserPostsProps) => {
  const { data: postsData, isLoading } = useGetPostsByUserQuery(
    { userId, page: 1, limit: 10 },
    { skip: !userId }
  )

  if (isLoading) {
    return <div className="text-center p-8">Loading posts...</div>
  }

  const userPosts = postsData?.data?.posts || []

  if (userPosts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No posts yet</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Posts</h2>
      {userPosts.map((post: any) => (
        <Card key={post._id} className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <img
                src={post.author.avatar || "/placeholder-user.jpg"}
                alt={post.author.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            </Avatar>
            <div>
              <h3 className="font-medium">{post.author.fullName}</h3>
              <p className="text-xs text-gray-500">
                @{post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
          </div>

          {post.image && (
            <div className="mb-4">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center space-x-4 pt-2 border-t">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes.length}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default UserPosts