import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { AllIcons } from "../icons/AllIcons";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { Button } from "./Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DocumentIcon } from "../icons/DocumentIcon";
import { OtherIcon } from "../icons/OtherIcon";

interface SidebarProps {
  onSelectType: (type: string) => void;
}

export function Sidebar({ onSelectType }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    toast.success("logged out");
    window.location.href = "/";
  }

  const handleSelect = (type: string) => {
    onSelectType(type);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Icon (Mobile) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-100 p-1.5 ml-2 rounded-md mt-2 shadow-lg"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 22 22"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 h-full w-72 z-50 bg-gray-300 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block`}>
        <div className="h-screen w-full flex flex-col justify-between">
          {/* Top */}
          <div>
            {/* Logo & Close Button */}
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center gap-3">
                <img
                  src="BrainCachelogo.png"
                  alt="BrainCache Logo"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-gray-900">Brain</span>
                  <span className="bg-orange-100 bg-clip-text text-transparent">Cache</span>
                </span>
              </div>

              {isOpen && (
                <button
                  className="lg:hidden"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>


            {/* Menu Items */}
            <div className="flex flex-col gap-y-2 px-4">
              <SidebarItem
                text="All"
                icon={<AllIcons />}
                onClick={() => handleSelect("all")}
              />
              <SidebarItem
                text="Twitter"
                icon={<XIcon />}
                onClick={() => handleSelect("twitter")}
              />
              <SidebarItem
                text="YouTube"
                icon={<YoutubeIcon />}
                onClick={() => handleSelect("youtube")}
              />
              <SidebarItem
                text="LinkedIn"
                icon={<LinkedinIcon />}
                onClick={() => handleSelect("linkedin")}
              />
              <SidebarItem
                text="Instagram"
                icon={<InstagramIcon />}
                onClick={() => handleSelect("instagram")}
              />
              <SidebarItem
                text="Documents"
                icon={<DocumentIcon />}
                onClick={() => handleSelect("documents")}
              />
              <SidebarItem
                text="Others"
                icon={<OtherIcon />}
                onClick={() => handleSelect("other")}
              />
            </div>

            {/* Home & Logout Buttons */}
            {localStorage.getItem("token") && (
              <div className="flex flex-col gap-3 justify-center mt-6 px-4">
                {/* Home Button */}
                {/* <Button
                  onClick={() => navigate('/')}
                  loading={false}
                  variant="primary"
                  text="Home"
                  fullWidth
                /> */}

                {/* Logout Button */}
                <Button
                  onClick={logout}
                  loading={false}
                  variant="primary"
                  text="Logout"
                  fullWidth
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-black font-light pb-4">
            <div>© {new Date().getFullYear()} Linkify. All rights reserved.</div>
            <div>
              Developed by <span className="text-orange-800">Shashank</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
