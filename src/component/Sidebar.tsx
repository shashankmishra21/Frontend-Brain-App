import { SidebarItem } from "./SidebarItem";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { Logo} from "../icons/Logo";

export function Sidebar() {
  return (
    <div className="h-screen w-72 bg-orange-600 border-r fixed top-0 left-0 flex flex-col items-start">
      
      {/* Logo - aligned to left with padding */}
      <div className="pt-6 pb-4 px-6 mb-2 w-full ml-5">
        <Logo />
      </div>

      {/* Sidebar Items */}
      <div className="w-full flex flex-col">
        <SidebarItem text="Twitter" icon={<XIcon />} />
        <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
      </div>
    </div>
  );
}
