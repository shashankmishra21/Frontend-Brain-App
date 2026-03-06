import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, Upload, Github, Brain, Tag, Code2, GraduationCap, PenLine, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

// Variants 
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const FEATURES = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI-Powered Search',
    desc: 'Ask anything in plain English — "how do I prevent DDoS?" — AI answers from your own saved notes.',
    accent: 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20',
  },
  {
    icon: <Upload className="w-5 h-5" />,
    title: 'Universal Capture',
    desc: 'Save from LinkedIn, YouTube, Twitter, Instagram, articles, or upload documents — all in one place.',
    accent: 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20',
  },
  {
    icon: <Tag className="w-5 h-5" />,
    title: 'Auto Smart Tags',
    desc: 'AI reads your content and auto-generates relevant tags and a concise summary — zero manual effort.',
    accent: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: 'Share Your Brain',
    desc: 'Generate a public link to share your curated knowledge library with anyone, anytime.',
    accent: 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Save', desc: 'Capture any content — links, docs, social posts' },
  { step: '02', title: 'AI Reads', desc: 'AI auto-summarizes and tags your content' },
  { step: '03', title: 'Organizes', desc: 'Everything sorted by type, tags, and topic' },
  { step: '04', title: 'You Ask', desc: 'Query your notes in plain English' },
  { step: '05', title: 'AI Answers', desc: 'Get instant answers from your own knowledge' },
];

const USE_CASES = [
  {
    icon: <Code2 className="w-5 h-5" />,
    accent: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    title: 'Developers',
    desc: 'Save Stack Overflow answers, docs, and articles. Ask "how to implement JWT" — get answers from your own saved resources.'
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    accent: 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20',
    title: 'Students',
    desc: 'Save lecture notes, YouTube explanations, articles. Query your study material before exams.'
  },
  {
    icon: <PenLine className="w-5 h-5" />,
    accent: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    title: 'Content Creators',
    desc: 'Capture inspiration from LinkedIn, Twitter, YouTube. Never lose a good idea again.'
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    accent: 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20',
    title: 'Founders',
    desc: 'Save market research, competitor links, strategy docs. Your entire research — queryable in seconds.'
  },
];

const STATS = [
  { value: '5+', label: 'Content Types' },
  { value: 'AI', label: 'Powered Search' },
  { value: '∞', label: 'Notes Saved' },
  { value: '100%', label: 'Your Data' },
];

