// components/BiggerCard.tsx
import React, { useEffect } from "react";

interface BiggerCardProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  thumbnail?: React.ReactNode;
  type?: string;
  link?: string;
  fileName?: string;
  fileSize?: number;
  hasFile?: boolean;
  downloadUrl?: string;
}

export const BiggerCard: React.FC<BiggerCardProps> = ({
  open,
  onClose,
  title,
  description,
  thumbnail,
  type,
  link,
  fileName,
  fileSize,
  hasFile,
  downloadUrl,
}) => {
  useEffect(() => {
    if (!open) return;
    // Trap focus & listen for ESC key to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay blur */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/40 transition-opacity"
        onClick={onClose}
        aria-label="Close bigger card modal"
      />
      {/* Card container */}
      <div className="relative w-full max-w-[900px] max-h-[600px] mx-4 sm:mx-0 rounded-3xl bg-white shadow-2xl border border-gray-300 flex flex-col sm:flex-row overflow-hidden z-10">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black rounded-full p-2 bg-white/70 backdrop-blur-md text-2xl font-bold leading-none"
          onClick={onClose}
          aria-label="Close bigger card"
        >
          &times;
        </button>

        {/* Left: Thumbnail / Embed */}
        <div className="flex-shrink-0 w-full sm:w-2/5 h-[300px] sm:h-auto overflow-hidden flex items-center justify-center bg-gray-50">
          {thumbnail ? (
            <div className="w-full h-full object-contain overflow-hidden rounded-l-3xl">
              {thumbnail}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
              📦
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex flex-col w-full sm:w-3/5 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed max-h-[350px] overflow-y-auto">{description}</p>
          )}

          {(link || hasFile) && (
            <div className="mt-6 flex gap-4 flex-wrap">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Open Link
                </a>
              )}
              {hasFile && downloadUrl && (
                <a
                  href={downloadUrl}
                  download={fileName}
                  className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Download File
                </a>
              )}
              {fileName && <span className="self-center text-sm text-gray-500">{fileName}</span>}
              {fileSize && (
                <span className="self-center text-sm text-gray-500">
                  {Math.round(fileSize / 1024)} KB
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
