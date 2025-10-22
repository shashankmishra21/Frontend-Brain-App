import type { ReactElement } from 'react';
import type { ReactNode } from 'react';

interface ButtonProps {
    variant: "primary" | "secondary";
    text: ReactNode;
    startIcon?: ReactElement;
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
    loading?: boolean;
    className?: string;
}

const variantClasses = {
    "primary": "bg-orange-100 text-black hover:bg-orange-700 transition-colors duration-200",
    "secondary": "bg-orange-200 text-black hover:bg-orange-300 transition-colors duration-200",
}

const defaultStyles = "px-2 py-2 rounded-md font-light flex items-center"

export function Button({ variant, text, startIcon, onClick, fullWidth, loading, disabled, className }: ButtonProps) {
    return (
        <button 
            onClick={onClick} 
            className={`${variantClasses[variant]} ${defaultStyles} ${fullWidth ? "w-full justify-center" : ""} ${className || ""} ${loading ? "opacity-60" : ""}`}
            disabled={disabled || loading}
        >
            {startIcon && <div className="pr-2">{startIcon}</div>}
            {text}
        </button>
    );
}

