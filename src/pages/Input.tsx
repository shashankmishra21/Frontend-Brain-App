// components/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, type = "text", className = "", ...props }, ref) => {
        return (
            <input 
                ref={ref} 
                placeholder={placeholder} 
                type={type}
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
