import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
function LoginPage() {
  const [showPassword, setPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/*Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/*LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome back</h1>
              <p className="text-base-content/60">
                Log in to your account
              </p>
            </div>
          </div>

          {/*FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-5text-based-content/40" />
                </div>
                <input
                  type="text"
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-5 text-based-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="*********"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-based-content/40" />
                  ) : (
                    <Eye className="size-5 text-based-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading ...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              {" "}
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/*Right Side */}
      <div>
        <AuthImagePattern
          title="Welcome back!"
          subtitle="Sign in to continue your conversations and catch up with your messages ."
        />
      </div>
    </div>
  )
}

export default LoginPage