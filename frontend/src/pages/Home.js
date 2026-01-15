import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mini HR Tool</h1>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Employee Leave & Attendance Management System
        </h2>
        <p className="text-gray-600 max-w-2xl mb-8">
          A simple and efficient HR solution to manage employee attendance,
          leave requests, and approvals with role-based access for Employees and
          Admins.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Employee Features
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Apply for Leave</li>
              <li>Mark Daily Attendance</li>
              <li>View Leave & Attendance History</li>
              <li>Track Leave Balance</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Admin Features
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Approve / Reject Leave Requests</li>
              <li>Monitor Employee Attendance</li>
              <li>View All Employee Data</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        © {new Date().getFullYear()} Mini HR Tool | Built by Naredra Mahawar
      </footer>
    </div>
  );
};

export default Home;
