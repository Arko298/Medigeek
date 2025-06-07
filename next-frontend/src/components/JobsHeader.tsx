"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCreateJobMutation } from "@/redux/api/jobApiSlice"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Briefcase, Search } from "lucide-react"

const JobsHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [salary, setSalary] = useState("")
  const [jobType, setJobType] = useState("Full-time")
  const [applicationLink, setApplicationLink] = useState("")
  const [applicationDeadline, setApplicationDeadline] = useState("")

  const [createJob, { isLoading }] = useCreateJobMutation()
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userInfo) {
      alert("Please log in to post a job")
      return
    }

    if (!title || !company || !location || !description || !requirements || !jobType) {
      alert("Please fill in all required fields")
      return
    }

    try {
      await createJob({
        title,
        company,
        location,
        description,
        requirements,
        salary,
        jobType,
        applicationLink,
        applicationDeadline,
      }).unwrap()

      // Reset form and close dialog
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create job posting:", error)
    }
  }

  const resetForm = () => {
    setTitle("")
    setCompany("")
    setLocation("")
    setDescription("")
    setRequirements("")
    setSalary("")
    setJobType("Full-time")
    setApplicationLink("")
    setApplicationDeadline("")
  }

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center">
            <Briefcase className="mr-2" /> Job Opportunities
          </h1>
          <p className="text-gray-600">Find and post job opportunities in the community</p>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input placeholder="Search jobs..." className="pl-8" />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Post a Job</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job Opportunity</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Job Title *
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company *
                    </label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Inc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location *
                    </label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New York, NY or Remote"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="jobType" className="text-sm font-medium">
                      Job Type *
                    </label>
                    <select
                      id="jobType"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Job Description *
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the job role, responsibilities, etc."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium">
                    Requirements *
                  </label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="List the required skills, experience, education, etc."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="salary" className="text-sm font-medium">
                    Salary (Optional)
                  </label>
                  <Input
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $60,000 - $80,000 per year"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="applicationLink" className="text-sm font-medium">
                      Application Link (Optional)
                    </label>
                    <Input
                      id="applicationLink"
                      type="url"
                      value={applicationLink}
                      onChange={(e) => setApplicationLink(e.target.value)}
                      placeholder="https://example.com/apply"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="applicationDeadline" className="text-sm font-medium">
                      Application Deadline (Optional)
                    </label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={applicationDeadline}
                      onChange={(e) => setApplicationDeadline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          All Jobs
        </Button>
        <Button variant="outline" size="sm">
          Full-time
        </Button>
        <Button variant="outline" size="sm">
          Part-time
        </Button>
        <Button variant="outline" size="sm">
          Remote
        </Button>
        <Button variant="outline" size="sm">
          Internship
        </Button>
      </div>
    </div>
  )
}

export default JobsHeader
