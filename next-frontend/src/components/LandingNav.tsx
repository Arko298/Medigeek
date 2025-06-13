import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import LandingMobileMenu from "./LandingMobileMenu";

interface LandingNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function LandingNav({isMenuOpen, setIsMenuOpen}: LandingNavProps) {
  

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, [setIsMenuOpen]);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/auth/login", label: "Log In" },
    { href: "/auth/signup", label: "Sign Up" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 mb-5 bg-white bg-opacity-80 backdrop-blur-sm shadow-md">
      <nav className="relative h-full" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/auth/login"
              className="flex-shrink-0"
              aria-label="Go to homepage"
            >
              <Image
                src="/LandingPage_Images/Logo.png"
                height={50}
                width={150}
                alt="Medigeek Logo"
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-800 hover:text-red-400 transition-colors duration-200 font-medium text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-800 hover:text-red-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-400 transition-colors duration-200"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Image
                src="/LandingPage_Images/hamburger_icon.png"
                width={24}
                height={24}
                alt="Hamburger menu"
                className="cursor-pointer"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Component */}
        <LandingMobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          navLinks={navLinks}
        />
      </nav>
    </header>
  );
}
