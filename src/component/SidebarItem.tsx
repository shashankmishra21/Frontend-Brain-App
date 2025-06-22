interface SidebarItemProps {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function SidebarItem({ text, icon, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-6 py-2 text-black hover:bg-orange-100 cursor-pointer font-light"
    >
      {icon && <span className="mr-4 mt-2">{icon}</span>}
      {text}
    </div>
  );
}
