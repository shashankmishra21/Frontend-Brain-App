// pages/Signin.tsx
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "./config";
import { AuthInput } from "./AuthInput";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      toast.warning("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password,
      });
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      toast.success("Welcome back!");
      navigate("/main");
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-body">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="BrainCachelogo.png"
              alt="BrainCache"
              className="w-12 h-12 object-contain mb-0"
            />
            <span className="text-xl font-bold tracking-tight font-display">
              Brain<span className="text-blue-400">Cache</span>
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-100 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 font-light mb-7">
            Sign in to your account to continue
          </p>

          {/* Fields */}
          <div className="space-y-3 mb-5">
            <AuthInput
              ref={usernameRef}
              placeholder="Username"
              icon={<User className="w-4 h-4" />}
            />
            <AuthInput
              ref={passwordRef}
              placeholder="Password"
              type="password"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          {/* Submit */}
          <motion.button
            onClick={signin}
            className="group w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign in
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-600 mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors"
            >
              Sign up
            </span>
          </p>
        </div>

        {/* Bottom label */}
        <p className="text-center text-xs text-zinc-700 mt-4">
          Free to use · No credit card required
        </p>
      </motion.div>
    </div>
  );
}
