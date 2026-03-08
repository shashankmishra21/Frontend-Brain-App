interface SidebarItemProps {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export function SidebarItem({ text, icon, onClick, active }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left
        ${active
          ? "bg-green-50 text-green-600 border border-green-100"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent" }`} >
      {icon && (
        <span
          className={`w-5 h-5 flex-shrink-0 ${active ? "text-green-600" : "text-gray-400" }`} >
          {icon}
        </span>
      )}

      {text}
    </button>
  );
}