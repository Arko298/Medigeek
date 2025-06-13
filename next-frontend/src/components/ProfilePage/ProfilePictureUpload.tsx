"use client"
import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Camera, Trash2, Loader2 } from "lucide-react"
import { useUpdateProfilePictureMutation, useDeleteProfilePictureMutation } from "@/redux/api/userApiSlice"
import { toast } from "react-toastify"

interface ProfilePictureUploadProps {
  currentAvatar?: string
  userId: string
  onPictureUpdate: (newUrl: string) => void
}

const ProfilePictureUpload = ({ currentAvatar, userId, onPictureUpdate }: ProfilePictureUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateProfilePicture, { isLoading: isUploading }] = useUpdateProfilePictureMutation()
  const [deleteProfilePicture, { isLoading: isDeleting }] = useDeleteProfilePictureMutation()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(
       
         "Please select an image file",
       
      )
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB",
        
      )
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await updateProfilePicture(formData).unwrap()
      if (response?.data?.profilePicture) {
        onPictureUpdate(response.data.profilePicture)
        toast.success(
         
          "Profile picture updated successfully",
        )
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("There was a problem uploading your profile picture")
      // Reset preview on error
      setPreviewUrl(null)
    }
  }

  const handleDeletePicture = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return

    try {
      await deleteProfilePicture("").unwrap()
      onPictureUpdate("")
      setPreviewUrl(null)
      toast.success( "Profile picture removed successfully",
      )
    } catch (error) {
      console.error("Delete error:", error)
      toast(
         "There was a problem removing your profile picture",
      )
    }
  }

  const displayedAvatar = previewUrl || currentAvatar || "/placeholder-user.jpg"
  const isLoading = isUploading || isDeleting

  return (
    <div className="relative">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar className="h-32 w-32 border-4 border-background">
          <img
            src={displayedAvatar || "/placeholder.svg"}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover"
          />
        </Avatar>

        {isHovering && !isLoading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-5 w-5" />
              </Button>

              {(currentAvatar || previewUrl) && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleDeletePicture}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
    </div>
  )
}

export default ProfilePictureUpload
// This component allows users to upload and manage their profile picture.
// It includes file validation, preview functionality, and handles both upload and deletion of the profile picture.