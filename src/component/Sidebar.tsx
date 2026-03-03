import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { AllIcons } from "../icons/AllIcons";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { OtherIcon } from "../icons/OtherIcon";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";

interface SidebarProps {
  onSelectType: (type: string) => void;
}

const NAV_ITEMS = [
  { text: "All", icon: <AllIcons />, type: "all" },
  { text: "Twitter", icon: <XIcon />, type: "twitter" },
  { text: "YouTube", icon: <YoutubeIcon />, type: "youtube" },
  { text: "LinkedIn", icon: <LinkedinIcon />, type: "linkedin" },
  { text: "Instagram", icon: <InstagramIcon />, type: "instagram" },
  { text: "Documents", icon: <DocumentIcon />, type: "documents" },
  { text: "Others", icon: <OtherIcon />, type: "other" },
];

export function Sidebar({ onSelectType }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeType, setActiveType] = useState("all");

  function logout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/";
  }

  const handleSelect = (type: string) => {
    setActiveType(type);
    onSelectType(type);
    setIsOpen(false);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      {/* ── Mobile Hamburger ── */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-9 h-9 bg-zinc-800 border border-zinc-700/60 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-4 h-4" />
        </motion.button>
      </div>

      {/* ── Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-zinc-900 border-r border-zinc-800/60 transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full "}
          lg:translate-x-0 lg:static lg:block font-body overflow-hidden`}
      >
        <div className="h-screen flex flex-col overflow-hidden">

          {/* ── Logo ── */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <img
                src="BrainCachelogo.png"
                alt="BrainCache"
                className="w-10 h-10 object-contain"
              />
              <span className="text-base font-bold tracking-tight font-display text-white text-[20px]">
                Brain<span className="text-blue-400">Cache</span>
              </span>
            </div>

            {/* Mobile close */}
            <button
              className="lg:hidden text-zinc-600 hover:text-zinc-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Nav Label ── */}
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-[0.2em]">
              Filter by type
            </p>
          </div>

          {/* ── Nav Items ── */}
          <nav className="flex flex-col gap-0.5 px-3 flex-1">
            {NAV_ITEMS.map(({ text, icon, type }) => (
              <SidebarItem
                key={type}
                text={text}
                icon={icon}
                onClick={() => handleSelect(type)}
                active={activeType === type}
              />
            ))}
          </nav>

          {/* ── Bottom ── */}
          <div className="border-t border-zinc-800/60 p-4 space-y-3">
            {isLoggedIn && (
              <motion.button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 text-sm font-medium rounded-lg hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-600 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            )}

            <div className="text-center space-y-0.5">
              <p className="text-[10px] text-zinc-700">
                © {new Date().getFullYear()} BrainCache
              </p>
              <p className="text-[10px] text-zinc-700">
                Built by{" "}
                <span className="text-zinc-500 italic font-display">
                  Shashank Mishra
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}