import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: String;
    startIcon?: ReactElement;
    onClick?: () => void;
}

const variantClasses = {
    "primary": "bg-orange-100 text-gray-100",
    "secondary": "bg-orange-300 text-gray-100",
}

const defaultStyles = "px-2 py-2 rounded-md font-light flex items-center"

export function Button({ variant, text, startIcon , onClick}: ButtonProps) {

    return <button onClick={onClick} className={variantClasses[variant] + " " + defaultStyles}>
        <div className="pr-2">
            {startIcon}
        </div>
        {text}
    </button>
}

