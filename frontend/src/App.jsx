import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  //console.log({onlineUsers});
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });
  if (isCheckingAuth && !authUser)
    return (
      <div
        data-theme={theme}
        className="flex justify-center items-center h-screen"
      >
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <>
      <div data-theme={theme}>
        <BrowserRouter>
          <div className="pb-10">
            <Navbar />
          </div>
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
