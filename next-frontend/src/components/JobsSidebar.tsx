import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const JobsSidebar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
 

  return (
    <div>
      {/* Hamburger Menu (mobile) */}
      <button
        className="block md:hidden p-2 focus:outline-none z-50 relative"
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
      >
        <Image
          src="/hamburger.svg"
          width={30}
          height={30}
          alt="menu"
          className="cursor-pointer"
        />
      </button>

      <div className="flex flex-col h-screen">
        <section
          className={`${
            isSideBarOpen ? "block" : "hidden"
          } md:block fixed md:relative bg-red-100 dark:bg-gray-800 h-screen w-64 p-4 shadow-lg z-40`}
        >
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="/home"
                className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-white hover:bg-slate-300 dark:hover:bg-blue-700 p-3 rounded-lg"
              >
                <Image
                  src="/arrow-left.png"
                  width={20}
                  height={20}
                  alt="Home"
                />
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/my-jobs"
                className="block text-lg font-semibold text-gray-700 dark:text-white hover:bg-slate-300 dark:hover:bg-blue-700 p-3 rounded-lg"
              >
                My Jobs
              </Link>
            </li>

            <li>
              <Link
                href="/preference"
                className="block text-lg font-semibold text-gray-700 dark:text-white hover:bg-slate-300 dark:hover:bg-blue-700 p-3 rounded-lg"
              >
                Preference
              </Link>
            </li>

            <li>
              <Link
                href="/skill-test"
                className="block text-lg font-semibold text-gray-700 dark:text-white hover:bg-slate-300 dark:hover:bg-blue-700 p-3 rounded-lg"
              >
                Skill Test
              </Link>
            </li>

            <li>
              <Link
                href="/settings"
                className="block text-lg font-semibold text-gray-700 dark:text-white hover:bg-slate-300 dark:hover:bg-blue-700 p-3 rounded-lg"
              >
                Settings
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default JobsSidebar;
