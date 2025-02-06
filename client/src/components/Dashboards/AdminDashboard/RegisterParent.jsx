import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "./Input";
import { Button } from "../Common/PrimaryButton";
import { Loader } from "../Common/Loader";

function RegisterParent() {
  const { id } = useParams();
  const hostel = JSON.parse(localStorage.getItem("hostel")).name;
  
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [childrenIds, setChildrenIds] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get parent request data from localStorage
  const [parentRequestData, setParentRequestData] = useState(
    JSON.parse(localStorage.getItem("newParentData"))
  );

  useEffect(() => {
    setParentRequestData(JSON.parse(localStorage.getItem("newParentData")));
  }, [localStorage.getItem("newParentData")]);

  // Populate form with data from localStorage
  useEffect(() => {
    if (!id) {
      clearForm();
      return;
    }
    if (parentRequestData) {
      setName(parentRequestData.name || "");
      setEmail(parentRequestData.email || "");
      setContact(parentRequestData.contact || "");
      setAddress(parentRequestData.address || "");
      setChildrenIds(parentRequestData.children_ids?.join(", ") || "");
      setPassword(parentRequestData.password || "");
    }
  }, [parentRequestData?.email]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setContact("");
    setAddress("");
    setChildrenIds("");
    setPassword("");
  };

  const registerParent = async (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !address || !childrenIds || !password) {
      toast.error("Please fill all the required fields");
      return;
    }

    try {
      setLoading(true);
      const children_ids = childrenIds.split(",").map(id => parseInt(id.trim()));
      
      const response = await fetch("https://hostelhub-hack-backend.vercel.app/api/parent/approve-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          contact,
          address,
          children_ids,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Parent ${data.parent.name} Registered Successfully!`);
        clearForm();
        localStorage.removeItem("parentRequestData");
      } else {
        data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        Register Parent
      </h1>

      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-lg shadow-xl mb-10">
        <form onSubmit={registerParent} className="flex flex-col gap-3">
          <div className="flex gap-5 flex-wrap justify-center">
            <Input
              field={{
                name: "name",
                placeholder: "Parent Name",
                type: "text",
                req: true,
                value: name,
                onChange: (e) => setName(e.target.value),
              }}
            />
            <Input
              field={{
                name: "email",
                placeholder: "Parent Email",
                type: "email",
                req: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
              }}
            />
          </div>

          <div className="flex gap-5 flex-wrap justify-center">
            <Input
              field={{
                name: "contact",
                placeholder: "Parent Contact",
                type: "text",
                req: true,
                value: contact,
                onChange: (e) => setContact(e.target.value),
              }}
            />
            <Input
              field={{
                name: "children_ids",
                placeholder: "Children IDs (comma-separated)",
                type: "text",
                req: true,
                value: childrenIds,
                onChange: (e) => setChildrenIds(e.target.value),
              }}
            />
          </div>

          <div className="mx-12">
            <label className="block mb-2 text-sm font-medium text-white">
              Address
            </label>
            <textarea
              name="address"
              placeholder="Parent Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border flex-grow sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="mx-12">
            <Input
              field={{
                name: "password",
                placeholder: "Password",
                type: "password",
                req: true,
                value: password,
                onChange: (e) => setPassword(e.target.value),
              }}
            />
          </div>

          <div className="mt-5">
            <Button>
              {loading ? (
                <>
                  <Loader /> Registering...
                </>
              ) : (
                <span>Register Parent</span>
              )}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
}

export default RegisterParent; 