import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  listCandidates,
  updateCandidateStatus,
  getCandidateStatusHistory
} from "../services/api";
import { Candidate } from "../types";
import { CandidateStatus } from "../types/status";
import { Department } from "../types/department";

// Types
export type CandidateStatusFilter = "All" | CandidateStatus;
export type DepartmentFilter = "All" | Department;

const STATUS_OPTIONS: CandidateStatus[] = ["Submitted", "Interview", "Shortlisted", "Hired"];
const DEPARTMENT_OPTIONS: Department[] = ["IT", "Operations", "Management", "Support"];
const ITEMS_PER_PAGE = 10;

const AdminPanel: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<CandidateStatusFilter>("All");
  const [filterDepartment, setFilterDepartment] = useState<DepartmentFilter>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [newStatus, setNewStatus] = useState<CandidateStatus>("Submitted");
  const [feedback, setFeedback] = useState<string>("");
  const [statusHistory, setStatusHistory] = useState<any[]>([]); // Store status history here
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Check auth on load
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Load candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await listCandidates("1"); // "1" is hardcoded admin token
        setCandidates(data);
      } catch (err) {
        alert("Failed to load candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Load status history when modal opens
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedCandidate || !isModalOpen) return;
      setHistoryLoading(true);
      try {
        const history = await getCandidateStatusHistory(selectedCandidate.id);
        setStatusHistory(history);
      } catch (err) {
        alert("Failed to load status history.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [selectedCandidate, isModalOpen]);

  // Filter logic
  const filteredCandidates = candidates.filter((c) => {
    const matchesStatus = filterStatus === "All" || c.current_status === filterStatus;
    const matchesDepartment = filterDepartment === "All" || c.department === filterDepartment;
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Open modal for updating status
  const openStatusModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.current_status);
    setFeedback("");
    setIsModalOpen(true);
  };

  // Submit status update
  const submitStatusUpdate = async () => {
    if (!selectedCandidate) return;

    try {
      await updateCandidateStatus(selectedCandidate.id, { status: newStatus, feedback }, "1");

      setCandidates(
        candidates.map((c) =>
          c.id === selectedCandidate.id ? { ...c, current_status: newStatus } : c
        )
      );

      setIsModalOpen(false);
      setSelectedCandidate(null);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // Secure resume download with X-ADMIN header
  const handleDownloadResume = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/candidates/${id}/resume`, {
        method: "GET",
        headers: {
          "X-ADMIN": "1"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Error downloading resume. Please try again.");
      console.error(error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="text-center mt-10">Loading candidates...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md mb-6 rounded-lg px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
        >
          Logout
        </button>
      </nav>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border rounded-md"
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as CandidateStatusFilter);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          value={filterDepartment}
          onChange={(e) => {
            setFilterDepartment(e.target.value as DepartmentFilter);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="All">All Departments</option>
          {DEPARTMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterStatus("All");
            setFilterDepartment("All");
            setCurrentPage(1);
          }}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCandidates.length > 0 ? (
              paginatedCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{candidate.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{candidate.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{candidate.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{candidate.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        candidate.current_status === "Submitted"
                          ? "bg-yellow-100 text-yellow-800"
                          : candidate.current_status === "Interview"
                          ? "bg-blue-100 text-blue-800"
                          : candidate.current_status === "Shortlisted"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {candidate.current_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openStatusModal(candidate)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => handleDownloadResume(candidate.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Download Resume
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)} of{" "}
          {filteredCandidates.length} results
        </p>
        <div className="flex space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Status Update Modal */}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4">
              Update Status for {selectedCandidate.full_name}
            </h3>

            <label className="block mb-2 font-medium">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as CandidateStatus)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-medium">Feedback (Optional)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              rows={3}
              placeholder="Enter feedback here..."
            />

            {/* Status History List */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Status History</h4>
              {historyLoading ? (
                <p className="text-sm text-gray-500">Loading history...</p>
              ) : statusHistory.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {statusHistory.map((item, index) => (
                    <li key={index} className="border p-2 rounded bg-gray-50">
                      <p><strong>Status:</strong> {item.status}</p>
                      <p><strong>Feedback:</strong> {item.feedback || "No feedback"}</p>
                      <p className="text-xs text-gray-500">
                        Changed at: {new Date(item.changed_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No status history available.</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;