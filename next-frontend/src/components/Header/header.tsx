// 
"use client"
import { useState, useRef, useEffect } from "react"
import styles from "./header.module.css"
import Image from "next/image"
import { useRouter } from "next/router"
import { useSearchUsersQuery } from "@/redux/api/userApiSlice"
import { useLogoutUserMutation } from "@/redux/api/userApiSlice"
import { logout } from "@/redux/features/auth/authSlice"
import { useDispatch } from "react-redux"

// Import images
import WebIcon from "../../../public/Header_Images/MediGeek_Logo.png"
import Search from "../../../public/Header_Images/Search_Logo.png"
import Info from "../../../public/Header_Images/Info_Icon.png"
import LogOut from "../../../public/Header_Images/LogOut_Icon_2.png"

const Header = ({ isOpen, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()
  const [logoutUser] = useLogoutUserMutation()

  const { data: searchResults, isLoading } = useSearchUsersQuery(
    { query: searchQuery, page: 1, limit: 5 },
    { skip: !searchQuery || searchQuery.length < 2 },
  )

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowResults(query.length >= 2)
  }

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`)
    setShowResults(false)
    setSearchQuery("")
  }

  const handleLogout = async () => {
    try {
      await logoutUser("").unwrap()
      dispatch(logout())
      router.push("/auth/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  return (
    <header className={styles.header}>
      <button className={`${styles.hamburgerButton} ${isOpen ? styles.open : ""}`} onClick={onToggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={styles.logo}>
        <Image
          className={`${styles.icons} ${styles.webIcon}`}
          src={WebIcon || "/placeholder.svg"}
          alt="My Image"
          width={120}
          height={40}
        />
        <p className={styles.copyright}>©</p>
      </div>
      <div className={styles.searchSpace} ref={searchRef}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
        />
        <div className={`${styles.icons} ${styles.searchIcon}`}>
          <Image src={Search || "/placeholder.svg"} alt="Search Image" width={20} height={20} />
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className={styles.searchResults}>
            {isLoading ? (
              <div className={styles.searchResultItem}>Searching...</div>
            ) : searchResults?.data?.users?.length === 0 ? (
              <div className={styles.searchResultItem}>No users found</div>
            ) : (
              searchResults?.data?.users?.map((user) => (
                <div key={user._id} className={styles.searchResultItem} onClick={() => handleUserClick(user._id)}>
                  <div className={styles.userAvatar}>
                    <img
                      src={user.avatar || "/placeholder-user.jpg"}
                      alt={user.fullName}
                      width={32}
                      height={32}
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.fullName}</div>
                    <div className={styles.userHandle}>@{user.userName}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className={styles.iconsContainer}>
        <Image
          className={`${styles.icons} ${styles.info}`}
          src={Info || "/placeholder.svg"}
          alt="Info"
          width={20}
          height={20}
        />
        <Image
          className={`${styles.icons} ${styles.logOut}`}
          src={LogOut || "/placeholder.svg"}
          alt="Log Out"
          width={20}
          height={20}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </div>
    </header>
  )
}

export default Header
