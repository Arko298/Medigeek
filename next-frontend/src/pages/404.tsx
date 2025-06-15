import React from "react";
import { FaSearch } from "react-icons/fa";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative">
        <div className="search-animation">
          <FaSearch className="text-6xl text-gray-600 dark:text-gray-300" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mt-6">
        Oops! Page not found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
        We couldn't find the page you're looking for.
      </p>
      <button
        onClick={() => (window.location.href = "/home")} // Navigate home
        className="mt-6 px-4 py-2 text-white bg-red-400 rounded-md shadow hover:bg-red-300"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
