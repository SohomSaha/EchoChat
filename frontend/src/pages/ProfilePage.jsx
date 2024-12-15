import React from "react";
import { useAuthStore } from "../store/useAuthStore";

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const handleSubmit = async (e) => {
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/*avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser.profilePic}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
