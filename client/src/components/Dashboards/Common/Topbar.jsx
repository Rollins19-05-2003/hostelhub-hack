import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

Topbar.propTypes = {
  name: PropTypes.string,
  notifications: PropTypes.array,
};

function Topbar({ name }) {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const [selectedTab, setSelectedTab] = useState("student");

  const fetchNotifications = async () => {
    let response;
    let parent = localStorage.getItem("parent");
    if(parent) {
      parent = JSON.parse(parent);
    }

    //if current user is admin
    if (localStorage.getItem("admin")) {
      response = await fetch(`http://localhost:3000/api/admin/get-notifications`);
      const data = await response.json();
      return data;
    } else if (parent) {
      response = await fetch(`http://localhost:3000/api/notification/get-notifications-by-student-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({studentIds: parent.children})
      });
      const data = await response.json();
      console.log(data, "data")
      return data;
    }
    
  };

  const { data: notificationsData, isLoading, refetch } = useQuery({
    queryKey: ["notifications", localStorage.getItem("parent"), localStorage.getItem("admin")],
    queryFn: () => fetchNotifications(),
  });

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newRequest', (newRequest) => {
        toast.info("New registration request received");
        // Invalidate and refetch notifications
        refetch();
      });
    }
  }, [socket]);

  let logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("hostel");
    localStorage.removeItem("student");
    localStorage.removeItem("parent");
    localStorage.removeItem("token");
    navigate("/");
  };

  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  const goToRegistration = (noti, type) => {
    if(type == "student") {
      localStorage.removeItem("newParentData");
      localStorage.setItem("newStudentData" , JSON.stringify(noti));
      navigate("/admin-dashboard/register-student/" + noti.student_id);
    }
    else {
      localStorage.removeItem("newStudentData");
      localStorage.setItem("newParentData" , JSON.stringify(noti));
      console.log(noti)
      navigate("/admin-dashboard/register-parent/" + noti._id);
    }
  }

  return (
    <div className="py-5 px-5 flex items-center justify-between text-white w-full bg-stone-950 shadow-lg absolute top-0 md:w-[calc(100%-256px)] md:ml-[256px]">
      <span className="hidden md:block">
        {date.toLocaleTimeString()}
      </span>
      <span>{name}</span>
      <div className="flex gap-3">
        <Link to="settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
        <div className="relative group cursor-pointer">
          {<span className="text-xs flex justify-center items-center absolute -right-1 -top-1 text-center rounded-full w-4 h-4 bg-white text-black group-hover:text-white group-hover:bg-blue-500">
            {localStorage.getItem("parent") ? (notificationsData?.notifications?.length) : (notificationsData?.notifications?.student?.length + notificationsData?.notifications?.parent?.length) || '0'}
          </span>}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {localStorage.getItem("admin") && notificationsData?.notifications?.student?.length + notificationsData?.notifications?.parent?.length > 0 && <div className="absolute bg-neutral-800 -bottom-15 right-2 p-5 w-96 hidden group-hover:flex flex-col rounded-xl">
            {/* tabs to switch between student and parent requests */}
            <div className="flex justify-between items-center">
              <button onClick={() => setSelectedTab("student")} className={`${selectedTab === "student" ? "bg-blue-500 text-white" : "bg-neutral-800 text-white"} px-5 py-2 rounded-xl`}>Student Requests</button>
              <button onClick={() => setSelectedTab("parent")} className={`${selectedTab === "parent" ? "bg-blue-500 text-white" : "bg-neutral-800 text-white"} px-5 py-2 rounded-xl`}>Parent Requests</button>
            </div>
            {isLoading ? <span>Loading...</span> : <ul className="[&>*:nth-child(1)]:border-t-0">
              {selectedTab === "student" ? notificationsData?.notifications?.student?.map((noti) => (
                <li
                  onClick={() => goToRegistration(noti, "student")}
                  key={noti._id}
                  className="py-5 px-5 flex justify-between items-center text-md border-t-[1px] border-neutral-500 transition-all hover:bg-neutral-900 hover:rounded-xl hover:scale-105 hover:shadow-xl hover:border-transparent"
                >
                  <p className="text-sm font-semibold truncate">
                    New account request from {noti?.name}
                  </p>
                </li>
              )) : notificationsData?.notifications?.parent?.map((noti) => (
                <li
                  onClick={() => goToRegistration(noti, "parent")}
                  key={noti._id}
                  className="py-5 px-5 flex justify-between items-center text-md border-t-[1px] border-neutral-500 transition-all hover:bg-neutral-900 hover:rounded-xl hover:scale-105 hover:shadow-xl hover:border-transparent"
                >
                  <p className="text-sm font-semibold truncate">
                    New account request from {noti?.name}
                  </p>
                </li>
              ))}
            </ul>}
          </div>}
          {localStorage.getItem("parent") && notificationsData?.notifications?.length > 0 && <div className="absolute bg-neutral-800 -bottom-15 right-2 p-5 w-96 hidden group-hover:flex flex-col rounded-xl">
            {isLoading ? <span>Loading...</span> : <ul className="[&>*:nth-child(1)]:border-t-0">
              { notificationsData?.notifications?.map((noti, index) => (
                <li
                  key={index}
                  className="py-5 px-5 flex justify-between items-center text-md border-t-[1px] border-neutral-500 transition-all hover:bg-neutral-900 hover:rounded-xl hover:scale-105 hover:shadow-xl hover:border-transparent"
                >
                  <p className="text-sm font-semibold truncate">
                    {noti?.message}
                  </p>
                </li>
              ))}
            </ul>}
          </div>}
        </div>

        <div className="relative group cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 hover:text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div className="absolute bg-neutral-800 -bottom-20 right-2 hidden group-hover:flex flex-col rounded">
            <Link to="settings" className="py-2 px-8 hover:bg-neutral-900">
              Settings
            </Link>
            <Link to="/" className="py-2 px-8 hover:bg-neutral-900">
              <span onClick={logout}>Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Topbar };
