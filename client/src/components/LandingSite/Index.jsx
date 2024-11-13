import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import RoomPreferenceForm from "./LandingPage/RoomPreferenceForm"
export default function Index() {
  return (
    <>
      <Navbar />
      <Outlet />
      <RoomPreferenceForm/>
    </>
  )
}
