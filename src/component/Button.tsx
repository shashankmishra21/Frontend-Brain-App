import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: String;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading? : boolean;
}

const variantClasses = {
    "primary": "bg-orange-100 text-gray-900 hover:bg-orange-700 transition-colors duration-200",
    "secondary": "bg-orange-200 text-black hover:bg-orange-300 transition-colors duration-200",
}

const defaultStyles = "px-2 py-2 rounded-md font-light flex items-center"

export function Button({ variant, text, startIcon , onClick , fullWidth , loading}: ButtonProps) {

    return <button onClick={onClick} className={variantClasses[variant] + " " + defaultStyles + `${fullWidth ? " w-full flex justify-center items-center" : ""} ${loading? "opacity-60" : ""}  `} disabled={loading}>
        <div className="pr-2">
            {startIcon}
        </div>
        {text}
    </button>
}

