import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form"; // Add this import for form handling

const EmployeeDashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(); // React Hook Form setup

  useEffect(() => {
    if (!user || user.role !== "employee") {
      toast.error("employee access required!");
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const [leaveRes, attRes] = await Promise.all([
          axios.get("http://localhost:5000/api/leaves/my-leaves", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/attendance/my-attendance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLeaves(leaveRes.data || []);
        setAttendance(attRes.data || []);

        const approvedLeaves = leaveRes.data.filter(
          (leave) => leave.status === "Approved"
        ).length;
        const totalQuota = 20; // Ya backend se lo
        const leaveBalance = totalQuota - approvedLeaves;
        setUser((prev) => ({ ...prev, leaveBalance })); // User state update karo
      } catch (err) {
        toast.error(err.message || "Failed to load data");
        console.log(err);
        setError("Failed to load data. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Expose fetchData for other handlers
    (async () => {
      await fetchData();
    })();
  }, []);

  const applyLeave = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const onSubmitLeave = async (data) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString().split("T")[0], // YYYY-MM-DD
      endDate: new Date(data.endDate).toISOString().split("T")[0],
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/leaves/apply",
        formattedData, // formattedData use karo
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Leave applied successfully!");
      setIsModalOpen(false);
      reset();
      setLeaves((prev) => [response.data.leave, ...prev]);
    } catch (err) {
      console.error("Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to apply for leave");
    }
  };

  const markAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/attendance/mark",
        { status: "Present" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Attendance marked successfully!");
      // refresh attendance list
      const attRes = await axios.get(
        "http://localhost:5000/api/attendance/my-attendance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendance(attRes.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to mark attendance";
      toast.error(msg);
      console.error(
        "markAttendance error:",
        err.response?.data || err.message || err
      );
    }
  };

  const hasMarkedToday = () => {
    try {
      return attendance.some((rec) => {
        const d = new Date(rec.date);
        return d.toDateString() === new Date().toDateString();
      });
    } catch (e) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600">
          Loading ...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 text-xl font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome, {user.name || "Employee"}!
              </h1>
              <p className="mt-3 text-blue-100 text-lg">
                Manage your leaves and attendance easily
              </p>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Leave Balance Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
              <p className="text-sm font-medium text-indigo-700 uppercase tracking-wide">
                Leave Balance
              </p>
              <p className="mt-2 text-4xl font-bold text-indigo-800">
                {user.leaveBalance ?? "—"}
                <span className="text-2xl">days</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={applyLeave}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                Apply for Leave
              </button>

              <button
                onClick={markAttendance}
                disabled={hasMarkedToday()}
                className={`w-full sm:w-auto px-8 py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  hasMarkedToday()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                {hasMarkedToday()
                  ? "Attendance Marked"
                  : "Mark Today's Attendance"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leave History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-indigo-600">Leave History</span>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {leaves.length} records
              </span>
            </h2>

            {leaves.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No leave requests yet.
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {leaves.map((leave, index) => (
                  <div
                    key={leave._id || index}
                    className={`p-5 rounded-xl border-l-4 ${
                      leave.status === "Approved"
                        ? "border-green-500 bg-green-50"
                        : leave.status === "Rejected"
                        ? "border-red-500 bg-red-50"
                        : "border-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {leave.type}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(leave.startDate).toLocaleDateString()} —{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-emerald-600">Attendance History</span>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {attendance.length} days
              </span>
            </h2>

            {attendance.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No attendance records yet.
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {attendance.map((record) => (
                  <div
                    key={record._id}
                    className={`p-5 rounded-xl border-l-4 ${
                      record.status === "Present"
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">
                        {new Date(record.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal for Apply Leave */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Apply for Leave
              </h2>
              <form
                onSubmit={handleSubmit(onSubmitLeave)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Leave Type
                  </label>
                  <select
                    {...register("type", {
                      required: "Leave type is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Sick">Sick</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Personal">Personal</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <textarea
                    {...register("reason", { required: "Reason is required" })}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter reason for leave"
                  ></textarea>
                  {errors.reason && (
                    <p className="text-red-500 text-sm">
                      {errors.reason.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
