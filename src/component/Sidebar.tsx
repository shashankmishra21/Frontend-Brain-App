import { SidebarItem } from "./SidebarItem";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { Logo } from "../icons/Logo";
import { AllIcons } from "../icons/AllIcons";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";

interface SidebarProps {
  onSelectType: (type: string) => void;
}

export function Sidebar({ onSelectType }: SidebarProps) {
  return (
    <div className="h-screen w-72 bg-orange-600 border-r fixed top-0 left-0 flex flex-col justify-between">

      {/* Top Section */}
      <div>
        <div className="pt-4 pb-4 px-6 mb-0 w-full ml-4">
          <Logo />
        </div>
        <div className="w-full flex flex-col">
          <SidebarItem text="All" icon={<AllIcons />} onClick={() => onSelectType("all")} />
          <SidebarItem text="Twitter" icon={<XIcon />} onClick={() => onSelectType("twitter")} />
          <SidebarItem text="YouTube" icon={<YoutubeIcon />} onClick={() => onSelectType("youtube")} />
          <SidebarItem text="LinkedIn" icon={<LinkedinIcon />} onClick={() => onSelectType("linkedin")} />
          <SidebarItem text="Instagram" icon={<InstagramIcon />} onClick={() => onSelectType("instagram")} />
        </div>
      </div>

      {/* Bottom Section - Footer */}
      <div className="w-full text-center text-sm text-black pb-4 ">
        <div className="font-light">© {new Date().getFullYear()} Linkify. All rights reserved.

        </div>
        <div className="font-light">Made by Shashank</div>
      </div>
    </div>
  );
}
