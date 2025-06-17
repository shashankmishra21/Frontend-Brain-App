import { SidebarItem } from "./SidebarItem";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

export function Sidebar() {
    return <div className="h-screen w-72 bg-orange-200 border-r left-0 top-0 fixed">
        <div>
            <SidebarItem text="Twitter" icon={<XIcon />} />
            <SidebarItem text="youtube" icon={<YoutubeIcon />} />
        </div>
    </div>
}