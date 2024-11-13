import { useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Maintenance() {
  const [maintenanceType, setMaintenanceType] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

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
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center xl:pt-0 md:pt-40 pt-64 justify-center overflow-auto">
      <h1 className="text-white font-bold text-5xl">Maintenance Request</h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-xl shadow-xl mb-10">
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