"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { ActiveButtonProvider } from "@/components/Sidebar/context/activeBtnContext"
import Sidebar from "@/components/Sidebar/admin_sidebar"
import Header from "@/components/Header/header"
import { useRouter } from "next/router"
import NotificationDropdown from "@/components/NotificationDropdown"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { userInfo } = useSelector((state: RootState) => state.auth)

  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    
    
    <ActiveButtonProvider>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar  isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Header isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
           {userInfo && (
              <div className="absolute top-2 right-20 z-20">
                <NotificationDropdown />
              </div>
            )}
          <main className="flex-1 p-4 mt-12">{children}</main>
        </div>
      </div>
    </ActiveButtonProvider>
    
  )
}

export default RootLayout
