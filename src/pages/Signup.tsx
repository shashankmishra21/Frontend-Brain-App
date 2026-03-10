import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "./config";
import { AuthInput } from "./AuthInput";

const geist = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as React.CSSProperties;

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (!username || !password) {
      toast.warning("Please enter both username and password.");
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
      });
      toast.success("Account created! Please sign in.");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      toast.error("Signup failed. Username may already exist.");
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex flex-col relative overflow-hidden" style={geist}>

      {/* Background layers */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/circuit2.png')" }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-green-950/40 mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-green-950/80 via-black/60 to-transparent" />

      {/* Top — logo on bg */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-3 px-4">
        <img
          src="BrainCachelogowhite.png"
          alt="BrainCache"
          className="w-14 h-14 md:w-20 md:h-20 drop-shadow-lg"
        />
        <span
          className="text-white font-bold text-2xl md:text-3xl tracking-tight drop-shadow-md"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Brain<span className="text-green-400">Cache.ai</span>
        </span>
        <p className="text-white/60 text-[11px] md:text-xs tracking-widest uppercase mt-1">
          Your second brain starts here
        </p>
      </div>

      {/* Bottom card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full bg-[#0c0c0c]/95 backdrop-blur-md border-t border-green-500/20 rounded-t-3xl px-5 pt-8 pb-10 sm:px-8 md:px-0"
      >
        <div className="w-full md:max-w-lg md:mx-auto md:px-12 lg:max-w-xl lg:px-16">

          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
            Create an account
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mb-7">
            Free forever. No credit card required.
          </p>

          <div className="space-y-3 mb-5">
            <AuthInput
              ref={usernameRef}
              placeholder="username"
              icon={<User className="w-4 h-4 text-green-600" />}
            />
            <AuthInput
              ref={passwordRef}
              type="password"
              placeholder="password"
              icon={<Lock className="w-4 h-4 text-green-600" />}
            />
          </div>

          <motion.button
            onClick={handleSignup}
            className="w-full h-12 bg-green-600/20 hover:bg-green-600 border border-green-600 text-green-400 hover:text-white font-semibold text-sm md:text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            Create account
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-xs md:text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-green-500 hover:text-green-400 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  );
}