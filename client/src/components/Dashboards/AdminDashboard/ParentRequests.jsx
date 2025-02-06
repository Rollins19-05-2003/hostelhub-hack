import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function ParentRequests({ onClose }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("https://hostelhub-hack-backend.vercel.app/api/parent/get-requests");
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests.filter(req => req.status === 'pending'));
      }
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch("https://hostelhub-hack-backend.vercel.app/api/parent/approve-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Parent request approved successfully!");
        setRequests(requests.filter(req => req._id !== requestId));
      } else {
        toast.error(data.errors[0].msg);
      }
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Parent Requests</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="text-gray-400">No pending requests</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="bg-neutral-800 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{request.name}</h3>
                    <p className="text-gray-400 text-sm">{request.email}</p>
                    <p className="text-gray-400 text-sm">Contact: {request.contact}</p>
                    <p className="text-gray-400 text-sm">Children IDs: {request.children_ids.join(", ")}</p>
                  </div>
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentRequests; 