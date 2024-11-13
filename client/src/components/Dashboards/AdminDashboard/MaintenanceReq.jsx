import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from 'react-top-loading-bar';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function MaintenanceReq() {
  const [progress, setProgress] = useState(0);
  const [requests, setRequests] = useState([]);
  const [pendingReqs, setPendingReqs] = useState(0);
  const [inProgressReqs, setInProgressReqs] = useState(0);
  const [completedReqs, setCompletedReqs] = useState(0);
  const graphData = useRef([0, 0, 0]);

  const getRequests = async () => {
    setProgress(30);
    try {
      const response = await fetch("http://localhost:3000/api/maintenance/get");
      setProgress(50);
      const data = await response.json();
      
      if (data.success) {
        const formattedRequests = data.maintenanceRequests.map(req => ({
          id: req._id,
          type: req.type,
          room: req.room_no,
          timeSlot: req.time_slot,
          status: req.status,
          date: new Date(req.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          description: req.description,
          student: req.student
        }));

        setRequests(formattedRequests);
        setPendingReqs(formattedRequests.filter(req => req.status === 'pending').length);
        setInProgressReqs(formattedRequests.filter(req => req.status === 'in-progress').length);
        setCompletedReqs(formattedRequests.filter(req => req.status === 'completed').length);
        
        graphData.current = [pendingReqs, inProgressReqs, completedReqs];
      }
    } catch (error) {
      toast.error("Failed to fetch maintenance requests");
    }
    setProgress(100);
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch("http://localhost:3000/api/maintenance/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Request status updated to ${status}`);
        getRequests(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to update request status");
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const graph = (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={[
          {
            name: "Maintenance Requests",
            Pending: pendingReqs,
            "In Progress": inProgressReqs,
            Completed: completedReqs,
          },
        ]}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="Pending"
          stackId="1"
          stroke="#EAB308"
          fill="#EAB308"
        />
        <Area
          type="monotone"
          dataKey="In Progress"
          stackId="1"
          stroke="#3B82F6"
          fill="#3B82F6"
        />
        <Area
          type="monotone"
          dataKey="Completed"
          stackId="1"
          stroke="#22C55E"
          fill="#22C55E"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center xl:pt-0 md:pt-40 pt-64 justify-center overflow-auto">
      <LoadingBar color="#0000FF" progress={progress} onLoaderFinished={() => setProgress(0)} />
      <h1 className="text-white font-bold text-5xl">Maintenance Requests</h1>
      <div className="flex gap-5 text-white text-xl">
        <p>Pending: {pendingReqs}</p>
        <p>In Progress: {inProgressReqs}</p>
        <p>Completed: {completedReqs}</p>
      </div>
      
      <div className="w-full px-5 md:w-[80vw]">{graph}</div>

      <div className="w-full md:w-[80vw] p-5 bg-neutral-950 rounded-xl shadow-xl mb-10">
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-700">
            {requests.map((request) => (
              <li key={request.id} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {request.type} - Room {request.room}
                    </p>
                    <p className="text-sm truncate text-gray-400">
                      Time Slot: {request.timeSlot}
                    </p>
                    <p className="text-sm truncate text-gray-400">
                      {request.description}
                    </p>
                    <p className="text-sm truncate text-gray-400">
                      Requested on: {request.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(request.id, 'in-progress')}
                          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => updateStatus(request.id, 'completed')}
                          className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {request.status === 'in-progress' && (
                      <button
                        onClick={() => updateStatus(request.id, 'completed')}
                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    <span className={`px-3 py-1 text-sm rounded ${
                      request.status === 'pending' ? 'bg-yellow-600' :
                      request.status === 'in-progress' ? 'bg-blue-600' :
                      'bg-green-600'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default MaintenanceReq;
