import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import RoomPreferenceForm from "../../LandingSite/LandingPage/RoomPreferenceForm";

function RoommatePreference() {
  const [hasPreference, setHasPreference] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const checkExistingPreference = async () => {
    const studentId = JSON.parse(localStorage.getItem("student")).student_id;
    try {
      const res = await fetch(`http://localhost:3000/student/getPrefferedRoommate/${studentId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHasPreference(true);
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setHasPreference(false);
      toast.error("Failed to fetch roommate preferences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkExistingPreference();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!hasPreference) {
    return <RoomPreferenceForm onSubmitSuccess={() => setHasPreference(true)} />;
  }

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        Recommended Roommates
      </h1>
      <div className="md:w-[80vw] w-full p-10 bg-neutral-950 rounded-xl shadow-xl mb-10 overflow-y-auto">
        {recommendations.length === 0 ? (
          <div className="text-white text-center">
            No matching roommates found at the moment.
          </div>
        ) : (
          recommendations.map((match) => (
            <div key={match.studentId} 
                 className="mb-6 p-6 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors">
              <div className="text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {match.studentDetails?.name || 'Name Not Available'}
                    </h3>
                    <p className="text-gray-400">Student ID: {match.studentId}</p>
                  </div>
                  <div className="bg-blue-500 px-4 py-2 rounded-full">
                    Match Score: {match.score}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-blue-400">Personal Details</h4>
                    <p>Room: {match.studentDetails?.room_no || 'Not Assigned'}</p>
                    <p>Batch: {match.studentDetails?.batch}</p>
                    <p>Department: {match.studentDetails?.dept}</p>
                    <p>Course: {match.studentDetails?.course}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-blue-400">Preferences</h4>
                    <p>Branch: {match.preferences.branch}</p>
                    <p>State: {match.preferences.state}</p>
                    <p>Food Preference: {match.preferences.nonVeg ? 'Non-Vegetarian' : 'Vegetarian'}</p>
                    <div>
                      <p className="font-medium">Hobbies:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {match.preferences.hobbies.map((hobby, index) => (
                          <span 
                            key={index}
                            className="bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full text-sm"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional: Add contact information if available */}
                {match.studentDetails?.email && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">Contact Information</h4>
                    <p>Email: {match.studentDetails.email}</p>
                    <p>Contact: {match.studentDetails.contact}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setHasPreference(false)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoommatePreference; 