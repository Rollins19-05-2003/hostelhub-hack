import { useState, useEffect } from "react";
import { Input } from "./Input";
import { Button } from "../Common/PrimaryButton";
import { Loader } from "../Common/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

function RegisterStudent() {
  const { id } = useParams();
  const registerStudent = async (e) => {
    if (name === "" || dob === "" || email === "" || contact === "" || fatherName === "" || fatherContact === "" || address === "" || batch === "" || dept === "" || course === "" || password === "") {
      toast.error("Please fill all the required fields");
      return;
    }
    e.preventDefault();
    try {
      setLoading(true);
      let student = {
        name: name,
        student_id: student_id,
        room_no: room_no,
        batch: batch,
        dept: dept,
        course: course,
        email: email,
        father_name: fatherName,
        father_contact: fatherContact,
        contact: contact,
        address: address,
        dob: dob,
        hostel: hostel,
        password: password
      };
      const res = await fetch("https://hostelhub-hack-backend.vercel.app/api/student/register-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      })
      const data = await res.json();
      if (data.success) { 
        toast.success(
          'Student ' + data.student.name + ' Registered Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
        setStudentId("");
        setName("");
        setRoomNo("");
        setBatch("");
        setDept("");
        setCourse("");
        setEmail("");
        setFatherName("");
        setContact("");
        setAddress("");
        setDob("");
        setFatherContact("");
        setPassword("");
        setLoading(false);
        await fetch("https://hostelhub-hack-backend.vercel.app/api/student/update-student/" + newStudentData._id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          }
        })
        localStorage.removeItem("newStudentData");
      } else {
        // console.log(cms);
        data.errors.forEach((err) => {
          toast.error(
            err.msg, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          })
        })
        setLoading(false);

      }
    } catch (err) {
      toast.error(
        err, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      }
      )
      setLoading(false);
    }
  };

  const hostel = JSON.parse(localStorage.getItem("hostel")).name;
  const [name, setName] = useState();
  const [student_id, setStudentId] = useState();
  const [room_no, setRoomNo] = useState();
  const [batch, setBatch] = useState();
  const [dept, setDept] = useState();
  const [course, setCourse] = useState();
  const [email, setEmail] = useState();
  const [fatherName, setFatherName] = useState();
  const [contact, setContact] = useState();
  const [address, setAddress] = useState();
  const [dob, setDob] = useState();
  const [password, setPassword] = useState();
  const [fatherContact, setFatherContact] = useState();

  const [loading, setLoading] = useState(false);
  const [newStudentData, setNewStudentData] = useState(JSON.parse(localStorage.getItem("newStudentData")));
  useEffect(() => {
    setNewStudentData(JSON.parse(localStorage.getItem("newStudentData")));
  }, [localStorage.getItem("newStudentData")]);
 
  useEffect(() => {
    if(!id) {clearForm(); return;}
    if(newStudentData?.student_id != id) {clearForm(); return;}
    if (newStudentData) {
      setName(newStudentData.name || "");
      const date = new Date(newStudentData.dob);
      setDob(date.toISOString().split('T')[0]);
      setEmail(newStudentData.email || "");
      setContact(newStudentData.contact || "");
      setFatherName(newStudentData.father_name || "");
      setFatherContact(newStudentData.father_contact || "");
      setAddress(newStudentData.address || "");
      setBatch(newStudentData.batch || "");
      setDept(newStudentData.dept || "");
      setCourse(newStudentData.course || "");
      setPassword(newStudentData.password || "");
    }
  }, [newStudentData?.student_id]);

  const clearForm = () => {
    setName("");
    setStudentId("");
    setRoomNo("");
    setBatch("");
    setDept("");
    setCourse("");
    setEmail("");
    setFatherName("");
    setFatherContact("");
    setAddress("");
    setDob("");
    setPassword("");
  }

  useEffect(() => {
    if(!id) {clearForm(); return;}
    if(newStudentData?.student_id != id) {clearForm(); return;}
    setStudentId(id);
  }, [id, newStudentData?.student_id]);

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        Register Student
      </h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-lg shadow-xl mb-10 overflow-auto">
        <form method="post" onSubmit={registerStudent} className="flex flex-col gap-3">
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
                placeholder: "Student ID",
                type: "number",
                req: true,
                value: student_id,
                onChange: (e) => setStudentId(e.target.value),
              }}
            />
            <input type="date" name="dob" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Student DOB" required />
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
                placeholder: "Father Contact",
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
          <div className="flex flex-wrap gap-5 w-full justify-center">
            <Input
              field={{
                name: "room",
                placeholder: "Student Room",
                type: "number",
                value: room_no,
                onChange: (e) => setRoomNo(e.target.value),
              }}
            />
            <Input
              field={{
                name: "hostel",
                placeholder: "Student Hostel",
                type: "text",
                req: true,
                value: hostel,
                disabled: true,
              }}
            />
            <Input
              field={{
                name: "dept",
                placeholder: "Student Department",
                type: "text",
                req: true,
                value: dept,
                onChange: (e) => setDept(e.target.value),
              }}
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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
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

export default RegisterStudent;
