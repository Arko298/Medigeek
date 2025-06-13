'use client'


import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send } from 'lucide-react'

interface PostProps {
  post: {
    id: number
    author: {
      name: string
      avatar: string
    }
    content: string
    likes: number
    comments: number
    timestamp: string
  }
}

export default function Post({ post }: PostProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [commenting, setCommenting] = useState(false)
  const [comment, setComment] = useState('')

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the comment to your backend
    console.log('New comment:', comment)
    setComment('')
    setCommenting(false)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-black">{post.author.name}</p>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex items-center space-x-4 mb-2">
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <Heart className={`w-5 h-5 mr-1 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCommenting(!commenting)}>
            <MessageCircle className="w-5 h-5 mr-1" />
            {post.comments}
          </Button>
        </div>
        {commenting && (
          <form onSubmit={handleComment} className="w-full">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="sm" disabled={!comment.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  )
}

