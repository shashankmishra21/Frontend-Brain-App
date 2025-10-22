// pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, Upload, Search } from 'lucide-react';
import { CategoryIcon } from '../icons/CategorizationIcon';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, }
    }
};


const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ name?: string } | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        checkAuthStatus();
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const checkAuthStatus = () => {
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
        if (isAuthenticated) navigate('/main');
        else navigate('/signin');
    };

    const handleSignIn = () => navigate('/signin');

    const handleLogout = (): void => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Navbar */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-800 to-indigo-800 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute w-96 h-96 bg-blue-400/6 rounded-full blur-3xl"
                        animate={{
                            x: [mousePosition.x / 20, mousePosition.x / 20 + 10],
                            y: [mousePosition.y / 20, mousePosition.y / 20 + 10],
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.div
                        className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/8 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/6 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />
                </div>

                {/* Navbar */}
                <motion.nav
                    className="relative z-20"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative container mx-auto px-6 py-5">
                        <div className="flex items-center justify-between">
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ scale: 1.05 }}
                            >
                                <img src="BrainCachelogo.png" alt="BrainCache Logo" className="w-10 h-10 object-contain" />
                                <span className="text-2xl font-black tracking-tight">
                                    <span className="text-white drop-shadow-lg">Brain</span>
                                    <span className="bg-orange-100 bg-clip-text text-transparent drop-shadow-sm">Cache</span>
                                </span>
                            </motion.div>

                            <div className="hidden md:flex items-center space-x-8">
                                {isAuthenticated ? (
                                    <>
                                        {user?.name && <span className="text-white/70 text-sm font-medium">Hi, {user.name}</span>}
                                        <motion.button
                                            onClick={handleGetStarted}
                                            className="group flex items-center space-x-2 px-6 py-2.5 bg-white/12 hover:bg-white/18 backdrop-blur-sm text-white font-semibold text-sm rounded-lg border border-white/25"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>Dashboard</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-orange-500" />
                                        </motion.button>
                                        <motion.button
                                            onClick={handleLogout}
                                            className="text-white/85 hover:text-white font-medium text-sm"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            Logout
                                        </motion.button>
                                    </>
                                ) : (
                                    <>
                                        <motion.button
                                            onClick={handleSignIn}
                                            className="text-white/85 hover:text-white font-medium text-sm"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            Sign In
                                        </motion.button>
                                        <motion.button
                                            onClick={handleGetStarted}
                                            className="group flex items-center space-x-2 px-6 py-2.5 bg-orange-100 backdrop-blur-sm text-white font-semibold text-sm rounded-lg border border-white/25"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>Your BrainCache</span>
                                            <ArrowRight className="w-4 h-4 text-orange-500" />
                                        </motion.button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-6 py-20">
                    <div className="text-center max-w-6xl mx-auto">
                        <motion.h1
                            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="text-white">Never Lose What </span>
                            <span className="bg-orange-100 bg-clip-text text-transparent">Matters</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            "Your brain is for having ideas, not storing them. Let BrainCache be your external memory."
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <motion.button
                                onClick={() => { }}
                                className="group px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold rounded-lg flex items-center space-x-3"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(251, 191, 36, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Watch Demo</span>
                            </motion.button>

                            <motion.button
                                onClick={handleGetStarted}
                                className="group px-10 py-5 bg-white text-blue text-lg font-semibold rounded-lg flex items-center space-x-3"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(251, 191, 36, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                                <ArrowRight className="w-5 h-5 text-orange-500" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="bg-gradient-to-b from-white to-gray-50 py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <motion.div
                                className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <img src="BrainCachelogo.png" alt="Logo" className="w-10 h-10 object-contain" />
                            </motion.div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            About Brain<span className="bg-orange-100 bg-clip-text text-transparent">Cache</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're building the ultimate second brain for the information age.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 mt-16">
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-3xl font-bold bg-gradient-to-br from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
                                Our Vision
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Brain Cache emerged from a fundamental challenge: extracting meaningful insights from the digital noise. We created a solution that allows you to capture and retrieve valuable content precisely when you need it.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Brain Cache, crafted by a solo innovator with firsthand experience of information overload, provides a powerful system that transforms how you capture, organize, and instantly retrieve your most valuable digital knowledge.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                In today's fast-paced world, professionals are drowning in information—scattered across LinkedIn posts, YouTube videos, articles, documents, and countless browser tabs. Important insights get buried, brilliant ideas are forgotten, and valuable knowledge becomes impossible to find when you need it most.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: (
                                            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                            </svg>
                                        ),
                                        bg: "from-pink-100 to-rose-100",
                                        title: "Knowledge Empowerment",
                                        desc: "We believe your collected knowledge should be easily accessible and organized, empowering you to make connections and find inspiration."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                        ),
                                        bg: "from-blue-100 to-indigo-100",
                                        title: "User-Centered Design",
                                        desc: "Everything we build starts with understanding how people actually save and retrieve information, not how we think they should."
                                    },
                                    {
                                        icon: (
                                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                            </svg>
                                        ),
                                        bg: "from-purple-100 to-indigo-100",
                                        title: "Seamless Integration",
                                        desc: "Your knowledge collection should fit naturally into your workflow, becoming an extension of your thinking rather than another tool to manage."
                                    }
                                ].map((value, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        whileHover={{ x: 5 }}
                                    >
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${value.bg} rounded-full flex items-center justify-center`}>
                                            {value.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                                            <p className="text-sm text-gray-600">{value.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 flex items-center justify-center gap-3 flex-wrap"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-gray-900">How Your</span>
                        <motion.img
                            src="BrainCachelogo.png"
                            alt="BrainCache"
                            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain inline-block"
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                        />
                        <span className="text-gray-900">Works</span>
                    </motion.h2>

                    <motion.div
                        className="grid md:grid-cols-5 gap-8 max-w-7xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { step: "01", title: "Discover", desc: "Find valuable content across the web", color: "from-blue-600 to-indigo-600" },
                            { step: "02", title: "Save", desc: "One-click capture to your personal Brain Cache", color: "from-blue-600 to-indigo-600" },
                            { step: "03", title: "Organize", desc: "Categorization of your saved content", color: "from-blue-600 to-indigo-600" },
                            { step: "04", title: "Find", desc: "Powerful search to locate exactly what you need", color: "from-blue-600 to-indigo-600" },
                            { step: "05", title: "Remember", desc: "Access your knowledge anytime, anywhere", color: "from-blue-600 to-indigo-600" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.05 }}
                            >
                                <motion.div
                                    className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto shadow-lg mb-6`}
                                    whileHover={{ rotate: 360, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {item.step}
                                </motion.div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need in One Place
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Professional tools designed for knowledge workers who value efficiency
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { icon: <Upload className="w-8 h-8 text-orange-500" />, title: "Universal Capture", desc: "Save content from any platform - LinkedIn posts, YouTube videos, documents, and links" },
                            { icon: <CategoryIcon />, title: "Categorization", desc: "Smart categorization and tagging. Never lose important content again" },
                            { icon: <Search className="w-8 h-8" />, title: "Instant Search", desc: "Find anything in seconds with intelligent semantic search capabilities" },
                            { icon: <Share2 className="w-8 h-8" />, title: "Share Collections", desc: "Create professional collections and share curated knowledge with teams" }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            >
                                <FeatureCard {...feature} gradient="from-indigo-500 to-blue-600" delay="0" isDark={false} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 py-20">
                <div className="container mx-auto px-6 flex flex-col items-center text-center max-w-5xl">
                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Extend Your
                        <span className="block bg-orange-100 bg-clip-text text-transparent">
                            Digital Brain?
                        </span>
                    </motion.h2>
        
                    <motion.button
                        onClick={handleGetStarted}
                        className="px-12 py-6 bg-white text-black text-xl font-semibold rounded-lg relative overflow-hidden"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(251, 191, 36, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <span className="relative z-10">Start Organizing Your Digital Knowledge Today</span>
                    </motion.button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-300">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-8">
                        <motion.div
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3">
                                <img src="BrainCachelogo.png" alt="BrainCache Logo" className="w-12 h-12 object-contain" />
                                <span className="text-2xl font-black tracking-tight">
                                    <span className="text-gray-900">Brain</span>
                                    <span className="bg-orange-100 bg-clip-text text-transparent">Cache</span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium italic">
                                The ultimate second brain for the information age
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex-1 text-center space-y-2"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-gray-900 text-base font-medium">
                                Optimized for Productivity · Secure Design · High-Performance Architecture
                            </p>
                            <p className="text-gray-500 text-sm">© 2025 BrainCache. Never Lose What Matters</p>
                            <p className="text-gray-500 text-sm">
                                <span className="font-semibold text-gray-900 italic">Developed by </span>
                                <span className="bg-orange-100 bg-clip-text text-transparent font-bold italic">Shashank</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    gradient: string;
    delay: string;
    isDark: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, gradient }) => (
    <div className="group p-8 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-500">
        <div className={`inline-flex p-4 bg-gradient-to-r ${gradient} rounded-lg mb-6 group-hover:scale-110 transition-all duration-300`}>
            <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
