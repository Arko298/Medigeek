import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
// import { useRouter } from 'next/router';
import styles from "./sidebar.module.css";

import { useRouter } from "next/router";

import { ActiveButtonContext } from "./context/activeBtnContext";

import Home from "../../../public/Sidebar_Images/Home_Logo.png";
import Chat from "../../../public/Sidebar_Images/Chat_Logo.png";
import Settings from "../../../public/Sidebar_Images/Setings_Logo.png";
import Search from "../../../public/Sidebar_Images/Search_Logo.png";
import Community from "../../../public/Sidebar_Images/Community_Logo.png";
import Internship from "../../../public/Sidebar_Images/Internship_Logo.png";
import Courses from "../../../public/Sidebar_Images/Courses_Logo.png";
import defaultProfle from "../../../public/Sidebar_Images/Profile_Default.png";
import WebIcon from "../../../public/Sidebar_Images/MediGeek_Logo.png";
import AdminPanel from "../../../public/Sidebar_Images/Admin.png";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { activeButton, setActiveButton } = useContext(ActiveButtonContext);
  interface RootState {
    auth: {
      userInfo: {
        isAdmin?: boolean;
        fullName?: string;
      };
    };
  }
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isAdmin = userInfo?.isAdmin;
  const isLoggedIn = !!userInfo;
  const router = useRouter();
  const firstName = userInfo?.fullName?.split(' ')[0] || '';


    useEffect(() => {
    const currentPath = router.pathname;
    let newActiveButtonIndex = 0; // Default to Home

    // console.log("Sidebar useEffect: Current router.pathname:", currentPath); // Debugging
    // console.log("Sidebar useEffect: Current activeButton from context:", activeButton); // Debugging

    // Map paths to indices
    if (currentPath === "/home") {
      newActiveButtonIndex = 0;
    } else if (currentPath === "/chat") {
      newActiveButtonIndex = 1;
    } else if (currentPath === "/community") {
      newActiveButtonIndex = 2;
    } else if (currentPath === "/courses") {
      newActiveButtonIndex = 3;
    } else if (currentPath === "/jobs") {
      newActiveButtonIndex = 4;
    } else if (currentPath === "/settings") {
      newActiveButtonIndex = 5;
    } else if (currentPath === "/admin") {
      newActiveButtonIndex = 6;
    } else if (currentPath === "/profile") {
      newActiveButtonIndex = 7;
    }

    // Only update if the current path's calculated index is different from the context's
    if (activeButton !== newActiveButtonIndex) {
      // console.log(`Sidebar useEffect: Updating activeButton from ${activeButton} to ${newActiveButtonIndex}`); // Debugging
      setActiveButton(newActiveButtonIndex);
    } else {
      // console.log("Sidebar useEffect: activeButton already matches current path, no update needed."); // Debugging
    }
  }, [router.pathname, setActiveButton]); // Re-run when router.pathname changes

  {
    /* Setting the initial active button based on the current route */
  }
  {
    /* Handling button clicks and updating the active button state */
  }
  const handleButtonClick = (index: number) => {
    setActiveButton(index);
    if (index === 0) {
      router.push("/home");
    } else if (index === 1) {
      router.push("/chat");
    } else if (index === 2) {
      router.push("/community");
    } else if (index === 3) {
      router.push("/courses");
    } else if (index === 4) {
      router.push("/jobs");
    } else if (index === 5) {
      router.push("/settings");
    } else if (index === 6) {
      router.push("/admin");
    } else if (index === 7) {
      router.push("/profile");
    }
  };

  {
    /* Rendering the component */
  }
  return (
    /* Container element for the page */
    // <div className={styles.page}>
    /* Sidebar container */
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      {/* Sidebar content container*/}
      <div className={styles.sidebarContent}>
        {/* Inner container for the sidebar content*/}
        <div className={styles.innerContainer}>
          {/* Hamburger button to toggle the sidebar */}
          {/* Dashboard section, with Business Icon and Search Bar*/}
          <div className={styles.dashBoard}>
          <div className={styles.webIcon}>
              <Image src={WebIcon} alt="My Image" />
            </div>
            <button className={styles.searchButton}>
              <Image
                className={styles.navIcon}
                src={Search}
                alt="My Image"
                width={20}
                height={20}
              />
              
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
            </button>
          </div> 
          {/** This was looking bad because of the 2 icons and search-bar */}
          {/* Separator element*/}
          <span className={styles.separator}></span>
          {/* Navigation buttons container */}
          <div className={styles.navigationButtons}>
            {/* Navigation buttons */}
            <button
              className={`${styles.navButton} ${activeButton === 0 ? styles.activeButton : ""}`}
              onClick={() => handleButtonClick(0)}
            >
              <Image
                className={styles.navIcon}
                src={Home}
                alt="My Image"
                width={20}
                height={20}
              />
              <h2 className={styles.navDesc}>Home</h2>
            </button>
            <button
              className={`${styles.navButton} ${activeButton === 1 ? styles.activeButton : ""}`}
              onClick={() => handleButtonClick(1)}
            >
              <Image
                className={styles.navIcon}
                src={Chat}
                alt="My Image"
                width={20}
                height={20}
              />
              <h2 className={styles.navDesc}>Message</h2>
            </button>
            <button
              className={`${styles.navButton} ${activeButton === 2 ? styles.activeButton : ""}`}
              onClick={() => handleButtonClick(2)}
            >
              <Image
                className={styles.navIcon}
                src={Community}
                alt="My Image"
                width={20}
                height={20}
              />
              <h2 className={styles.navDesc}>Community</h2>
            </button>
            <button
              className={`${styles.navButton} ${activeButton === 3 ? styles.activeButton : ""}`}
              onClick={() => handleButtonClick(3)}
            >
              <Image
                className={styles.navIcon}
                src={Courses}
                alt="My Image"
                width={20}
                height={20}
              />

              <h2 className={styles.navDesc}>Courses</h2>
            </button>
            <button
              className={`${styles.navButton} ${activeButton === 4 ? styles.activeButton : ""}`}
              onClick={() => handleButtonClick(4)}
            >
              <Image
                className={styles.navIcon}
                src={Internship}
                alt="My Image"
                width={20}
                height={20}
              />
              <h2 className={styles.navDesc}>Jobs</h2>
            </button>
            <button
              className={`${styles.navButton} ${activeButton === 5 ? styles.activeButton : ""}`}
              onClick={() => handleButtonClick(5)}
            >
              <Image
                className={styles.navIcon}
                src={Settings}
                alt="My Image"
                width={20}
                height={20}
              />
              <h2 className={styles.navDesc}>Settings</h2>
            </button>
            {isAdmin && (
              <button
                className={`${styles.navButton} ${activeButton === 6 ? styles.activeButton : ""}`}
                onClick={() => handleButtonClick(6)}
              >
                <Image
                  className={styles.navIcon}
                  src={AdminPanel}
                  alt="My Image"
                  width={20}
                  height={20}
                />
                <h2 className={styles.navDesc}>Admin Panel</h2>
              </button>
            )}
            {/*Change the buttons accordingly in future*/}
          </div>
          {/* Profile section */}
          <div
            className={`${styles.profileSection} `}
            onClick={() => handleButtonClick(7)}
          >
            <Image
              className={styles.profileIcon}
              src={defaultProfle} // Profile Image should be here (Coming from backend).
              alt="My Image"
              width={50}
              height={50}
            ></Image>
            {/* Renderig the name dynamically, appearing or disappearing based on the 'isOpen' prop*/}
            <h1 className={isOpen ? styles.appear : styles.disappear}>
              {/* Concatenating the greeting message with the first name*/}
              {("Hey there, " + firstName)
                .split("")
                .map((letter, index) => (
                  // Creating a span element for each letter with a unique key
                  <span
                    key={index}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Displaying the letter with a staggered animation effect*/}
                    {letter}
                  </span>
                ))}
            </h1>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Sidebar;
