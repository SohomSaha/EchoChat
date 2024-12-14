import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
function Navbar() {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base300 fixed w-full top=0 z-40 backdrop-blur-lg bg-base-100/80 ">
      <div className="container mx-auto px-4 h-16 pt-3">
        <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center hover:cursor-pointer">
              <MessageSquare className="size-5 text-primary hover:size-6" />
            </div>
            <h1 className="text-lg font bold">Echo Chat</h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
            <Link
            to="/settings"
            className="btn btn-sm gap-2 transition-colors"
            >
                <Settings className="size-4" />
                <span className="hidden sm:inline">Settings</span>
            </Link>
            {authUser && (
                <>
                <Link
                to="/profile"
                className="btn btn-sm gap-2"
                >
                <User className="size-5" />  
                <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                onClick={logout}
                className="flex items-center gap-2"
                >
                    <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
                </button>
                </>
                )}
            </div>  
        </div>
      </div>
    </header>
  );
}

export default Navbar;
