import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [allLeaves, setAllLeaves] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Admin access required!");
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // सभी leaves fetch करें (admin only)
        // Use admin endpoint to get all leaves
        const leaveRes = await axios.get(
          "http://localhost:5000/api/leaves/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("leaveres: ", leaveRes.data);
        setAllLeaves(leaveRes.data);

        // सभी attendance fetch करें
        const attRes = await axios.get(
          "http://localhost:5000/api/attendance/all-attendance",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("attres: ", attRes.data);

        setAllAttendance(attRes.data);
      } catch (error) {
        toast.error("Data fetch failed. Admin access check करें।");
      }
    };
    fetchData();
  }, [user, navigate]);

  const formatDateTime = (date) => {
    if (!date) return "—";
    try {
      const d = new Date(date);
      if (isNaN(d)) return "—";
      return `${d.toLocaleDateString()}`;
    } catch (e) {
      return "—";
    }
  };

  const userDisplay = (u) => {
    if (!u) return "(Unknown)";
    // If populated object
    if (typeof u === "object") {
      const name = u.name || "";
      const email = u.email || "";
      if (name || email) return `${name} ${email ? `(${email})` : ""}`.trim();
    }
    // fallback to id/string
    return typeof u === "string" ? u : "(Unknown)";
  };

  const handleApproveReject = async (leaveId, status) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/leaves/approve/${leaveId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Leave ${status} successfully!`);
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-4">All Employee Leaves</h2>
        <div className="bg-white p-4 rounded shadow">
          {allLeaves.length === 0 ? (
            <p>No leaves found.</p>
          ) : (
            <ul>
              {allLeaves.map((leave, index) => (
                <li
                  key={leave._id || index}
                  className="mb-4 p-4 border rounded"
                >
                  <p>
                    <strong>Employee:</strong> {userDisplay(leave.userId)}
                  </p>
                  <p>
                    <strong>Type:</strong> {leave.type}
                  </p>
                  <p>
                    <strong>Dates:</strong> {formatDateTime(leave.startDate)} to{" "}
                    {formatDateTime(leave.endDate)} ({leave.totalDays} days)
                  </p>
                  <p>
                    <strong>Status:</strong> {leave.status}
                  </p>
                  <p>
                    <strong>Reason:</strong> {leave.reason || "N/A"}
                  </p>
                  {leave.status === "Pending" && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          handleApproveReject(leave._id, "Approved")
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReject(leave._id, "Rejected")
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl mb-4">All Employee Attendance</h2>
        <div className="bg-white p-4 rounded shadow">
          {allAttendance.length === 0 ? (
            <p>No attendance records found.</p>
          ) : (
            <ul>
              {allAttendance.map((att) => (
                <li key={att._id} className="mb-2 p-2 border rounded">
                  <p>
                    <strong>Employee:</strong> {userDisplay(att.userId)}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDateTime(att.date)}
                  </p>
                  <p>
                    <strong>Status:</strong> {att.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
