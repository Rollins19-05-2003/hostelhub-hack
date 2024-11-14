import { useEffect, useState } from "react";
import { Input } from "../../LandingSite/AuthPage/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Donation() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [donationsList, setDonationsList] = useState([]);

  const categories = ["Books", "Uniforms", "Electronics", "Furniture", "Others"];
  const conditions = ["New", "Like New", "Good", "Fair"];

  const getDonations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/donation/get");
      const data = await response.json();
      console.log("donations", data)
      if (data.success) {
        setDonationsList(data.donations);
      } else {
        toast.error(data.message || "Failed to fetch donations");
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to fetch donations");
    }
  };

  useEffect(() => {
    getDonations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !category || !description || !condition) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const student = JSON.parse(localStorage.getItem("student"));
      
      const payload = {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        condition,
        student: student._id,
        hostel: student.hostel
      };

      console.log('Submitting donation:', payload); // Debug log

      const response = await fetch("http://localhost:3000/api/donation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Item listed for donation successfully!");
        setItemName("");
        setCategory("");
        setDescription("");
        setCondition("");
        getDonations();
      } else {
        toast.error(data.message || "Failed to list item");
      }
    } catch (error) {
      console.error("Error listing item:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center xl:pt-0 md:pt-40 pt-64 justify-center overflow-auto">
      <div className="flex w-full md:w-[80vw] gap-5 flex-col md:flex-row">
        {/* Form Section */}
        <div className="md:w-2/5 w-full p-10 bg-neutral-950 rounded-xl shadow-xl mb-10">
          <h2 className="text-white font-bold text-3xl mb-6">Donate Items</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              field={{
                name: "itemName",
                placeholder: "Item Name",
                type: "text",
                req: true,
                value: itemName,
                onChange: (e) => setItemName(e.target.value),
              }}
            />

            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-neutral-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                placeholder="Describe the item..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? "Listing..." : "List Item"}
            </button>
          </form>
        </div>

        {/* Donations List Section */}
        <div className="md:w-3/5 w-full p-4 bg-neutral-950 rounded-xl shadow-xl mb-10 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Available Items</h2>
          </div>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-700 text-white">
              {donationsList.length === 0 ? (
                <p className="text-gray-400 text-sm">No items available</p>
              ) : (
                donationsList.map((item) => (
                  <li key={item._id} className="py-3 sm:py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {item.itemName}
                        </p>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-600">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Condition: {item.condition}
                      </p>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Listed by: {item.student.name} ({item.student.room_no})
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
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

export default Donation; 