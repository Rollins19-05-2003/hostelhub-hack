import { useState } from "react";
import { Input } from "./../AuthPage/Input";
import { Button } from "./../../Dashboards/Common/PrimaryButton";
import { Loader } from "./../../Dashboards/Common/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RoomPreferenceForm() {
  const [studentId, setStudentId] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [nonVeg, setNonVeg] = useState(false);
  const [branch, setBranch] = useState("");
  const [state, setState] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitPreference = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const roomPref = { studentId, roomType, nonVeg, state, hobbies, branch };
      const res = await fetch("http://localhost:3000/student/createRoomPref", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomPref),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Room preference submitted successfully!", { theme: "dark" });
        setStudentId("");
        setRoomType("Single");
        setNonVeg(false);
        setHobbies([]);
        setBranch("");
        setState("");
      } else {
        toast.error(data.message || "Failed to submit room preference", { theme: "dark" });
      }
    } catch (error) {
      toast.error("Error submitting room preference", { theme: "dark" });
      console.log(error)
      res.send(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        Room Preference Form
      </h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-xl shadow-xl mb-10 overflow-auto">
        <form
          method="post"
          onSubmit={submitPreference}
          className="flex flex-col gap-3"
        >
          <Input
            field={{
              name: "studentId",
              placeholder: "Student ID",
              type: "number",
              req: true,
              value: studentId,
              onChange: (e) => setStudentId(e.target.value),
            }}
          />
          <div className="flex gap-5 flex-wrap">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-white text-sm font-semibold mb-2">
                Room Type
              </label>
              <select
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
              </select>
            </div>
            <div className="flex items-center gap-3 w-full md:w-1/2">
              <label className="text-white text-sm font-semibold">
                Non-Vegetarian
              </label>
              <input
                type="checkbox"
                checked={nonVeg}
                onChange={(e) => setNonVeg(e.target.checked)}
                className="w-6 h-6 accent-blue-500"
              />
            </div>
          </div>
          <Input
            field={{
              name: "branch",
              placeholder: "Branch",
              type: "text",
              req: true,
              value: branch,
              onChange: (e) => setBranch(e.target.value),
            }}
          />

          <Input
            field={{
              name: "state",
              placeholder: "State",
              type: "text",
              req: true,
              value: state,
              onChange: (e) => setState(e.target.value),
            }}
          />
         
         <div className="flex flex-col w-full md:w-1/2">
  <label className="text-white text-sm font-semibold mb-2">Hobbies</label>
  <div className="bg-neutral-800 p-3 rounded-lg text-white space-y-2">
    {[
      "Reading",
      "Writing",
      "Sports",
      "Music",
      "Dance",
      "Art",
      "Crafts",
      "Cooking",
      "Gardening",
      "Painting",
      "Drawing",
      "Singing",
      "Dancing",
      "Acting",
    ].map((hobby) => (
      <div key={hobby} className="flex items-center">
        <input
          type="checkbox"
          value={hobby}
          checked={hobbies.includes(hobby)}
          onChange={(e) => {
            if (e.target.checked) {
              // Add hobby to the array
              setHobbies((prevHobbies) => [...prevHobbies, hobby]);
            } else {
              // Remove hobby from the array
              setHobbies((prevHobbies) =>
                prevHobbies.filter((item) => item !== hobby)
              );
            }
          }}
          className="w-5 h-5 accent-blue-500 mr-2"
        />
        <label className="text-white">{hobby}</label>
      </div>
    ))}
  </div>
</div>

          <div className="mt-5">
            <Button>
              {loading ? (
                <>
                  <Loader /> Submitting...
                </>
              ) : (
                <span>Submit Preferences</span>
              )}
            </Button>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomPreferenceForm;