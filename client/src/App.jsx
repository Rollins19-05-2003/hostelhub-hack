import "./App.css";
import { Route, Routes } from "react-router-dom";
import About from "./components/LandingSite/About/index";
import Contact from "./components/LandingSite/Contact/index";
import LandingSite from "./components/LandingSite/Index";
import LandingPage from "./components/LandingSite/LandingPage/index";
import Auth from "./components/LandingSite/AuthPage/Index";
import SignIn from "./components/LandingSite/AuthPage/SignIn";
import RequestRegistration from "./components/LandingSite/AuthPage/Request";
import AdminSignIn from "./components/LandingSite/AuthPage/AdminSignIn";
import Index from "./components/Dashboards/StudentDashboard/Index";
import Home from "./components/Dashboards/StudentDashboard/Home";
import Mess from "./components/Dashboards/StudentDashboard/Mess";
import Attendance from "./components/Dashboards/StudentDashboard/Attendance";
import Invoices from "./components/Dashboards/StudentDashboard/Invoices";
import Suggestions from "./components/Dashboards/StudentDashboard/Suggestions";
import Complaints from "./components/Dashboards/StudentDashboard/Complaints";
import Settings from "./components/Dashboards/StudentDashboard/Settings";
import AdminIndex from "./components/Dashboards/AdminDashboard/Index";
import AdminHome from "./components/Dashboards/AdminDashboard/Home/Home";
import RegisterStudent from "./components/Dashboards/AdminDashboard/RegisterStudent";
import AdminAttendance from "./components/Dashboards/AdminDashboard/Attendance";
import AdminComplaints from "./components/Dashboards/AdminDashboard/Complaints";
import AdminInvoices from './components/Dashboards/AdminDashboard/Invoices';
import AdminSuggestions from './components/Dashboards/AdminDashboard/Suggestions';
import AdminSettings from './components/Dashboards/AdminDashboard/Settings';
import AllStudents from "./components/Dashboards/AdminDashboard/AllStudents";
import AdminMess from "./components/Dashboards/AdminDashboard/MessOff";
import RoommatePreference from "./components/Dashboards/StudentDashboard/RoommatePreference";
import RegisterParent from "./components/Dashboards/AdminDashboard/RegisterParent";
import ParentSignin from "./components/LandingSite/AuthPage/ParentSignin";
import ParentIndex from "./components/Dashboards/ParentDashboard/ParentIndex";
import ParentHome from "./components/Dashboards/ParentDashboard/ParentHome";
// import WardAttendance from "./components/Dashboards/ParentDashboard/WardAttendance";
// import WardInvoices from "./components/Dashboards/ParentDashboard/WardInvoices";
import { ChildrenProvider } from './components/Dashboards/ParentDashboard/ChildrenContext';
import WardInvoices from "./components/Dashboards/ParentDashboard/WardInvoices";
import LeaveRequest from "./../src/components/Dashboards/StudentDashboard/Leave";
import AdminLeaveRequests from "./../src/components/Dashboards/AdminDashboard/LeaveOff";
import Maintenance from "./components/Dashboards/StudentDashboard/Maintenance";
import MaintenanceReq from "./components/Dashboards/AdminDashboard/MaintenanceReq";
import Donation from "./components/Dashboards/StudentDashboard/Donation";
function App() {
  return (
    <>
      <Routes>
        {/* Landing Site Routes */}
        <Route path="/" element={<LandingSite />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="auth" element={<Auth />}>
            <Route index element={<SignIn />} />
            <Route path="login" element={<SignIn />} />
            <Route path="request" element={<RequestRegistration />} />
            <Route path="admin-login" element={<AdminSignIn />} />
            <Route path="parent-login" element={<ParentSignin />} />
          </Route>
        </Route>

        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="mess" element={<Mess />  } />
          <Route path="attendance" element={<Attendance/>} />
          <Route path="complaints" element={<Complaints/>} />
          <Route path="suggestions" element={<Suggestions/>} />
          <Route path="invoices" element={<Invoices/>} />
          <Route path="roommate" element={<RoommatePreference/>} />
          <Route path="settings" element={<Settings/>} />
          <Route path="leavereq" element={<LeaveRequest />} />
          <Route path="maintenance" element={<Maintenance/>} />
          <Route path="donate" element={<Donation />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminIndex />}>
          <Route index element={<AdminHome />} />
          <Route path='register-student/:id' element={<RegisterStudent />} />
          <Route path='register-student' element={<RegisterStudent />} />
          <Route path='register-parent/:id' element={<RegisterParent />} />
          <Route path='register-parent' element={<RegisterParent />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="suggestions" element={<AdminSuggestions />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="all-students" element={<AllStudents />} />
          <Route path="mess-off" element={<AdminMess />} />
          <Route path="maintenance" element = {<MaintenanceReq />} />
          {/* New Leave Management Routes for Admin */}
          <Route path="leave-requests" element={<AdminLeaveRequests />} />
          {/* <Route path="leave/history" element={<AdminLeaveHistory />} /> */}
        </Route>
        <Route path="/parent-dashboard" element={
          <ChildrenProvider>
            <ParentIndex />
          </ChildrenProvider>
        }>
          <Route index element={<ParentHome />} />
          <Route path="ward-invoices" element={<WardInvoices />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
