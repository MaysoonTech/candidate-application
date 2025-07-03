import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidateStatus } from "../services/api";
import { StatusHistory } from "../types";

interface StatusItemProps {
  status: StatusHistory;
}

const StatusItem: React.FC<StatusItemProps> = ({ status }) => (
  <div className="bg-white p-4 rounded shadow mb-2">
    <p><strong>Status:</strong> {status.status}</p>
    <p><strong>Feedback:</strong> {status.feedback || "No feedback"}</p>
    <p className="text-sm text-gray-500">
      Changed at: {new Date(status.changed_at).toLocaleString()}
    </p>
  </div>
);

const StatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [statuses, setStatuses] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getCandidateStatus(parseInt(id!));
        setStatuses(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load status history.");
        setLoading(false);
      }
    };
    fetchStatus();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Application Status - ID: {id}</h2>
        {statuses.length === 0 ? (
          <p>No status updates found.</p>
        ) : (
          statuses.map((status) => <StatusItem key={status.id} status={status} />)
        )}
      </div>
    </div>
  );
};

export default StatusPage;