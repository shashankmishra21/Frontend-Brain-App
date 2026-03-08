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
      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-9 h-9 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Overlay */}
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

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:block overflow-hidden`}
      >
        <div className="h-screen flex flex-col overflow-hidden">

          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
            <div className="flex items-center gap-1.5">
              <img
                src="BrainCachelogo.png"
                alt="BrainCache"
                className="w-10 h-10 object-contain"
              />
              <span className="text-[20px] font-bold tracking-tight text-gray-900 " style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Brain<span className="text-green-600">Cache.ai</span>
              </span>
            </div>

            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Label */}
          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] text-gray-900 font-medium uppercase tracking-[0.2em]">
              Filter by type
            </p>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3 flex-1 " style={{ fontFamily: "'Orbitron', sans-serif" }}>
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

          {/* Bottom */}
          <div className="border-t border-gray-800 p-4 space-y-3">

            {isLoggedIn && (
              <motion.button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-800 hover:text-white transition-all" style={{ fontFamily: "'Orbitron', sans-serif" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            )}

            <div className="text-center space-y-0.5">
              <p className="text-[10px] text-gray-900" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                © {new Date().getFullYear()} BrainCache.ai
              </p>
              <p className="text-[10px] text-gray-900">
                Built by{" "}
                <span className="text-gray-900">
                  Shashank
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}