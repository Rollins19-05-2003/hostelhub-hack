import { TeamCard } from "./TeamMember";
function About() {

  const sourav = {
    name: "Sourav Deb",
    designation: "Front-end Engineer",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const varun = {
    name: "Varun Badoni",
    designation: "Backend-end Engineer",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const khusboo = {
    name: "Khusboo Kumari",
    designation: "Python Developer",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };
  const rajaram = {
    name: "Rajaram Singh",
    designation: "DB Developer",
    image:
      "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png",
  };

  return (
    <>
      <h1 className="font-bold text-white text-center text-5xl">
        Meet Our Team!
      </h1>
      <div className="py-20 sm:py-25 flex gap-10 flex-wrap justify-center align-center">
        <TeamCard member={sourav} profile="https://www.linkedin.com/in/sourav-deb-797b5924b/" />
        <TeamCard member={varun} profile="https://www.linkedin.com/in/varun-badoni/" />
        <TeamCard member={khusboo} profile="https://www.linkedin.com/in/khusboo-kumari-9b3550228/" />
        <TeamCard member={rajaram} profile="https://www.linkedin.com/in/rajaram-singh-4b620029a/" />
      </div>
    </>
  );
}
export { About };
