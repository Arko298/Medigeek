"use client"
import { useState } from "react"
import { useGetPostsQuery } from "@/redux/api/postApiSlice"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from "lucide-react"
import { useToggleLikePostMutation, useAddCommentMutation } from "@/redux/api/postApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Input } from "./ui/input"

interface Comment {
  _id: string
  text: string
  user: {
    _id: string
    username: string
    avatar: string
  }
  createdAt: string
}

interface Post {
  _id: string
  title: string
  description: string
  content: string
  image?: string
  author: {
    _id: string
    username: string
    avatar: string
  }
  likes: string[]
  comments: Comment[]
  createdAt: string
}

const PostFeed = () => {
  const { data: postsData, isLoading, isError, refetch } = useGetPostsQuery({ page: 1, limit: 10 })
  const [toggleLike] = useToggleLikePostMutation()
  const [addComment] = useAddCommentMutation()
  const [commentText, setCommentText] = useState<string>("")
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)

  const { userInfo } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading posts...</div>
  }

  if (isError) {
    return <div className="flex justify-center p-8">Error loading posts. Please try again later.</div>
  }

  const posts: Post[] = postsData?.data?.posts || []

  const handleLike = async (postId: string) => {
    if (!userInfo) {
      alert("Please log in to like posts")
      return
    }

    try {
      await toggleLike(postId).unwrap()
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleComment = async (postId: string) => {
    if (!userInfo) {
      alert("Please log in to comment")
      return
    }

    if (!commentText.trim()) return

    try {
      await addComment({ id: postId, text: commentText }).unwrap()
      setCommentText("")
      setActiveCommentPostId(null)
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6 mt-6">
      {posts.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">No posts yet. Be the first to share something!</div>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <img
                    src={post.author.avatar || "/avatar.svg"}
                    alt={post.author.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </Avatar>
                <div>
                  <h3 className="font-medium">{post.author.username}</h3>
                  <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-4 pb-3">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>
            </div>

            {post.image && (
              <div className="w-full h-64 relative">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-4 flex items-center justify-between border-t">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => handleLike(post._id)}
                >
                  <Heart
                    className={`h-5 w-5 ${userInfo && post.likes.includes(userInfo._id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span>{post.likes.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments.length}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>

            {post.comments.length > 0 && (
              <div className="px-4 pb-3 border-t pt-3">
                <h4 className="font-medium mb-2">Comments</h4>
                <div className="space-y-3">
                  {post.comments.slice(0, 3).map((comment) => (
                    <div key={comment._id} className="flex space-x-2">
                      <Avatar className="h-8 w-8">
                        <img
                          src={comment.user.avatar || "/placeholder-user.jpg"}
                          alt={comment.user.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-2 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">{comment.user.username}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  {post.comments.length > 3 && (
                    <button className="text-sm text-blue-600 hover:underline">
                      View all {post.comments.length} comments
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeCommentPostId === post._id && (
              <div className="p-4 border-t flex space-x-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => handleComment(post._id)}>Post</Button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  )
}

export default PostFeed
