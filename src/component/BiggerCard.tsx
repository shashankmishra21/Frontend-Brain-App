import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../pages/config";

interface BiggerCardProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type: string;
  link?: string;
  fileName?: string;
  fileSize?: number;
  hasFile?: boolean;
  downloadUrl?: string;
  contentId?: string;
}

// Helper functions (Card.tsx se copy)
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

function getCanonicalTwitterURL(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("x.com")) parsed.hostname = "twitter.com";
    return parsed.toString();
  } catch {
    return url;
  }
}

function extractLinkedInEmbedURL(url: string): string | null {
  if (url.includes("linkedin.com/embed")) return url;
  const activityMatch = url.match(/activity-(\d+)-/);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${activityMatch[1]}`;
  }
  return null;
}

function extractPinterestId(url: string): string | null {
  const match = url.match(/pin\/(\d+)/);
  return match ? match[1] : null;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileIcon(fileName?: string): string {
  if (!fileName) return '📄';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const icons = {
    'pdf': '📕', 'doc': '📘', 'docx': '📘', 'ppt': '📙', 'pptx': '📙',
    'xls': '📗', 'xlsx': '📗', 'txt': '📄', 'zip': '🗜️', 'rar': '🗜️',
    'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️'
  };
  return icons[ext as keyof typeof icons] || '📄';
}

export const BiggerCard: React.FC<BiggerCardProps> = ({
  open,
  onClose,
  title,
  description,
  type,
  link,
  fileName,
  fileSize,
  hasFile,
  downloadUrl,
  contentId,
}) => {
  useEffect(() => {
    if (!open) return;

    // Twitter script load
    if (type === "twitter") {
      if (!document.getElementById("twitter-embed-script")) {
        const script = document.createElement("script");
        script.id = "twitter-embed-script";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          // @ts-ignore
          window.twttr?.widgets.load();
        };
        document.body.appendChild(script);
      } else {
        // Script already exists, just reload widgets
        // @ts-ignore
        window.twttr?.widgets.load();
      }
    }

    // Instagram script load
    if (type === "instagram") {
      if (!document.getElementById("instagram-embed-script")) {
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          // @ts-ignore
          window.instgrm?.Embeds.process();
        };
        document.body.appendChild(script);
      } else {
        // Script already exists, just process embeds
        // @ts-ignore
        window.instgrm?.Embeds.process();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, type]);

  const handleFileDownload = async () => {
    if (!downloadUrl && !hasFile) {
      toast.error("File not available for download");
      return;
    }

    try {
      if (downloadUrl) {
        const response = await fetch(downloadUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName || 'download';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success("Download started!");
        } else {
          throw new Error('Download failed');
        }
      } else {
        window.open(`${BACKEND_URL}/api/v1/content/${contentId}/download`, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed. Please try again.");
    }
  };

  const renderEmbeddedContent = () => {
    console.log("Rendering type:", type, "Link:", link);

    if (!link) {
      return (
        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
          📦
        </div>
      );
    }

    const linkedinEmbedUrl = type === "linkedin" ? extractLinkedInEmbedURL(link) : null;
    const pinterestId = type === "pinterest" ? extractPinterestId(link) : null;

    switch (type) {
      case "youtube": {
        const videoId = extractYouTubeId(link);
        if (videoId) {
          return (
            <div className="w-full h-full relative">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="YouTube thumbnail"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(link, '_blank')}
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-red-600 text-white rounded-full p-4 shadow-lg">
                  <span className="text-3xl">▶️</span>
                </div>
              </div>
            </div>
          );
        }
        break;
      }

      case "twitter": {
        // ALWAYS return something for twitter
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer flex items-center justify-center"
            onClick={() => window.open(link, '_blank')}>
            <div className="text-center p-4">
              <div className="text-8xl mb-4">🐦</div>
              <p className="text-lg font-medium text-blue-700">Twitter/X Post</p>
              <p className="text-sm text-blue-600 mt-2">Click to view</p>
            </div>
          </div>
        );
      }

      case "instagram": {
        // ALWAYS return something for instagram
        return (
          <div className="w-full h-full bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer flex items-center justify-center"
            onClick={() => window.open(link, '_blank')}>
            <div className="text-center p-4">
              <div className="text-8xl mb-4">📷</div>
              <p className="text-lg font-medium text-pink-700">Instagram Post</p>
              <p className="text-sm text-pink-600 mt-2">Click to view</p>
            </div>
          </div>
        );
      }

      case "linkedin": {
        if (linkedinEmbedUrl) {
          return (
            <div className="w-full h-full">
              <iframe
                src={linkedinEmbedUrl}
                className="w-full h-full border-none"
                title="LinkedIn Post"
              ></iframe>
            </div>
          );
        }
        // Fallback for LinkedIn
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer flex items-center justify-center"
            onClick={() => window.open(link, '_blank')}>
            <div className="text-center p-4">
              <div className="text-8xl mb-4">💼</div>
              <p className="text-lg font-medium text-blue-700">LinkedIn Post</p>
              <p className="text-sm text-blue-600 mt-2">Click to view</p>
            </div>
          </div>
        );
      }

      case "pinterest": {
        if (pinterestId) {
          return (
            <div className="w-full h-full flex justify-center bg-white p-2">
              <iframe
                src={`https://assets.pinterest.com/ext/embed.html?id=${pinterestId}`}
                className="border-none w-full h-full"
                title="Pinterest Pin"
              ></iframe>
            </div>
          );
        }
        break;
      }

      case "documents": {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center p-4">
              <div className="text-8xl mb-4">{getFileIcon(fileName)}</div>
              <p className="text-lg font-semibold text-blue-800 break-words">{fileName || "Document"}</p>
              {fileSize && <p className="text-sm text-blue-600 mt-2">{formatFileSize(fileSize)}</p>}
            </div>
          </div>
        );
      }

      case "other": {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
            onClick={() => link && window.open(link, '_blank')}>
            <div className="text-center p-4">
              <div className="text-8xl mb-4">🔗</div>
              <p className="text-lg font-medium text-gray-700">Custom Content</p>
              <p className="text-sm text-gray-600 break-words">{new URL(link).hostname}</p>
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg text-gray-700">Content Type: {type}</p>
            </div>
          </div>
        );
      }
    }

    // Final fallback
    return (
      <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
        📦
      </div>
    );
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/40"
        onClick={onClose}
      />

      {/* MAIN FIX: Remove max-height, use fixed height */}
      <div className="relative w-full max-w-[900px] h-[600px] mx-4 rounded-3xl bg-white shadow-2xl border border-gray-300 flex flex-col sm:flex-row overflow-hidden z-10">

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black rounded-full p-2 bg-white/70 text-2xl font-bold z-20"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Left: FIXED HEIGHT */}
        <div className="w-full sm:w-2/5 h-full bg-gray-100 overflow-auto">
          <div className="w-full h-full flex items-center justify-center">
            {renderEmbeddedContent()}
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full sm:w-3/5 h-full p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
              {description}
            </p>
          )}

          {(link || hasFile) && (
            <div className="mt-6 flex gap-4 flex-wrap">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Open Link
                </a>
              )}
              {hasFile && (
                <button
                  onClick={handleFileDownload}
                  className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Download File
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};
