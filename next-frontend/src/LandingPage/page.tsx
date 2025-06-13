
"use client";

import { useState, useMemo,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Typewriter } from "react-simple-typewriter";
import LandingNav from "@/components/LandingNav";
import LandingFooter from "@/components/LandingFooter";
import LandingMobileMenu from "@/components/LandingMobileMenu";
// import CustomChatbot from "@/components/Chatbot";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/auth/login", label: "Log in" },
  { href: "/auth/signup", label: "Sign up" },
];

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [isMenuOpen]);

  // Memoize Typewriter to prevent unnecessary re-renders
  const typewriterWords = useMemo(
    () => [
      "Posting",
      "Exploring",
      "Connecting Friends",
      "Sharing Experiences",
      "Job Opportunities",
      "And Much More...",
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Medigeek - Connect, Explore, Succeed</title>
        <meta
          name="description"
          content="Medigeek is a social media platform for undergraduates to connect, explore communities, and find job opportunities."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="social media, undergraduates, jobs, communities, Medigeek" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center relative pt-16">
        {/* Navbar */}
        <LandingNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>

        {/* Mobile Menu */}
        <LandingMobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          navLinks={navLinks}
        />

        {/* Header Section */}
        <section
          id="home"
          className="relative flex w-full h-[calc(100vh-4rem)] flex-col md:h-screen  md:flex-row max-w-[1400px]"
          aria-label="Hero section"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/LandingPage_Images/BackgroundImage.jpeg"
              alt="Medigeek background"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Content Section */}
          <div className="relative z-10 w-full md:w-2/5 flex flex-col justify-center items-end gap-6 p-6 sm:p-8 md:p-12 text-right">
            {/* Subtitle */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-red-800">
              START CONNECTING TODAY!
            </h1>

            {/* Description */}
            <p className="text-white text-sm sm:text-base md:text-lg max-w-md">
              Medigeek is a social media platform that provides assistance and various job opportunities.
            </p>

            {/* Offers Heading */}
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl">
              We Offer
            </h2>

            {/* Typewriter Text */}
            <span className="text-white text-xl sm:text-2xl md:text-3xl">
              <Typewriter
                words={typewriterWords}
                loop
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={2000}
                cursor
                cursorStyle="|"
                cursorBlinking
              />
            </span>

            {/* Call-to-Action Section */}
            <div className="flex flex-col items-end gap-4 mt-6 w-full">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl">
                New to Medigeek?
              </h3>
              <Link href="/auth/signup" className="inline-block">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                  aria-label="Sign up for Medigeek"
                >
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Medigeek Section */}
        <section className="py-16 sm:py-20 bg-gray-50 w-full" aria-label="Features section">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12">
              Why Medigeek?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {/* Explore Communities Card */}
              <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src="/LandingPage_Images/community_icon.png"
                    alt="Community icon"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 80px, 100px"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mt-4">
                  Explore Communities
                </h3>
                <p className="text-gray-600 mt-4 text-sm sm:text-base">
                  Join groups and clubs based on your interests and meet like-minded peers.
                </p>
              </div>

              {/* Job Opportunities Card */}
              <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src="/LandingPage_Images/job_icon.png"
                    alt="Job opportunities icon"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 80px, 100px"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mt-4">
                  Job Opportunities
                </h3>
                <p className="text-gray-600 mt-4 text-sm sm:text-base">
                  Find internships and jobs curated specifically for undergraduates.
                </p>
              </div>

              {/* Assessments Card */}
              <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src="/LandingPage_Images/assessment_icon.png"
                    alt="Assessments icon"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 80px, 100px"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mt-4">
                  Assessments
                </h3>
                <p className="text-gray-600 mt-4 text-sm sm:text-base">
                  Take assessments to evaluate your skills and improve your qualifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chatbot */}
        {/* <CustomChatbot /> */}

        {/* Footer */}
        <LandingFooter />
      </main>
    </>
  );
};

export default LandingPage;
