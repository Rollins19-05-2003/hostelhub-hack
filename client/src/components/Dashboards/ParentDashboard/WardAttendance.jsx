import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useChildren } from './ChildrenContext';

function AttendanceChart({ studentId, studentName }) {
  const [daysOff, setDaysOff] = useState(0);
  const [daysPresent, setDaysPresent] = useState(0);
  const [daysUnmarked, setDaysUnmarked] = useState(0);

  useEffect(() => {
    fetch("https://hostelhub-hack-backend.vercel.app/api/attendance/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ student: studentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          let absent = 0, present = 0, unmarked = 0;
          
          data.attendance.forEach((day) => {
            switch(day.status.toLowerCase()) {
              case "absent": absent++; break;
              case "present": present++; break;
              case "unmarked": unmarked++; break;
            }
          });
          
          setDaysOff(absent);
          setDaysPresent(present);
          setDaysUnmarked(unmarked);
        }
      });
  }, [studentId]);

  return (
    <div className="flex flex-col items-center bg-neutral-950 rounded-xl shadow-xl p-5">
      <span className="text-white text-xl">{studentName}'s Attendance</span>
      {/* Rest of your existing attendance chart code */}
    </div>
  );
}

function WardAttendance() {
  const { childrenList } = useChildren();

  return (
    <div className="w-full h-screen flex items-center justify-center flex-wrap gap-5 p-5">
      {childrenList.map((child) => (
        <AttendanceChart 
          key={child._id} 
          studentId={child._id} 
          studentName={child.name} 
        />
      ))}
    </div>
  );
}

export { WardAttendance }
export default WardAttendance;
