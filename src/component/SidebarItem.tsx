import { ReactElement } from "react";

export function SidebarItem({ text, icon }: {
    text: String;
    icon: ReactElement;
}) {
    return <div className="flex items-center">
        <div className="p-2">
            {icon}
        </div>
        <div className="p-2 mb-2">
            {text}
        </div>
    </div>
}