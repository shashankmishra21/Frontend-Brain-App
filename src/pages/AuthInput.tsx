// shared component
import { forwardRef } from "react";

interface AuthInputProps {
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ placeholder, type = "text", icon }, ref) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
        {icon}
      </div>
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg pl-9 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 focus:bg-zinc-800 transition-all duration-200"
      />
    </div>
  )
);