import { useState } from "react";
import { toast } from 'react-toastify';
import ParentRegister from "../../Auth/ParentRegister";
import { Loader } from "./../../Dashboards/Common/Loader";
import { Button } from "./../../Dashboards/Common/PrimaryButton";
import { Input } from "./Input";

export default function RequestRegistration() {

  const [activeTab, setActiveTab] = useState("student");

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [dept, setDept] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerStudent = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    
      let student = {
        name: name,
        student_id: studentId,
        dob: dob,
        email: email,
        contact: contact,
        father_name: fatherName,
        father_contact: fatherContact,
        address: address,
        course: course,
        dept: dept,
        batch: batch,
        password: password,
      };
      try {
  
      const res = await fetch("https://hostelhub-hack-backend.vercel.app/api/request/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student)
      });
  
      const data = await res.json();
      console.log(data?.errors);
      if (data.success) {
        toast.success(`Student ${data.request.name} Registered Successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  
        // Reset form fields
        
        setName("");
        setStudentId("");
        setBatch("");
        setDept("");
        setCourse("");
        setEmail("");
        setFatherName("");
        setFatherContact("");
        setContact("");
        setAddress("");
        setDob("");
        setPassword("");
      } else {
        data.errors.forEach((err) => {
          console.log(err.msg);
          toast.error(err.msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        });
      }
    }
     catch (err) {
      toast.error("An error occurred during registration. Please try again.", {
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
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "student"
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
          onClick={() => setActiveTab("student")}
        >
          Register as Student
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "parent"
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
          onClick={() => setActiveTab("parent")}
        >
          Register as Parent
        </button>
      </div>

      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        {activeTab === "student" ? "Student Registration" : "Parent Registration"}
      </h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-lg shadow-xl mb-10 overflow-auto">
        { activeTab === "student" && <form method="post" onSubmit={registerStudent} className="flex flex-col gap-3">
          <div className="flex gap-5 flex-wrap justify-center md:w-full sw-[100vw]">
            <Input
              field={{
                name: "name",
                placeholder: "Student Name",
                type: "text",
                req: true,
                value: name,
                onChange: (e) => setName(e.target.value),
              }}
            />
            <Input
              field={{
                name: "student_id",
                placeholder: "Student id",
                type: "number",
                req: true,
                value: studentId,
                onChange: (e) => setStudentId(e.target.value),
              }}
            />
            <Input
              field={{
                name: "dob",
                placeholder: "Student dob",
                type: "date",
                req: true,
                value: dob,
                onChange: (e) => setDob(e.target.value),
              }}
            />
           
            
          </div>
          <div className="flex gap-5 w-full flex-wrap justify-center">
            <Input
              field={{
                name: "email",
                placeholder: "Student Email",
                type: "email",
                req: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
              }}
            />
            <Input
              field={{
                name: "contact",
                placeholder: "Student Contact",
                type: "text",
                req: true,
                value: contact,
                onChange: (e) => setContact(e.target.value),
              }}
            />
            <Input
              field={{
                name: "father_name",
                placeholder: "Student's Father Name",
                type: "text",
                req: true,
                value: fatherName,
                onChange: (e) => setFatherName(e.target.value),
              }}
            />
             <Input
              field={{
                name: "father_contact",
                placeholder: "Student's Father contact",
                type: "text",
                req: true,
                value: fatherContact,
                onChange: (e) => setFatherContact(e.target.value),
              }}
            />
          </div>
          <div className="mx-12">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-white"
            >
              Address
            </label>
            <textarea
              name="address"
              placeholder="Student Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border flex-grow sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
 
          <div className="flex flex-wrap justify-center gap-5">
            <Input
              field={{
                name: "course",
                placeholder: "Student Course",
                type: "text",
                req: true,
                value: course,
                onChange: (e) => setCourse(e.target.value),
              }}
            />

<Input
              field={{
                name: "dept",
                placeholder: "Department name",
                type: "text",
                req: true,
                value: dept,
                onChange: (e) => setDept(e.target.value),
              }}
            />


            <Input
              field={{
                name: "batch",
                placeholder: "Student Batch",
                type: "number",
                req: true,
                value: batch,
                onChange: (e) => setBatch(e.target.value),
              }}
            />
          </div>
          
          <div className="mx-12">
            <Input
              field={{
                name: "password",
                placeholder: "Student Password",
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
                <span>Register Student</span>
              )}
            </Button>
          </div>
        </form> }
        {
          activeTab === "parent" && <ParentRegister/>
        }
      </div>
    </div>
  );
}

// export function RequestAcc() {
//   const register = (event) => {
//     event.preventDefault();
//     let data = {
//       cms_id: inputCms,
//     };

//     fetch("https://hostelhub-hack-backend.vercel.app/api/request/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data)
//     }).then((response) => {
//       if (response.status === 200) {
//         alert("Request sent successfully");
//       } else {
//         response.json().then((data) => {
//           alert(data.errors[0].msg);
//         }
//         );
//       }
//     }
//     );
//   };
//   const [inputCms, setInputCms] = useState('');
//   const changeCms = (event) => {
//     setInputCms(event.target.value);
//   }


//   const cms = {
//     name: "cms",
//     type: "number",
//     placeholder: "000000",
//     req: true,
//     onChange: changeCms,
//   }

//   return (
//     <div>
//       <RegisterStudent/>
//     </div>
//   );
// }

