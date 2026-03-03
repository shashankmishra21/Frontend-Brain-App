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
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left
        ${active
          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent'
        }`}  >
      {icon && (
        <span className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-400' : 'text-zinc-600'}`}>
          {icon}
        </span>
      )}
      {text}
    </button>
  );
}