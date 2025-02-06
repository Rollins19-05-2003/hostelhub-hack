import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../LandingSite/AuthPage/Input";

function ParentRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [childrenIds, setChildrenIds] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !address || !childrenIds || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const children_ids = childrenIds.split(",").map(id => parseInt(id.trim()));
      
      // const response = await fetch("https://hostelhub-hack-backend.vercel.app/api/parent/register-request", {
      const response = await fetch("https://hostelhub-hack-backend.vercel.app/api/parent/register-request", {
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
        toast.success("Registration request submitted successfully!");
        setName("");
        setEmail("");
        setContact("");
        setAddress("");
        setChildrenIds("");
        setPassword("");
      } else {
        data.errors.forEach((error) => {
          toast.error(error.msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        });
      }
    } catch (error) {
      toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setLoading(false);
    }
  };
 
    return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-stone-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Register as Parent
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              placeholder: "Email",
              type: "email",
              req: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }}
          />

          <Input
            field={{
              name: "contact",
              placeholder: "Contact",
              type: "text",
              req: true,
              value: contact,
              onChange: (e) => setContact(e.target.value),
            }}
          />

          <Input
            field={{
              name: "address",
              placeholder: "Address",
              type: "text",
              req: true,
              value: address,
              onChange: (e) => setAddress(e.target.value),
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

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ParentRegister; 