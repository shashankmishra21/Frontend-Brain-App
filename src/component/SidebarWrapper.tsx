import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function SidebarWrapper({ onSelectType }: { onSelectType: (type: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Icon - mobile only */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setIsOpen(true)} className="bg-orange-600 p-2 rounded-md shadow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Overlay - only for mobile when sidebar is open */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    } lg:hidden`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar - responsive behavior */}
            <div
                className={`fixed top-0 left-0 h-screen w-72 z-50 bg-orange-600 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
            >
                <Sidebar
                    onSelectType={(type) => {
                        onSelectType(type);
                        setIsOpen(false); // close on mobile
                    }}
                />
            </div>
        </>
    );
}
