// pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Globe,Share2, Upload, Search } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Add authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name?: string } | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Check authentication status on component mount
        checkAuthStatus();

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Function to check if user is authenticated
    const checkAuthStatus = () => {
        // Check localStorage, sessionStorage, or your auth context
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const handleGetStarted = (): void => {
        if (isAuthenticated) {
            // Redirect to dashboard if authenticated
            navigate('/main');
        } else {
            // Redirect to signup if not authenticated
            navigate('/signin');
        }
    };

    const handleSignIn = (): void => {
        navigate('/signin');
    };

    const handleLogout = (): void => {
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        // Optionally redirect to home or show success message
        navigate('/');
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Navbar */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-800 to-indigo-800 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div
                        className="absolute w-96 h-96 bg-blue-400/6 rounded-full blur-3xl animate-pulse"
                        style={{
                            left: mousePosition.x / 20,
                            top: mousePosition.y / 20,
                        }}
                    />
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/8 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/6 rounded-full blur-3xl animate-pulse delay-2000" />
                </div>

                {/* Conditional Navigation */}
                <nav className="relative z-20">

                    <div className="relative container mx-auto px-6 py-5">
                        <div className="flex items-center justify-between">

                            {/* BrainCache Brand */}
                            <div className="flex items-center">
                                <span className="text-2xl font-black tracking-tight">
                                    <span className="text-white drop-shadow-lg">Brain</span>
                                    <span className="bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-sm">Cache</span>
                                </span>
                            </div>

                            {/* Navigation Links - Desktop */}
                            <div className="hidden md:flex items-center space-x-8">
                                <a
                                    href="#features"
                                    className="text-white/85 hover:text-white font-medium text-sm transition-all duration-300 relative group py-2 px-1"
                                >
                                    Features
                                    <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="text-white/85 hover:text-white font-medium text-sm transition-all duration-300 relative group py-2 px-1"
                                >
                                    How It Works
                                    <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                </a>
                                <a
                                    href="#about"
                                    className="text-white/85 hover:text-white font-medium text-sm transition-all duration-300 relative group py-2 px-1"
                                >
                                    About
                                    <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                </a>

                                {/* Conditional Authentication Buttons */}
                                {isAuthenticated ? (
                                    // Show when user is signed in
                                    <>
                                        {/* User greeting - optional */}
                                        {user?.name && (
                                            <span className="text-white/70 text-sm font-medium">
                                                Hi, {user.name}
                                            </span>
                                        )}

                                        {/* Get Started Button (leads to dashboard) */}
                                        <button
                                            onClick={handleGetStarted}
                                            className="group flex items-center space-x-2 px-6 py-2.5 bg-white/12 hover:bg-white/18 backdrop-blur-sm text-white font-semibold text-sm rounded-lg transition-all duration-300 hover:scale-105 border border-white/25 hover:border-white/35 shadow-sm"
                                        >
                                            <span>Dashboard</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            className="text-white/85 hover:text-white font-medium text-sm transition-all duration-300 relative group py-2 px-1"
                                        >
                                            Logout
                                            <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-300 to-pink-300 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                        </button>
                                    </>
                                ) : (
                                    // Show when user is NOT signed in
                                    <>
                                        {/* Sign In Button */}
                                        <button
                                            onClick={handleSignIn}
                                            className="text-white/85 hover:text-white font-medium text-sm transition-all duration-300 relative group py-2 px-1"
                                        >
                                            Sign In
                                            <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-100 to-cyan-100 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                        </button>

                                        {/* Get Started Button (leads to signup) */}
                                        <button
                                            onClick={handleGetStarted}
                                            className="group flex items-center space-x-2 px-6 py-2.5 bg-white/12 hover:bg-white/18 backdrop-blur-sm text-white font-semibold text-sm rounded-lg transition-all duration-300 hover:scale-105 border border-white/25 hover:border-white/35 shadow-sm"
                                        >
                                            <span>Your BrainCache</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button className="md:hidden p-2.5 text-white/85 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-6 py-20">
                    <div className="text-center max-w-6xl mx-auto">
                        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 leading-tight whitespace-nowrap overflow-hidden">
                            <span className="text-white">Never Lose </span>
                            <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-pink-300 bg-clip-text text-transparent">
                                What Matters
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed font-dmsans">
                            Stop losing track of valuable content across platforms or anything in the world -save everything in one organized space and retrieve it instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                            <button
                                onClick={handleGetStarted}
                                className="group px-10 py-5 bg-white text-blue text-lg font-semibold rounded-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-500 flex items-center space-x-3"
                            >

                                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>

                            {/* Watch Demo Button */}
                            <button
                                onClick={() => {/* Add your demo handler here */ }}
                                className="group px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold rounded-lg hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-500 flex items-center space-x-3"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Watch Demo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - White Background */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need in One Place
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Professional tools designed for knowledge workers who value efficiency
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        <FeatureCard
                            icon={<Upload className="w-8 h-8" />}
                            title="Universal Capture"
                            description="Save content from any platform - LinkedIn posts, YouTube videos, documents, and links"
                            gradient="from-blue-500 to-indigo-600"
                            delay="0"
                            isDark={false}
                        />
                        <FeatureCard
                            icon={<Brain className="w-8 h-8" />}
                            title="AI Organization"
                            description="Smart categorization and tagging. Never lose important content again"
                            gradient="from-pink-500 to-rose-600"
                            delay="100"
                            isDark={false}
                        />
                        <FeatureCard
                            icon={<Search className="w-8 h-8" />}
                            title="Instant Search"
                            description="Find anything in seconds with intelligent semantic search capabilities"
                            gradient="from-slate-600 to-slate-700"
                            delay="200"
                            isDark={false}
                        />
                        <FeatureCard
                            icon={<Share2 className="w-8 h-8" />}
                            title="Share Collections"
                            description="Create professional collections and share curated knowledge with teams"
                            gradient="from-indigo-500 to-blue-600"
                            delay="300"
                            isDark={false}
                        />
                    </div>
                </div>
            </div>

            {/* How it Works Section - Light Gray Background */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16">
                        <span className="text-gray-900">How Your </span>
                        <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Brain Cache</span>
                        <span className="text-gray-900"> Works</span>
                    </h2>

                    <div className="grid md:grid-cols-5 gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "Discover",
                                desc: "Find valuable content across the web",
                                icon: <Globe className="w-6 h-6" />,
                                stepColor: "from-blue-600 to-indigo-600",
                                iconColor: "from-indigo-500 to-blue-500"
                            },
                            {
                                step: "02",
                                title: "Save",
                                desc: "One-click capture to your personal Brain Cache",
                                icon: <Upload className="w-6 h-6" />,
                                stepColor: "from-pink-600 to-rose-600",
                                iconColor: "from-rose-500 to-pink-500"
                            },
                            {
                                step: "03",
                                title: "Organize",
                                desc: "AI-powered categorization of your saved content",
                                icon: <Brain className="w-6 h-6" />,
                                stepColor: "from-slate-600 to-slate-700",
                                iconColor: "from-slate-500 to-slate-600"
                            },
                            {
                                step: "04",
                                title: "Find",
                                desc: "Powerful search to locate exactly what you need",
                                icon: <Search className="w-6 h-6" />,
                                stepColor: "from-indigo-600 to-blue-600",
                                iconColor: "from-blue-500 to-indigo-500"
                            },
                            {
                                step: "05",
                                title: "Remember",
                                desc: "Access your knowledge anytime, anywhere",
                                icon: <Brain className="w-6 h-6" />,
                                stepColor: "from-blue-600 to-pink-600",
                                iconColor: "from-pink-500 to-blue-500"
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${item.stepColor} rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                                        {item.step}
                                    </div>
                                    <div className={`absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r ${item.iconColor} rounded-lg flex items-center justify-center text-white`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section - Dark Blue Background */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-r from-slate-800/40 via-blue-800/20 to-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center max-w-5xl mx-auto relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-pink-500/3" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Ready to Extend Your
                                <span className="block bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent">
                                    Digital Brain?
                                </span>
                            </h2>
                            <p className="text-lg text-slate-200 mb-10 max-w-3xl mx-auto">
                                Join thousands of professionals who've transformed their knowledge management with Linkify
                            </p>
                            <button
                                onClick={handleGetStarted}
                                className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-semibold rounded-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                <span className="relative z-10">Start Your Brain Cache Journey</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - White Background */}
            <footer className="bg-white py-12 border-t border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-gray-900">BrainCache</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Optimized for Productivity . Secure Design . High-Performance Architecture
                        </p>
                        <p className="text-gray-500 text-sm">
                            © 2025 BrainCache. Never Loose What Matters
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    delay: string;
    isDark: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, delay, isDark }) => (
    <div
        className={`group p-8 ${isDark ? 'bg-white/5' : 'bg-gray-50'} backdrop-blur-sm rounded-xl border ${isDark ? 'border-white/10 hover:bg-white/8 hover:border-white/20' : 'border-gray-200 hover:bg-white hover:border-gray-300'} transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${isDark ? 'hover:shadow-blue-500/10' : 'hover:shadow-gray-300/20'}`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`inline-flex p-4 bg-gradient-to-r ${gradient} rounded-lg mb-6 group-hover:scale-110 transition-all duration-300`}>
            <div className="text-white">{icon}</div>
        </div>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>{title}</h3>
        <p className={`${isDark ? 'text-slate-200' : 'text-gray-600'} text-sm leading-relaxed`}>{description}</p>
    </div>
);

export default LandingPage;
