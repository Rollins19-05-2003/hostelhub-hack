import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Maintenance() {
  const [maintenanceType, setMaintenanceType] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestsList, setRequestsList] = useState([]);

  const maintenanceTypes = [
    "Cleaning",
    "Electrical Work",
    "WiFi Technical Support",
    "Carpentry",
    "Plumbing",
    "AC Repair",
    "Other"
  ];

  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM"
  ];

  const getRequests = async () => {
    try {
      const student = JSON.parse(localStorage.getItem("student"));
      const response = await fetch(`http://localhost:3000/api/maintenance/get/${student._id}`);
      
      const data = await response.json();
      if (data.success) {
        const sortedRequests = data.maintenanceRequests.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setRequestsList(sortedRequests);
      } else {
        toast.error(data.message || "Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      toast.error("Failed to fetch maintenance requests");
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maintenanceType || !roomNumber || !timeSlot) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const student = JSON.parse(localStorage.getItem("student"));
      
      const response = await fetch("http://localhost:3000/api/maintenance/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: maintenanceType,
          room_no: roomNumber,
          time_slot: timeSlot,
          description,
          student: student._id,
          hostel: student.hostel
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Maintenance request submitted successfully!");
        setMaintenanceType("");
        setRoomNumber("");
        setTimeSlot("");
        setDescription("");
        getRequests(); // Refresh the list after successful submission
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center xl:pt-0 md:pt-40 pt-64 justify-center overflow-auto">
      <div className="flex w-full md:w-[80vw] gap-5 flex-col md:flex-row">
        {/* Form Section */}
        <div className="md:w-2/3 w-full p-10 bg-neutral-950 rounded-xl shadow-xl mb-10">
          <h2 className="text-white font-bold text-3xl mb-6">New Maintenance Request</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-2">
                Maintenance Type
              </label>
              <select
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Type</option>
                {maintenanceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <Input
              field={{
                name: "room",
                placeholder: "Room Number",
                type: "text",
                req: true,
                value: roomNumber,
                onChange: (e) => setRoomNumber(e.target.value),
              }}
            />

            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-2">
                Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                placeholder="Describe the issue..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Requests List Section */}
        <div className="md:w-1/3 w-full p-4 bg-neutral-950 rounded-xl shadow-xl mb-10 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Requests</h2>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-700 text-white">
              {requestsList.length === 0 ? (
                <p className="text-gray-400 text-sm">No maintenance requests</p>
              ) : (
                requestsList.map((req) => (
                  <li key={req._id} className="py-3 sm:py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {req.type}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          req.status === 'pending' ? 'bg-yellow-600' :
                          req.status === 'in-progress' ? 'bg-blue-600' :
                          'bg-green-600'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Room: {req.room_no}
                      </p>
                      <p className="text-sm text-gray-400">
                        Time: {req.time_slot}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(req.date).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
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

export default Maintenance; 