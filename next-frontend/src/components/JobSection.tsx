"use client"
import { useState } from "react"
import { useGetJobsQuery } from "@/redux/api/jobApiSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Briefcase, MapPin, Calendar, Heart, MessageCircle, Share, ExternalLink } from "lucide-react"
import { useToggleLikeJobMutation, useAddJobCommentMutation } from "@/redux/api/jobApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Input } from "./ui/input"
import { toast } from "react-toastify"
import Image from "next/image"

interface Job {
  _id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string
  salary?: string
  jobType: string
  applicationLink?: string
  applicationDeadline?: string
  author: {
    _id: string
    username: string
    avatar: string
  }
  likes: string[]
  comments: Array<{
    _id: string
    text: string
    user: {
      _id: string
      username: string
      avatar: string
    }
    createdAt: string
  }>
  createdAt: string
}

const JobSection = () => {
  const { data: jobsData, isLoading, isError } = useGetJobsQuery({ page: 1, limit: 10 })
  const [toggleLike] = useToggleLikeJobMutation()
  const [addComment] = useAddJobCommentMutation()
  const [commentText, setCommentText] = useState<string>("")
  const [activeCommentJobId, setActiveCommentJobId] = useState<string | null>(null)

  const { userInfo } = useSelector((state: RootState) => state.auth)

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading jobs...</div>
  }

  if (isError) {
    return <div className="flex justify-center p-8">Error loading jobs. Please try again later.</div>
  }

  const jobs: Job[] = jobsData?.data?.jobs || []

  const handleLike = async (jobId: string) => {
    if (!userInfo) {
      toast.error("Please log in to like job postings")
      return
    }

    try {
      await toggleLike(jobId).unwrap()
    } catch (error) {
      console.error("Failed to like job:", error)
    }
  }

  const handleComment = async (jobId: string) => {
    if (!userInfo) {
      toast.error("Please log in to comment")
      return
    }

    if (!commentText.trim()) return

    try {
      await addComment({ id: jobId, text: commentText }).unwrap()
      setCommentText("")
      setActiveCommentJobId(null)
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6 p-4">
      {jobs.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">No job postings available at the moment.</div>
      ) : (
        jobs.map((job) => (
          <Card key={job._id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span className="mr-4">{job.company}</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {job.jobType}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-gray-700">{job.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">Requirements</h3>
                <p className="text-gray-700">{job.requirements}</p>
              </div>

              {job.salary && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-1">Salary</h3>
                  <p className="text-gray-700">{job.salary}</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Deadline: {formatDate(job.applicationDeadline || "")}</span>
                </div>

                {job.applicationLink && (
                  <Button asChild>
                    <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                      Apply Now <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center text-gray-500 text-sm mt-4 pt-4 border-t">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <Image
                      src={job.author.avatar || "/placeholder-user.jpg"}
                      alt={job.author.username}
                      height={24} width={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  </Avatar>
                  <span>Posted by {job.author.username}</span>
                </div>
                <span className="mx-2">•</span>
                <span>{formatDate(job.createdAt)}</span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => handleLike(job._id)}
                >
                  <Heart
                    className={`h-5 w-5 ${userInfo && job.likes.includes(userInfo._id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span>{job.likes.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => setActiveCommentJobId(activeCommentJobId === job._id ? null : job._id)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{job.comments.length}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {job.comments.length > 0 && (
              <div className="px-4 pb-3 border-t pt-3">
                <h4 className="font-medium mb-2">Comments</h4>
                <div className="space-y-3">
                  {job.comments.slice(0, 3).map((comment) => (
                    <div key={comment._id} className="flex space-x-2">
                      <Avatar className="h-8 w-8">
                        <Image
                          src={comment.user.avatar || "/placeholder-user.jpg"}
                          alt={comment.user.username}
                          height={32} width={32}
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
                  {job.comments.length > 3 && (
                    <button className="text-sm text-blue-600 hover:underline">
                      View all {job.comments.length} comments
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeCommentJobId === job._id && (
              <div className="p-4 border-t flex space-x-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => handleComment(job._id)}>Post</Button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  )
}

export default JobSection
