import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCandidate } from "../services/api";

// Define allowed department type
type Department = "IT" | "Operations" | "Management" | "Support";

const CandidateForm: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [experience, setExperience] = useState<number>(0);
  const [department, setDepartment] = useState<Department>("IT");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("+962");
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Validate age >= 18
  const isAdult = (dateString: string): boolean => {
    const dob = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Always keep prefix
    if (!value.startsWith("+962")) {
      value = "+962" + value.replace(/[^0-9]/g, "").slice(0, 9); // Only take first 9 digits
    }

    // Limit total length to 12 (i.e., +962 + 9 digits)
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate DOB
    if (!isAdult(dob)) {
      setError("You must be at least 18 years old.");
      return;
    }

    // Validate resume size (max 5MB)
    if (resume && resume.size > 5 * 1024 * 1024) {
      setError("Resume must be less than 5MB.");
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+962\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone must start with +962 and have 9 additional digits.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("date_of_birth", dob);
    formData.append("years_of_experience", experience.toString());
    formData.append("department", department);
    formData.append("email", email);
    formData.append("phone", phone);
    if (resume) formData.append("resume", resume);

    try {
      const response = await registerCandidate(formData);
      navigate(`/status/${response.id}`);
    } catch (err) {
      alert("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Candidate Registration</h2>

        {/* Error Message */}
        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              min="0"
              placeholder="Years of Experience"
              value={experience || ""}
              onChange={(e) => setExperience(parseInt(e.target.value))}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="IT">IT</option>
              <option value="Operations">Operations</option>
              <option value="Management">Management</option>
              <option value="Support">Support</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone (+962)</label>
            <input
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+962XXXXXXXXx"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              Must start with +962 and contain 9 digits
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              required
              className="w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              Max. 5MB (PDF only)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;