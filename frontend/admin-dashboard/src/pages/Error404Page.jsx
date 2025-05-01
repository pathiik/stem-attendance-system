import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { FiArrowLeft, FiFrown } from "react-icons/fi";
import PrimaryButton from "../components/common/buttons/PrimaryButton";

export default function Error404Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with logo */}
      <header className="bg-white shadow-sm py-4 px-6">
        <Logo
          lightMode={false}
          className="w-52 object-contain"
          fallbackText="STEM Canada Logo"
        />
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <div className="flex justify-center text-red-500 mb-6">
            <FiFrown size={64} />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Page Not Found
          </h2>

          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link to="/" className="flex justify-center items-center">
            <PrimaryButton className="flex items-center justify-center">
              <FiArrowLeft className="mr-2" />
              <span>Back to Home</span>
            </PrimaryButton>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} STEM Canada. All rights reserved.
      </footer>
    </div>
  );
}
