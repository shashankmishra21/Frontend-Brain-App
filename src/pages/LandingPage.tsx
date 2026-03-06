import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, Upload, Github, Brain, Tag, Code2, GraduationCap, PenLine, Rocket, Zap, Shield, Search
} from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// ── Reduced Motion Safe Variants ─────────────────────────────────────────────
const useSafeVariants = () => {
  const reduced = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.04 } },
  };
  const itemFade = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };
  return { fadeUp, stagger, itemFade };
};

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Search',
    desc: 'Ask anything in plain English. AI answers from your own saved notes — not the internet.',
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Upload,
    title: 'Universal Capture',
    desc: 'Save from LinkedIn, YouTube, Twitter, articles, or upload documents — all in one place.',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Tag,
    title: 'Auto Smart Tags',
    desc: 'AI reads your content and auto-generates tags and a concise summary. Zero manual effort.',
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Share2,
    title: 'Share Your Brain',
    desc: 'Generate a public link to share your curated knowledge library with anyone, anytime.',
    accent: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Shield,
    title: 'Private by Default',
    desc: 'Everything stays private unless you explicitly share it. Your data, your control.',
    accent: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Zap,
    title: 'Instant Retrieval',
    desc: 'Redis-powered cache delivers sub-100ms results across thousands of your saved items.',
    accent: 'bg-amber-50 text-amber-600',
  },
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
    tag: 'FOR DEVELOPERS',
    title: 'Stop Googling the same thing twice.',
    desc: 'Save Stack Overflow answers, docs, and articles. Ask questions like "how to implement JWT" and get answers from your own saved resources — instantly.',
    cta: 'Start saving',
  },
  {
    icon: GraduationCap,
    accent: 'bg-violet-50 text-violet-600',
    tag: 'FOR STUDENTS',
    title: 'Your entire study material, searchable.',
    desc: 'Save lecture notes, YouTube explanations, and articles. Query everything before exams without hunting through a hundred browser tabs.',
    cta: 'Start saving',
  },
  {
    icon: PenLine,
    accent: 'bg-emerald-50 text-emerald-600',
    tag: 'FOR CREATORS',
    title: 'Never lose a good idea again.',
    desc: 'Capture inspiration from LinkedIn, Twitter, and YouTube. Your ideas are always organized, tagged, and within reach.',
    cta: 'Start saving',
  },
  {
    icon: Rocket,
    accent: 'bg-orange-50 text-orange-600',
    tag: 'FOR FOUNDERS',
    title: 'Research in seconds, not hours.',
    desc: 'Save market research, competitor links, and strategy docs. Your entire research base becomes queryable in seconds.',
    cta: 'Start saving',
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

// ── Manifesto Section ─────────────────────────────────────────────────────────
const ManifestoSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="py-24 sm:py-32 px-6 bg-gray-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-green-400 text-xs font-medium tracking-[0.22em] uppercase mb-6"
          style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
        >
          Our Belief
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[-0.025em] mb-8"
          style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
        >
          The future is{' '}
          <span className="text-green-400 italic font-light">knowledge</span>
          <br />
          <span className="text-green-400 italic font-light">plus</span>{' '}
          AI.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-white/75 text-lg sm:text-xl font-light leading-relaxed max-w-3xl mb-5"
          style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
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
          style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
        >
          We're building the tool that makes your saved knowledge finally work for you.
        </motion.p>
      </div>
    </section>
  );
};

