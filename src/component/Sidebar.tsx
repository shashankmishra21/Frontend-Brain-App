import { SidebarItem } from "./SidebarItem";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { Logo } from "../icons/Logo";
import { AllIcons } from "../icons/AllIcons";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { Button } from "./Button";

interface SidebarProps {
  onSelectType: (type: string) => void;
}

export function Sidebar({ onSelectType }: SidebarProps) {
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="h-full w-full bg-orange-600 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="pt-6 pb-4 px-6">
          <Logo />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-y-2 px-4">
          <SidebarItem text="All" icon={<AllIcons />} onClick={() => onSelectType("all")} />
          <SidebarItem text="Twitter" icon={<XIcon />} onClick={() => onSelectType("twitter")} />
          <SidebarItem text="YouTube" icon={<YoutubeIcon />} onClick={() => onSelectType("youtube")} />
          <SidebarItem text="LinkedIn" icon={<LinkedinIcon />} onClick={() => onSelectType("linkedin")} />
          <SidebarItem text="Instagram" icon={<InstagramIcon />} onClick={() => onSelectType("instagram")} />
        </div>

        {/* Logout Button */}
        {localStorage.getItem("token") && (
          <div className="flex justify-center mt-6 px-4">
            <Button onClick={logout} loading={false} variant="primary" text="Logout" fullWidth />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-black pb-4">
        <div>© {new Date().getFullYear()} Linkify. All rights reserved.</div>
        <div>Developed by <span className="text-orange-800">Shashank</span></div>
      </div>
    </div>
  );
}
