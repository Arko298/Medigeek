"use client"
import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useCreatePostMutation } from "@/redux/api/postApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { ImageIcon, Smile, MapPin } from "lucide-react"
import Image from "next/image"

const NewPostForm = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [createPost, { isLoading }] = useCreatePostMutation()
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userInfo) {
      alert("Please log in to create a post")
      return
    }

    if (!title.trim() || !content.trim()) {
      alert("Please fill in all required fields")
      return
    }

    try {
      await createPost({
        title,
        description: title,
        content,
      }).unwrap()

      // Reset form
      setTitle("")
      setContent("")
    } catch (error) {
      console.error("Failed to create post:", error)
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src={ "/placeholder-user.jpg"} //userInfo?.avatar ||
                alt="User avatar"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
              required
            />
          </div>

          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
            required
          />

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex space-x-2">
              <Button type="button" variant="ghost" size="sm" className="text-gray-500">
                <ImageIcon className="h-5 w-5 mr-1" />
                Photo
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-gray-500">
                <Smile className="h-5 w-5 mr-1" />
                Feeling
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-gray-500">
                <MapPin className="h-5 w-5 mr-1" />
                Location
              </Button>
            </div>

            <Button type="submit" disabled={isLoading || !title.trim() || !content.trim()}>
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}

export default NewPostForm
