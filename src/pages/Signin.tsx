// pages/Signin.tsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowLeft, LogIn, Brain, Sparkles } from "lucide-react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "./config";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const Signin: React.FC = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const donthaveacc = (): void => {
        navigate("/signup");
    };

    const backToLanding = (): void => {
        navigate("/");
    };

    const signin = async (): Promise<void> => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            toast.warning("Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password,
            });

            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            toast.success("🎉 Welcome back to your Brain Cache!");
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            signin();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex justify-center items-center p-4 relative overflow-hidden">
            {/* Quirky Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-bounce" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-ping" />
                
                {/* Floating Icons */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-6 h-6 text-orange-400/30 animate-bounce`}
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${20 + (i % 4) * 20}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${2 + i * 0.2}s`,
                        }}
                    >
                        {i % 2 === 0 ? <Brain className="w-full h-full" /> : <Sparkles className="w-full h-full" />}
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl relative overflow-hidden">
                    {/* Animated border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-sm animate-pulse" />
                    
                    <div className="relative z-10">
                        {/* Back Button */}
                        <button 
                            onClick={backToLanding}
                            className="absolute -top-2 -left-2 p-3 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-8 pt-4">
                            <div className="relative inline-block mb-6">
                                <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl shadow-lg transform rotate-3 hover:rotate-12 transition-transform duration-300">
                                    <LogIn className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-yellow-900" />
                                </div>
                            </div>
                            
                            <h2 className="text-3xl font-black text-white mb-3 transform hover:scale-105 transition-transform">
                                Welcome Back!
                            </h2>
                            
                            <div className="flex justify-center items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <Brain className="w-6 h-6 text-orange-400 animate-pulse" />
                                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                        Linkify
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-gray-300 font-medium">Access your Brain Cache and continue organizing!</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center space-x-2">
                                    <span>Username</span>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />
                                </label>
                                <input 
                                    ref={usernameRef} 
                                    placeholder="Enter your username" 
                                    className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/50"
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center space-x-2">
                                    <span>Password</span>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                                </label>
                                <div className="relative">
                                    <input 
                                        ref={passwordRef} 
                                        placeholder="Enter your password" 
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/50 pr-12"
                                        onKeyPress={handleKeyPress}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={signin} 
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Accessing Brain Cache..." : "🚀 Access Brain Cache"}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-300 font-medium">
                                Don't have a Brain Cache yet?{" "}
                                <button 
                                    onClick={donthaveacc} 
                                    className="text-orange-400 font-bold hover:text-orange-300 hover:underline transition-colors hover:scale-105 inline-block transform"
                                >
                                    Create one now! ✨
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Quirky Info */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <p className="text-gray-400 text-sm font-medium">
                            Secure • Privacy-focused • Your data stays yours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
