import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ParentRequests from "./ParentRequests";

function Topbar() {
  const [showParentRequests, setShowParentRequests] = useState(false);
  const [parentRequestCount, setParentRequestCount] = useState(0);

  useEffect(() => {
    const fetchParentRequests = async () => {
      try {
        const response = await fetch("https://hostelhub-hack-backend.vercel.app/api/parent/get-requests");
        const data = await response.json();
        if (data.success) {
          setParentRequestCount(data.notifications.parent.filter(req => req.status === 'pending').length);
        }
      } catch (error) {
        console.error("Failed to fetch parent requests");
      }
    };

    fetchParentRequests();
  }, []);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        {/* Add your existing notification items here */}
        {parentRequestCount > 0 && (
          <button
            onClick={() => setShowParentRequests(true)}
            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
          >
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {parentRequestCount}
            </span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        )}
      </div>

      {showParentRequests && (
        <ParentRequests onClose={() => setShowParentRequests(false)} />
      )}
    </div>
  );
}

export default Topbar; 