//  Component 
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  };

  const handleGetStarted = () => navigate(isAuthenticated ? '/main' : '/signin');
  const handleSignIn = () => navigate('/signin');
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-body">

      {/* Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60'
          : 'bg-transparent'
          }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            whileHover={{ opacity: 0.8 }}
            onClick={() => navigate('/')}
          >
            <img src="BrainCachelogo.png" alt="BrainCache" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tight font-display">
              Brain<span className="text-blue-500">Cache</span>
            </span>
          </motion.div>

          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <span className="text-sm text-zinc-500 hidden md:block mr-2">
                    Hi, {user.name}
                  </span>
                )}
                <NavButton onClick={handleGetStarted} variant="ghost">
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </NavButton>
                <NavButton onClick={handleLogout} variant="ghost">Logout</NavButton>
              </>
            ) : (
              <>
                {/* Hide Sign in on small screens */}
                <NavButton onClick={handleSignIn} variant="ghost">
                  <span className="hidden xs:inline">Sign in</span>
                  <span className="xs:hidden">Login</span>
                </NavButton>
                <NavButton onClick={handleGetStarted} variant="primary">
                  <span className="hidden sm:inline">Get started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </NavButton>
              </>
            )}
          </div>

        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 px-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-blue-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/70 border border-zinc-700/50 text-xs text-zinc-400 font-medium mb-10 tracking-widest uppercase"
          >

            AI-Powered Second Brain
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-6"
          >
            Capture everything.
            <br />
            <span className="text-blue-500 italic font-light">
              Forget nothing.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed font-light" >
            You save content. You forget content.
            BrainCache fixes that — AI reads everything you save
            and answers your questions from it, instantly.

          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <motion.button
              onClick={handleGetStarted}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start for free'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

          </motion.div>

          {/* micro-line */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mt-8 text-xs text-zinc-600 tracking-wide"
          >
            Free to use · AI-powered · No credit card required
          </motion.p>
        </div>
      </section>

      {/* ── Stats ─── */}
      <section className="py-10 px-6 border-y border-zinc-800/40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-4 sm:grid-cols-4 gap-6 text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((s, i) => (
              <motion.div key={i} variants={itemFade}>
                <p className="font-display text-2xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Separator
      <div className="w-full border-t border-zinc-800/60" /> */}

      {/* ── How It Works ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em] mb-3">
              Workflow
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Save it. Ask it.{' '}
              <span className="italic font-light text-zinc-500">Never forget it.</span>
            </h2>
          </motion.div>

          <motion.div
            className="space-y-px"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={i}
                variants={itemFade}
                className="group flex items-start gap-6 py-5 border-b border-zinc-800/50 hover:border-zinc-700/50 transition-colors duration-200"
              >
                <span className="font-mono text-[11px] font-bold text-zinc-700 group-hover:text-blue-500 transition-colors pt-0.5 w-6 flex-shrink-0">
                  {item.step}
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-display text-base font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 sm:max-w-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-0.5" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── Product Preview ── */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/60"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-zinc-900/90 border-b border-zinc-800/60">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="flex-1 mx-6">
                <div className="max-w-[200px] mx-auto px-3 py-1 bg-zinc-800/80 rounded-md text-[11px] text-zinc-500 text-center">
                  braincache.app
                </div>
              </div>
            </div>
            <img
              src="/preview.png"
              alt="BrainCache Dashboard"
              className="w-full object-cover"
            />
          </motion.div>
        </div>
      </section>


      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em] mb-3">
              Features
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Your notes.{' '}
                <span className="italic font-light text-zinc-500">Now intelligent.</span>
              </h2>
              <p className="text-sm text-zinc-500 sm:max-w-[200px] leading-relaxed font-light">
                AI reads, tags, and answers from everything you save.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-px bg-zinc-800/30 rounded-xl overflow-hidden border border-zinc-800/40"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={itemFade}
                whileHover={{ backgroundColor: 'rgba(24,24,27,0.8)' }}
                className="flex gap-4 p-6 bg-zinc-950 transition-colors duration-200"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${f.accent}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── Use Cases ── */}
      <section className="py-24 px-6 border-t border-zinc-800/40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em] mb-3">
              Who it's for
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Built for{' '}
              <span className="italic font-light text-zinc-500">curious minds.</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-px bg-zinc-800/30 rounded-xl overflow-hidden border border-zinc-800/40"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {USE_CASES.map((u, i) => (
              <motion.div
                key={i}
                variants={itemFade}
                whileHover={{ backgroundColor: 'rgba(24,24,27,0.8)' }}
                className="flex gap-4 p-6 bg-zinc-950 transition-colors duration-200"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${u.accent}`}>
                  {u.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{u.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">{u.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-36 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={itemFade}
              className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em] mb-5"
            >
              Get started today
            </motion.p>
            <motion.h2
              variants={itemFade}
              className="font-display text-4xl md:text-5xl font-bold tracking-[-0.02em] mb-5 leading-[1.1]"
            >
              Your knowledge base.
              <br />
              <span className="text-blue-500 italic font-light"> Now answers back.</span>
            </motion.h2>
            <motion.p
              variants={itemFade}
              className="text-zinc-500 mb-10 text-base font-light leading-relaxed"
            >
              Stop losing ideas to browser tabs and forgotten links.
              BrainCache remembers everything — and tells you what you need, when you need it.
            </motion.p>
            <motion.div
              variants={itemFade}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.button
                onClick={handleGetStarted}
                className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {isAuthenticated ? 'Open Dashboard' : 'Start for free'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
              <motion.a
                href="https://github.com/shashankmishra21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-800/60 text-zinc-300 text-sm font-medium rounded-lg border border-zinc-700/60 hover:bg-zinc-800 hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Github className="w-4 h-4" />
                View Source
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/*Footer*/}
      <footer className="border-t border-zinc-800/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">

          <div className="flex items-center gap-2.5">
            <img src="BrainCachelogo.png" alt="BrainCache" className="w-7 h-7 object-contain" />
            <span className="text-sm font-bold tracking-tight font-display">
              Brain<span className="text-blue-500">Cache</span>
            </span>
          </div>

          <p className="text-xs text-zinc-600 text-center">
            © 2026 BrainCache · Built by{' '}
            <span className="text-zinc-400 font-medium italic font-display">
              Shashank Mishra
            </span>
          </p>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            v3.0 · Actively maintained
          </div>

        </div>
      </footer>
    </div>
  );
};

// NavButton
interface NavButtonProps {
  onClick: () => void;
  variant: 'ghost' | 'primary';
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, variant, children }) => (
  <motion.button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors font-body ${variant === 'primary'
      ? 'bg-white text-zinc-900 hover:bg-zinc-100'
      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
      }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
  >
    {children}
  </motion.button>
);

export default LandingPage;