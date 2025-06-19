import { ReactElement } from "react";

type SidebarItemProps = {
    text: string;
    icon: ReactElement;
};

export function SidebarItem({ text, icon }: SidebarItemProps) {
    return (
  <div className="flex w-full py-2 px-6 ml-6 cursor-pointer ">
    <div className="w-7 h-7 text-xl mr-4 flex items-center justify-center text-gray-100">
      {icon}
    </div>

    <div className="text-gray-100 font-light text-lg leading-none transition-colors duration-200 rounded-md hover:text-orange-100">
      {text}
    </div>
  </div>
);

}
