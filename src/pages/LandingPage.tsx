import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, Upload, Github, Brain, Tag, Code2, GraduationCap, PenLine, Rocket, Zap, Shield, Search } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

//  Module-level constant
const geist: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// Reduced Motion Safe Variants
const useSafeVariants = () => {
  const reduced = useReducedMotion();
  return {
    fadeUp: {
      hidden: { opacity: 0, y: reduced ? 0 : 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
    },
    stagger: {
      hidden: {},
      visible: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.04 } },
    },
    itemFade: {
      hidden: { opacity: 0, y: reduced ? 0 : 14 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
    },
  };
};

// Data 
const FEATURES = [
  { icon: Brain, title: 'AI-Powered Search', desc: 'Ask anything in plain English. AI answers from your own saved notes — not the internet.', accent: 'bg-violet-50 text-violet-600' },
  { icon: Upload, title: 'Universal Capture', desc: 'Save from LinkedIn, YouTube, Twitter, articles, or upload documents — all in one place.', accent: 'bg-blue-50 text-blue-600' },
  { icon: Tag, title: 'Auto Smart Tags', desc: 'AI reads your content and auto-generates tags and a concise summary. Zero manual effort.', accent: 'bg-emerald-50 text-emerald-600' },
  { icon: Share2, title: 'Share Your Brain', desc: 'Generate a public link to share your curated knowledge library with anyone, anytime.', accent: 'bg-orange-50 text-orange-600' },
  { icon: Shield, title: 'Private by Default', desc: 'Everything stays private unless you explicitly share it. Your data, your control.', accent: 'bg-rose-50 text-rose-600' },
  { icon: Zap, title: 'Instant Retrieval', desc: 'Redis-powered cache delivers sub-100ms results across thousands of your saved items.', accent: 'bg-amber-50 text-amber-600' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Save', desc: 'Capture links, docs, and social posts', icon: Upload },
  { step: '02', title: 'AI Reads', desc: 'Auto-summarizes and tags your content', icon: Brain },
  { step: '03', title: 'Organizes', desc: 'Sorted by type, tags, and topic', icon: Tag },
  { step: '04', title: 'You Ask', desc: 'Query your notes in plain English', icon: Search },
  { step: '05', title: 'AI Answers', desc: 'Instant answers from your knowledge', icon: Zap },
];

const USE_CASES = [
  {
    icon: Code2,
    accent: 'bg-blue-50 text-blue-600',
    dotColor: 'bg-blue-400',
    tag: 'FOR DEVELOPERS',
    title: 'Stop Googling the same thing twice.',
    desc: 'Save Stack Overflow answers, docs, and articles. Ask questions and get answers from your own saved resources — instantly.',
    cta: 'Start saving',
    searchPlaceholder: 'how to implement JWT refresh tokens...',
    mockResults: [
      { title: 'JWT Implementation Guide — auth0.com', source: 'Saved 2 days ago' },
      { title: 'Stack Overflow: JWT best practices', source: 'Saved last week' },
      { title: 'My notes: token expiry handling', source: 'Saved 3 weeks ago' },
    ],
    aiAnswer: 'Based on your notes: Use httpOnly cookies with a 15min access token...',
  },
  {
    icon: GraduationCap,
    accent: 'bg-violet-50 text-violet-600',
    dotColor: 'bg-violet-400',
    tag: 'FOR STUDENTS',
    title: 'Your entire study material, searchable.',
    desc: 'Save lecture notes, YouTube explanations, and articles. Query everything before exams without hunting through a hundred tabs.',
    cta: 'Start saving',
    searchPlaceholder: 'explain gradient descent simply...',
    mockResults: [
      { title: 'Lecture 7: ML Optimization — Prof. Sharma', source: 'Saved from Drive' },
      { title: '3Blue1Brown: Neural Networks playlist', source: 'Saved from YouTube' },
      { title: 'My notes: backpropagation formula', source: 'Saved last month' },
    ],
    aiAnswer: 'From your lecture notes: Gradient descent minimizes loss by...',
  },
  {
    icon: PenLine,
    accent: 'bg-emerald-50 text-emerald-600',
    dotColor: 'bg-emerald-400',
    tag: 'FOR CREATORS',
    title: 'Never lose a good idea again.',
    desc: 'Capture inspiration from LinkedIn, Twitter, and YouTube. Your ideas are always organized, tagged, and within reach.',
    cta: 'Start saving',
    searchPlaceholder: 'viral hooks I saved last month...',
    mockResults: [
      { title: '"The best content starts with a question" — Twitter', source: 'Saved from Twitter' },
      { title: 'Newsletter idea: AI tools roundup', source: 'Saved from LinkedIn' },
      { title: "Hook template: \"Most people don't know...\"", source: 'Saved from notion' },
    ],
    aiAnswer: 'From your saved hooks: Your top pattern is curiosity gaps...',
  },
  {
    icon: Rocket,
    accent: 'bg-orange-50 text-orange-600',
    dotColor: 'bg-orange-400',
    tag: 'FOR FOUNDERS',
    title: 'Research in seconds, not hours.',
    desc: 'Save market research, competitor links, and strategy docs. Your entire research base becomes queryable in seconds.',
    cta: 'Start saving',
    searchPlaceholder: 'competitor pricing models I saved...',
    mockResults: [
      { title: 'Linear pricing page — linear.app', source: 'Saved this week' },
      { title: 'YC: How to price your SaaS product', source: 'Saved from YC blog' },
      { title: 'My notes: pricing research Q1 2026', source: 'Saved last month' },
    ],
    aiAnswer: 'From your research: Most competitors use seat-based pricing...',
  },
];

const STATS = [
  { value: '5+', label: 'Content Types' },
  { value: 'AI', label: 'Powered Search' },
  { value: '∞', label: 'Notes Saved' },
  { value: '100%', label: 'Your Data' },
];

const TICKER_ITEMS = [
  'YouTube Videos', 'PDFs', 'Articles', 'Twitter Posts',
  'LinkedIn Posts', 'Instagram', 'Code Snippets', 'Lecture Notes',
  'Research Papers', 'Bookmarks', 'Documents', 'Links',
];

// Manifesto 
const ManifestoSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="py-24 sm:py-32 px-6 bg-gray-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '38px 38px' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-green-400 text-xs font-medium tracking-[0.22em] uppercase mb-6"
          style={geist}
        >
          Our Belief
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[-0.025em] mb-8"
          style={geist}
        >
          The future is{' '}
          <span className="text-green-400 italic font-light " style={{ fontFamily: "'Orbitron', sans-serif" }}>knowledge</span>
          <br />
          <span className="text-green-400 italic font-light" style={{ fontFamily: "'Orbitron', sans-serif" }}>plus</span>{' '}AI.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-white/75 text-lg sm:text-xl font-light leading-relaxed max-w-3xl mb-5"
          style={geist}
        >
          We've entered an era where information is abundant but retrieval is broken.
          This changes the skills you need, the way you work, and how fast you think.
          BrainCache fixes that.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white/40 text-lg sm:text-xl font-light leading-relaxed max-w-3xl"
          style={geist}
        >
          We're building the tool that makes your saved knowledge finally work for you.
        </motion.p>
      </div>
    </section>
  );
};

