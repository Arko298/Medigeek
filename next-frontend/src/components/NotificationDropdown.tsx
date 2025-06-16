// Description: A dropdown component for displaying user notifications with options to mark as read, delete, and handle friend requests.
"use client"
import { useState } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} from "@/redux/api/notificationApiSlice"

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: notificationsData, isLoading } = useGetNotificationsQuery({ page: 1, limit: 10 })
  const [markAsRead] = useMarkAsReadMutation()
  const [markAllAsRead] = useMarkAllAsReadMutation()
  const [deleteNotification] = useDeleteNotificationMutation()
  
  const notifications = notificationsData?.data?.notifications || []
  const unreadCount = notificationsData?.data?.unreadCount || 0

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead("").unwrap()
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId).unwrap()
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

 

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification: any) => (
              <div
                key={notification._id}
                className={`p-4 border-b hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <img
                      src={notification.sender.avatar || "/placeholder-user.jpg"}
                      alt={notification.sender.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{notification.sender.fullName}</span> {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                      </div>

                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.isRead && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification._id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(notification._id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {notification.type === "friend_request" && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                         
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