// ── Ticker ────────────────────────────────────────────────────────────────────
const Ticker = React.memo(() => (
  <div className="relative overflow-hidden py-4 border-y border-gray-100 bg-gray-50/60">
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
              className="flex items-center gap-2 text-xs text-gray-400 whitespace-nowrap font-normal tracking-wide"
              style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
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

// ── NavButton ─────────────────────────────────────────────────────────────────
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
    style={{ fontFamily: "'Geist', 'Inter', sans-serif" }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
  >
    {children}
  </motion.button>
));

// ── Browser Chrome ────────────────────────────────────────────────────────────
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

// ── Main Component ─────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { fadeUp, stagger, itemFade } = useSafeVariants();

  useEffect(() => {
    checkAuthStatus();
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleGetStarted = useCallback(() => navigate(isAuthenticated ? '/main' : '/signin'), [isAuthenticated, navigate]);
  const handleSignIn = useCallback(() => navigate('/signin'), [navigate]);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  }, [navigate]);

  const geist = { fontFamily: "'Open Sans', Arial, Helvetica, sans-serif" };


  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased" style={geist}>

      {/* ── Navbar ── */}
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

          {/* ── Logo ── */}
          <motion.button
            className="group flex items-center gap-2.5 select-none rounded-lg p-1 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
            whileHover={{ opacity: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/')}
            aria-label="BrainCache — go home"
          >
            <img
              src="BrainCachelogo.png"
              alt=""
              aria-hidden
              className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className="text-[15px] font-semibold tracking-[-0.02em] text-gray-900"
              style={geist}
            >
              Brain<span className="text-green-500">Cache</span>
            </span>
          </motion.button>

          {/* ── Actions ── */}
          <nav
            className="flex items-center gap-1"
            aria-label="Main navigation"
          >
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <span
                    className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-400 mr-2 select-none"
                    style={geist}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {user.name}
                  </span>
                )}
                <NavButton onClick={handleGetStarted} variant="ghost">
                  Dashboard
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                </NavButton>
                <NavButton onClick={handleLogout} variant="outline">
                  Log out
                </NavButton>
              </>
            ) : (
              <>
                <NavButton onClick={handleSignIn} variant="ghost">
                  Log in
                </NavButton>

                {/* Divider */}
                <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" aria-hidden />

                <NavButton
                  onClick={handleGetStarted}
                  variant="outline"
                  ariaLabel="Request a demo"
                >
                  <span className="hidden sm:inline">Request demo</span>
                  <span className="sm:hidden">Demo</span>
                </NavButton>

                <NavButton
                  onClick={handleGetStarted}
                  variant="primary"
                  ariaLabel="Create a free account"
                >
                  <span className="hidden sm:inline">Get started</span>
                  <span className="sm:hidden">Sign up</span>
                </NavButton>
              </>
            )}
          </nav>
        </div>
      </motion.header>


      {/* ── Hero ── */}
      <main>
        <section
          aria-label="Hero"
          className="relative pt-28 sm:pt-32 md:pt-40 pb-0 px-4 sm:px-6 overflow-hidden bg-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={stagger} initial="hidden" animate="visible">

              {/* H1 — HackerRank style: massive, thin, centered, green first word */}
              <motion.h1
                variants={itemFade}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal leading-[1.06] tracking-[-0.035em] text-gray-900 mb-6"
                style={geist}
              >
                <span className="text-green-500 font-normal">Capture</span> the knowledge
                <br />
                you keep forgetting.
              </motion.h1>

              {/* Sub — short, centered, gray */}
              <motion.p
                variants={itemFade}
                className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-normal"
                style={geist}
              >
                BrainCache helps you save content from anywhere and get instant AI answers
                from your own knowledge — not the internet.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={itemFade}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20"
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="group flex items-center gap-2 px-7 py-3.5 bg-gray-950 text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:bg-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 w-full sm:w-auto justify-center"
                  style={geist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={isAuthenticated ? 'Go to Dashboard' : 'Start a free trial'}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start a free trial'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </motion.button>

                <motion.a
                  href="https://github.com/shashankmishra21"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View BrainCache on GitHub (opens in new tab)"
                  className="flex items-center gap-2 px-7 py-3.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 w-full sm:w-auto justify-center"
                  style={geist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Github className="w-4 h-4" aria-hidden />
                  For developers
                </motion.a>
              </motion.div>

            </motion.div>
          </div>

          {/* Social proof logo strip — like HackerRank's company logos */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto px-4 pb-16"
          >
            <p className="text-center text-xs text-gray-700 font-normal mb-8 tracking-wide" style={geist}>
              Free to use · AI-powered · No credit card required
            </p>
          </motion.div>

          {/* Ticker */}
          <Ticker />
        </section>

        {/* ── Stats ── */}
        <section aria-label="Stats" className="py-4 sm:py-16 px-4 sm:px-6 bg-white">
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
                  className="text-center px-4 sm:px-6 py-7 sm:py-9 hover:bg-gray-50/80 transition-colors"
                >
                  <p className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1.5 tracking-[-0.02em]" style={geist}>
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-400 font-normal leading-snug" style={geist}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Use Cases (alternating split) ── */}
        <section aria-label="Use cases" className="py-8 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto divide-y divide-gray-100">
            {USE_CASES.map((u, i) => {
              const Icon = u.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={u.tag}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 sm:py-20"
                >
                  {/* Text */}
                  <div className={`${!isEven ? 'lg:order-2' : ''} flex flex-col gap-5`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${u.accent}`}>
                        <Icon className="w-4 h-4" aria-hidden />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 tracking-[0.2em] uppercase" style={geist}>
                        {u.tag}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-[-0.02em] leading-[1.15]" style={geist}>
                      {u.title}
                    </h2>

                    <p className="text-base text-gray-500 leading-relaxed font-normal max-w-md" style={geist}>
                      {u.desc}
                    </p>

                    <button
                      onClick={handleGetStarted}
                      className="group self-start flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:gap-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded"
                      style={geist}
                    >
                      {u.cta}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                    </button>
                  </div>

                  {/* Visual */}
                  <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-gray-100/80">
                      <BrowserChrome url={`braincache.app/${u.tag.toLowerCase().replace('for ', '')}`} />
                      <div className="bg-gray-950 px-8 py-12 flex items-center justify-center min-h-[200px] sm:min-h-[240px]">
                        <div className="text-center">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${u.accent}`}>
                            <Icon className="w-7 h-7" aria-hidden />
                          </div>
                          <p className="text-white/70 text-sm font-normal" style={geist}>{u.title.split('.')[0]}</p>
                          <p className="text-white/30 text-xs mt-1 font-normal" style={geist}>{u.tag}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Manifesto ── */}
        <ManifestoSection />

        {/* ── Features ── */}
        <section aria-label="Features" className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="mb-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-medium text-green-600 uppercase tracking-[0.22em] mb-3" style={geist}>
                Features
              </p>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-gray-900" style={geist}>
                  Your notes.{' '}
                  <span className="text-gray-400 font-light italic">Now intelligent.</span>
                </h2>
                <p className="text-sm text-gray-400 sm:max-w-[200px] leading-relaxed font-normal" style={geist}>
                  Everything you need to stop losing knowledge.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    variants={itemFade}
                    className="group flex flex-col gap-4 p-6 sm:p-7 bg-white hover:bg-gray-50/80 transition-colors duration-200 cursor-default"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${f.accent}`}>
                      <Icon className="w-4.5 h-4.5" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1.5" style={geist}>{f.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed font-normal" style={geist}>{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section aria-label="How it works" className="py-20 sm:py-24 px-4 sm:px-6 bg-gray-50/60 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-medium text-green-600 uppercase tracking-[0.22em] mb-3" style={geist}>
                How It Works
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-gray-900" style={geist}>
                From saved to searchable{' '}
                <span className="text-gray-400 font-light italic">in seconds.</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {HOW_IT_WORKS.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    variants={itemFade}
                    className="group flex flex-col items-center text-center p-6 sm:p-7 bg-white hover:bg-gray-50/80 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center mb-4 group-hover:bg-gray-800 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-green-400" aria-hidden />
                    </div>
                    <span className="text-[10px] font-medium text-gray-300 mb-2 group-hover:text-green-500 transition-colors" style={geist}>
                      {item.step}
                    </span>
                    <h3 className="text-sm font-medium text-gray-900 mb-1.5" style={geist}>{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-normal" style={geist}>{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Product Preview ── */}
        <section aria-label="Product preview" className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-medium text-green-600 uppercase tracking-[0.22em] mb-3" style={geist}>
                Product
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-gray-900" style={geist}>
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

        {/* ── CTA ── */}
        <section
          aria-label="Get started"
          className="py-24 sm:py-32 px-4 sm:px-6 bg-gray-950 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/15 to-transparent pointer-events-none" aria-hidden />

          <div className="relative max-w-2xl mx-auto text-center">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.p
                variants={itemFade}
                className="text-[10px] font-medium text-green-400 uppercase tracking-[0.22em] mb-5"
                style={geist}
              >
                Get Started
              </motion.p>

              <motion.h2
                variants={itemFade}
                className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.025em] text-white mb-5 leading-[1.1]"
                style={geist}
              >
                Your knowledge base.
                <br />
                <span className="text-green-400 font-light italic">Now answers back.</span>
              </motion.h2>

              <motion.p
                variants={itemFade}
                className="text-white/50 mb-10 text-base font-normal leading-relaxed"
                style={geist}
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
                  className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                  style={geist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isAuthenticated ? 'Open Dashboard' : "Start for free"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </motion.button>

                <motion.a
                  href="https://github.com/shashankmishra21"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View BrainCache on GitHub (opens in new tab)"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/15 text-white/70 text-sm font-normal rounded-xl hover:bg-white/8 hover:text-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                  style={geist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Github className="w-4 h-4" aria-hidden />
                  View Source
                </motion.a>
              </motion.div>

              <motion.p
                variants={itemFade}
                className="mt-8 text-xs text-white/25 font-normal"
                style={geist}
              >
                Free to use · AI-powered · No credit card required
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer role="contentinfo" className="border-t border-gray-100 py-8 sm:py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="BrainCachelogo.png" alt="" className="w-6 h-6 object-contain" aria-hidden />
            <span className="text-sm font-medium tracking-tight text-gray-700" style={geist}>
              Brain<span className="text-green-500">Cache</span>
            </span>
          </div>

          <p className="text-xs text-gray-400 text-center font-normal" style={geist}>
            © {new Date().getFullYear()} BrainCache · Built by{' '}
            <span className="text-gray-600 font-medium italic">Shashank Mishra</span>
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-normal" style={geist}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden />
            v3.0 · Actively maintained
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;