import Image from "next/image";
import React from "react";

// Handling Newsletter Submission
const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const email = form.email.value;

  // email submission logic
  console.log(`Newsletter email submitted: ${email}`);
  form.reset();
};

const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo and About */}
          <div className="max-w-xs">
            <Image
              src="/LandingPage_Images/Logo.png"
              alt="Medigeek Logo"
              width={160}
              height={54}
              className="mb-4"
              priority
            />
            <p className="text-gray-400">
              Medigeek is your go-to platform for connecting with peers...
            </p>
          </div>

          {/* Newsletter with improved contrast */}
          <div className="max-w-xs">
            <h3 className="font-semibold text-white text-lg mb-3">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest updates...
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                name="email"
                aria-label="Email address for newsletter"
                placeholder="Your email"
                required
                className="bg-gray-700 text-white rounded-l-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 rounded-r-md transition-colors duration-200"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
