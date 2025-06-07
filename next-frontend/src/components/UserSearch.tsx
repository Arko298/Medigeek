// This component provides a search input for users to find other users by their name or username.
// It uses the `useSearchUsersQuery` hook to fetch search results from the API.
"use client"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { useSearchUsersQuery } from "@/redux/api/userApiSlice"
import { useRouter } from "next/router"

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const { data: searchResults, isLoading } = useSearchUsersQuery(
    { query: searchQuery, page: 1, limit: 5 },
    { skip: !searchQuery || searchQuery.length < 2 },
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearching(query.length >= 2)
  }

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`)
    setSearchQuery("")
    setIsSearching(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isSearching && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">Searching...</div>
          ) : searchResults?.data?.users?.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            <div className="py-2">
              {searchResults?.data?.users?.map((user: any) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserClick(user._id)}
                >
                  <Avatar className="h-10 w-10">
                    <img
                      src={user.avatar || "/placeholder-user.jpg"}
                      alt={user.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-500">@{user.userName}</p>
                    <p className="text-xs text-gray-400">{user.collegeName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default UserSearch
