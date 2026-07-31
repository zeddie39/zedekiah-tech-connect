import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white px-4 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Sad Cartoon GIF Illustration */}
        <div className="w-full max-w-xs md:max-w-md flex justify-center">
          <img
            src="https://media.giphy.com/media/NTY1kHmcLsCsg/giphy.gif"
            alt="Sad cartoon for 404"
            className="rounded-xl shadow-lg w-64 h-64 object-contain bg-white dark:bg-slate-900"
          />
        </div>
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-4">404</h1>
          <p className="text-2xl text-gray-600 dark:text-slate-300 mb-2 font-semibold">
            Oops! Page not found
          </p>
          <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-md">
            Looks like you snipped the wrong wire! The page you’re looking for
            doesn’t exist or has been moved.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-accent hover:bg-accent/90 text-slate-950 rounded-lg shadow font-bold transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