// Ticker 
const Ticker = React.memo(() => (
  <div className="relative overflow-hidden py-7 border-y border-gray-100 bg-gray-50/60">
    <div className="flex">
      {[0, 1].map((clone) => (
        <motion.div
          key={clone}
          className="flex gap-8 sm:gap-12 flex-shrink-0 pr-8 sm:pr-12"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
        >
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-xs text-gray-6  00 whitespace-nowrap font-normal tracking-wide"
              style={geist}
            >
              <span className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
    <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
  </div>
));

// NavButton 
interface NavButtonProps {
  onClick: () => void;
  variant: 'ghost' | 'primary' | 'outline';
  children: React.ReactNode;
  ariaLabel?: string;
}

const NavButton = React.memo<NavButtonProps>(({ onClick, variant, children, ariaLabel }) => (
  <motion.button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${variant === 'primary'
      ? 'bg-gray-950 text-white hover:bg-gray-800 active:bg-gray-900'
      : variant === 'outline'
        ? 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
      }`}
    style={geist}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
  >
    {children}
  </motion.button>
));

// Browser Chrome
const BrowserChrome = React.memo(({ url = 'braincache.app' }: { url?: string }) => (
  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-800">
    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
    <div className="flex-1 mx-4">
      <div className="max-w-[160px] mx-auto px-3 py-0.5 bg-gray-800 rounded text-[10px] text-gray-500 text-center font-mono">
        {url}
      </div>
    </div>
  </div>
));

// Main Component
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { fadeUp, stagger, itemFade } = useSafeVariants();

  // Auth check — inline in useEffect, runs once on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleGetStarted = useCallback(
    () => navigate(isAuthenticated ? '/main' : '/signin'),
    [isAuthenticated, navigate]
  );
  const handleSignIn = useCallback(() => navigate('/signin'), [navigate]);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased" style={geist}>

      {/* Navbar */}
      <motion.header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
          : 'bg-white/60 backdrop-blur-md border-b border-gray-100/80'
          }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between">

          {/* Logo */}
          <motion.button
            className="group flex items-center gap-1 select-none rounded-lg p-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            aria-label="BrainCache — go home"
          >
            <img
              src="BrainCachelogo.png"
              alt=""
              aria-hidden
              className="w-7 h-7 sm:w-10 sm:h-10 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className="text-[14px] sm:text-[26px] font-semibold tracking-[-0.01em] text-gray-900"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Brain<span className="text-green-600">Cache<span className='text-black'>.ai</span></span>
            </span>

          </motion.button>


          {/* Nav */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {isAuthenticated ? (
              <>
                {/* Online indicator — hidden on mobile */}
                {user?.name && (
                  <span
                    className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-400 mr-2 select-none"
                    style={geist}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                    Hi, {user.name}
                  </span>
                )}

                {/* Dashboard — icon-only on sm, text+icon on md+ */}
                <NavButton onClick={handleGetStarted} variant="ghost">
                  <span className="hidden sm:inline">Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </NavButton>

                {/* Logout — short label on sm */}
                <NavButton onClick={handleLogout} variant="outline">
                  <span className="sm:hidden">Out</span>
                  <span className="hidden sm:inline">Log out</span>
                </NavButton>
              </>
            ) : (
              <>
                {/* Login — hidden on very small, visible from sm */}
                <NavButton onClick={handleSignIn} variant="ghost">
                  <span className="hidden xs:inline">Log in</span>
                  <span className="xs:hidden text-[12px]">Login</span>
                </NavButton>

                {/* Divider */}
                <div className="h-4 w-px bg-gray-200 mx-0.5" aria-hidden />

                {/* Get started — compact on sm */}
                <NavButton onClick={handleGetStarted} variant="primary">
                  <span className="hidden sm:inline">Get started</span>
                  <span className="sm:hidden text-[12px]">Start</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden />
                </NavButton>
              </>
            )}
          </nav>

        </div>
      </motion.header>

      <main>
        {/*  Hero */}
        <section aria-label="Hero" className="relative pt-28 sm:pt-32 md:pt-40 pb-0 px-4 sm:px-6 overflow-hidden bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={stagger} initial="hidden" animate="visible">

              <motion.h1
                variants={itemFade}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal leading-[1.06] tracking-[-0.035em] text-gray-900 mb-6"
                style={geist}
              >
                <span className="text-green-600" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  Capture
                </span>{' '}the knowledge
                <br />
                you keep{' '}
                <span className="text-green-600 italic" style={geist}>
                  forgetting.
                </span>
              </motion.h1>


              <motion.p
                variants={itemFade}
                className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-normal"
                style={geist}
              >
                BrainCache helps you save content from anywhere and get instant AI answers
                from your own knowledge — not the internet.
              </motion.p>

              <motion.div
                variants={itemFade}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6"
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="group flex items-center gap-2 px-4 py-2 sm:px-7 sm:py-3.5 bg-gray-950 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 active:bg-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 w-auto justify-center"

                  style={geist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={isAuthenticated ? 'Go to Dashboard' : 'Start a free trial'}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start a free trial'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </motion.button>
              </motion.div>

              {/* <motion.p variants={itemFade} className="text-sm text-gray-700 pt-5 mb-16" style={geist}>
                Free to use · AI-powered · No credit card required
              </motion.p> */}

            </motion.div>
          </div>

          <Ticker />
        </section>

        {/* Stats */}
        <section aria-label="Stats" className="py-10 sm:py-8 px-4 sm:px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  variants={itemFade}
                  className="text-center px-4 sm:px-6 py-7 sm:py-9 hover:bg-gray-50/80 transition-colors cursor-default" >
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-1.5 tracking-[-0.02em]"
                    style={geist}>
                    {s.value}
                  </p>

                  <p className="text-xs lg:text-sm text-gray-400 font-normal leading-snug" style={geist}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section aria-label="Use cases" className="py-12 sm:py-8 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">

            <motion.div
              className="mb-2 sm:mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-medium text-green-500 uppercase tracking-[0.22em] mb-0" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Who It's For
              </p>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.2] tracking-[-0.02em] text-gray-900" style={geist}>
                  Built for{' '}
                  <span className="text-green-500 italic">curious minds.</span>
                </h2>
                <p className="text-sm lg:text-base text-gray-700 font-normal sm:max-w-[200px] lg:max-w-[220px] shrink-0" style={geist}>
                  Whoever you are, BrainCache fits your workflow.
                </p>
              </div>
            </motion.div>

            <div className="divide-y divide-gray-100">
              {USE_CASES.map((u, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={u.tag}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-14 sm:py-16"
                  >
                    {/* Text */}
                    <div className={`${!isEven ? 'lg:order-2' : ''} flex flex-col gap-4`}>
                      <span className="text-[10px] lg:text-xs font-medium text-gray-400 tracking-[0.2em] uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {u.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-normal leading-[1.2] tracking-[-0.02em] text-gray-900" style={geist}>
                        {u.title}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-500 leading-relaxed font-normal max-w-sm lg:max-w-md" style={geist}>
                        {u.desc}
                      </p>
                      <button
                        onClick={handleGetStarted}
                        className="group self-start flex items-center gap-1.5 text-sm font-normal text-gray-900 mt-1 hover:text-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded"
                        style={geist}
                      >
                        {u.cta}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" aria-hidden />
                      </button>
                    </div>

                    {/* Visual */}
                    <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        <BrowserChrome url={`braincache.app/${u.tag.toLowerCase().replace('for ', '')}`} />
                        <div className="bg-gray-950 p-6 sm:p-8 min-h-[220px] sm:min-h-[260px] flex flex-col gap-3">

                          {/* Search bar */}
                          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl">
                            <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" aria-hidden />
                            <span className="text-xs text-white/30 font-normal" style={geist}>
                              {u.searchPlaceholder}
                            </span>
                          </div>

                          {/* Result cards */}
                          <div className="flex flex-col gap-2 mt-1">
                            {u.mockResults.map((result, j) => (
                              <div
                                key={j}
                                className="flex items-start gap-3 px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl"
                              >
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${u.dotColor}`} aria-hidden />
                                <div className="flex flex-col gap-1 min-w-0">
                                  <p className="text-xs text-white/60 font-normal leading-snug truncate" style={geist}>
                                    {result.title}
                                  </p>
                                  <p className="text-[11px] text-white/25 font-normal leading-snug" style={geist}>
                                    {result.source}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* AI answer */}
                          <div className="flex items-center gap-2 mt-auto px-4 py-2.5 bg-green-500/[0.08] border border-green-500/[0.15] rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" aria-hidden />
                            <p className="text-xs text-green-400/80 font-normal leading-snug" style={geist}>
                              {u.aiAnswer}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <ManifestoSection />

        {/*  Features */}
        <section aria-label="Features" className="py-20 sm:py-28 px-4 sm:px-6 bg-gray-50/40 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">

              {/* ── Sticky left ── */}
              <motion.div
                className="lg:sticky lg:top-24 lg:self-start"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p
                  className="text-[10px] font-medium text-green-500 uppercase tracking-[0.22em] mb-4"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Features
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.2] tracking-[-0.02em] text-gray-900 mb-4" style={geist} >
                  Your notes.
                  <br />
                  <span className="text-green-500 italic">Now intelligent.</span>
                </h2>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed font-normal" style={geist} >
                  Six capabilities that turn your saved content into a knowledge engine that works for you.
                </p>
              </motion.div>

              {/* Feature list */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="divide-y divide-gray-100"
              >
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    variants={itemFade}
                    className="group grid grid-cols-[32px_1fr] gap-6 py-7 cursor-default"
                  >
                    {/* Index number */}
                    <span
                      className="text-xs font-normal text-black-700 tabular-nums pt-0.5 transition-colors"
                      style={geist}
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Content */}
                    <div>
                      <h3 className="text-sm lg:text-base font-normal text-gray-900 mb-1.5 leading-snug group-hover:text-gray-700 transition-colors duration-200" style={geist} >
                        {f.title}
                      </h3>
                      <p className="text-sm lg:text-[15px] text-gray-600 leading-relaxed font-normal" style={geist} >
                        {f.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>


        {/* How It Works */}
        <section aria-label="How it works" className="py-20 sm:py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <motion.div
              className="mb-16 sm:mb-20"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p
                className="text-[10px] font-medium text-green-500 uppercase tracking-[0.22em] mb-4"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                How It Works
              </p>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.2] tracking-[-0.02em] text-gray-900" style={geist} >
                  From saved to searchable.{' '}
                  <span className="text-green-500 italic">In seconds.</span>
                </h2>
                <p className="text-sm lg:text-base text-gray-800 leading-relaxed font-normal sm:max-w-[180px] lg:max-w-[200px] shrink-0" style={geist}>
                  Five steps. Zero friction.
                </p>
              </div>
            </motion.div>

            {/* Steps */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative grid grid-cols-1 sm:grid-cols-5 gap-0"
            >
              {/* Connector line — desktop only */}
              <div
                className="hidden sm:block absolute top-[22px] left-[10%] right-[10%] h-px bg-gray-100 z-0"
                aria-hidden
              />

              {HOW_IT_WORKS.map((item) => (
                <motion.div
                  key={item.step}
                  variants={itemFade}
                  className="group relative z-10 flex flex-col items-start sm:items-center sm:text-center gap-4 py-7 sm:py-0 border-b sm:border-b-0 border-gray-100 last:border-b-0 sm:px-3"
                >
                  {/* Step dot */}
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-3 w-full sm:w-auto">
                    <div className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
                      <span
                        className="text-sm font-normal text-gray-900 tabular-nums"
                        style={geist}
                      >
                        {item.step}
                      </span>
                    </div>

                    {/* Mobile: title inline with dot */}
                    <div className="sm:hidden flex flex-col gap-1">
                      <h3
                        className="text-base font-normal text-black leading-snug"
                        style={geist}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm text-gray-700 leading-relaxed font-normal"
                        style={geist}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Desktop: title + desc below dot */}
                  <div className="hidden sm:flex flex-col gap-2 mt-5">
                    <h3 className="text-sm lg:text-base font-normal text-black leading-snug"
                      style={geist} >
                      {item.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-700 leading-relaxed font-normal"
                      style={geist}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        {/*  Product Preview */}
        <section aria-label="Product preview" className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-medium text-green-500 uppercase tracking-[0.22em] mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Product
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[-0.02em] text-gray-900" style={geist}>
                See it in action.
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-100/80"
            >
              <BrowserChrome />
              <img
                src="/preview.png"
                alt="BrainCache dashboard — full product view"
                className="w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA + Footer */}
        <section aria-label="Get started" className="px-4 sm:px-6 bg-gray-950 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/15 to-transparent pointer-events-none" aria-hidden />

          {/* CTA */}
          <div className="relative max-w-2xl mx-auto text-center py-24 sm:py-32">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.p variants={itemFade} className="text-[10px] font-medium text-green-400 uppercase tracking-[0.22em] mb-5" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Get Started
              </motion.p>

              <motion.h2
                variants={itemFade}
                className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.025em] text-white mb-5 leading-[1.1]"
                style={geist}
              >
                Your knowledge base.
                <br />
                <span className="text-green-400 italic">Now answers back.</span>
              </motion.h2>

              <motion.p variants={itemFade} className="text-white/40 mb-10 text-base font-normal leading-relaxed" style={geist}>
                Stop losing ideas to browser tabs and forgotten links.
                BrainCache remembers everything — and tells you what you need, when you need it.
              </motion.p>

              <motion.div variants={itemFade} className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-sm font-normal rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                  style={geist}
                  aria-label={isAuthenticated ? 'Open Dashboard' : 'Start for free'}
                >
                  {isAuthenticated ? 'Open Dashboard' : 'Start for free'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </button>

                <a
                  href="https://github.com/shashankmishra21"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View BrainCache on GitHub (opens in new tab)"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/10 text-white/50 text-sm font-normal rounded-xl hover:bg-white/5 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-gray-950"
                  style={geist}
                >
                  <Github className="w-4 h-4" aria-hidden />
                  View Source
                </a>
              </motion.div>

              <motion.p variants={itemFade} className="mt-8 text-xs text-white/20 font-normal" style={geist}>
                Free to use · AI-powered · No credit card required
              </motion.p>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="relative max-w-6xl mx-auto">
            <div className="h-px bg-white/[0.06]" />
          </div>

          {/* Footer  */}
          <footer
            role="contentinfo"
            className="relative max-w-6xl mx-auto py-7 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4" >
            <div className="flex items-center gap-2">
              <img src="BrainCachelogo.png" alt="" className="w-6 h-6 object-contain opacity-80" aria-hidden />
              <span className="text-sm text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Brain<span className="text-green-600">Cache<span className='text-white'>.ai</span></span>
              </span>
            </div>

            <p className="text-xs text-white text-center font-normal" style={geist}>
              © {new Date().getFullYear()} BrainCache · Built by{' '}
              <span className="text-white italic" style={{ fontFamily: "'Orbitron', sans-serif" }}>Shashank Mishra</span>
            </p>

            <div className="flex items-center gap-1.5 text-xs text-white/25 font-normal" style={geist}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" aria-hidden />
              v3.0 · Actively maintained
            </div>
          </footer>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;