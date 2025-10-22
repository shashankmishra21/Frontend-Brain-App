import React, { useEffect, useState , type JSX} from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../pages/config";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { XIcon } from "../icons/XIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { OtherIcon } from "../icons/OtherIcon";
import { CrossIcon } from "../icons/CrossIcon";

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

function getTypeIcon(type: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    youtube: <YoutubeIcon />,
    twitter: <XIcon />,
    instagram: <InstagramIcon />,
    linkedin: <LinkedinIcon />,
    documents: <DocumentIcon />,
    other: <OtherIcon />
  };

  return icons[type] || <DocumentIcon />;
}

// Helper functions (EXACT COPY from Card.tsx)
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
  const [embedError] = useState(false);
  const [isExpanded] = useState(false);

  useEffect(() => {
    if (!open) return;

    // Instagram script
    if (type === "instagram" && !document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (type === "instagram") {
      // @ts-ignore
      window.instgrm?.Embeds.process();
    }

    // Twitter script
    if (type === "twitter" && !document.getElementById("twitter-embed-script")) {
      const script = document.createElement("script");
      script.id = "twitter-embed-script";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (type === "twitter") {
      // @ts-ignore
      window.twttr?.widgets.load();
    }

    // Pinterest script
    if (type === "pinterest" && !document.getElementById("pinterest-embed-script")) {
      const script = document.createElement("script");
      script.id = "pinterest-embed-script";
      script.src = "https://assets.pinterest.com/js/pinit.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, type]);

  const handleFileDownload = () => {
    console.log("Download:", { downloadUrl, contentId, fileName });
    
    if (!downloadUrl && !contentId) {
      toast.error("File not available for download");
      return;
    }

    try {
      const finalUrl = downloadUrl || `${BACKEND_URL}/api/v1/content/${contentId}/download`;
      
      // Simple approach - let browser handle it
      const a = document.createElement('a');
      a.href = finalUrl;
      a.download = fileName || 'download';
      a.target = '_blank';
      
      // Add token to headers via fetch (for authenticated downloads)
      const token = localStorage.getItem("token");
      if (token) {
        fetch(finalUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success("Download started!");
        })
        .catch(err => {
          console.error("Download error:", err);
          // Fallback: try direct window.open
          window.open(finalUrl, '_blank');
        });
      } else {
        // No token - direct download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed. Please try again.");
    }
};


  // EXACT COPY of renderContent from Card.tsx
  const renderContent = () => {
    const linkedinEmbedUrl = type === "linkedin" && link ? extractLinkedInEmbedURL(link) : null;
    const pinterestId = type === "pinterest" && link ? extractPinterestId(link) : null;

    const contentHeight = isExpanded ? 'auto' : '400px'; // Bigger for modal

    switch (type) {
      case "youtube":
        if (link) {
          const videoId = extractYouTubeId(link);
          if (videoId) {
            return (
              <div className="w-full h-full overflow-hidden rounded-lg shadow-sm relative">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => window.open(link, '_blank')}
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-red-600 text-white rounded-full p-4 shadow-lg opacity-90">
                    <span className="text-3xl">▶️</span>
                  </div>
                </div>
              </div>
            );
          }
        }
        break;

      case "twitter":
        if (link && !embedError) {
          const canonicalLink = getCanonicalTwitterURL(link);
          return (
            <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200">
              {/* Scrollable area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
                <blockquote
                  className="twitter-tweet"
                  data-theme="light"
                  data-conversation="none"
                >
                  <a href={canonicalLink}></a>
                </blockquote>
              </div>
            </div>
          );
        }
        break;


      case "instagram":
        if (link && !embedError) {
          return (
            <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200">
              {/* Scrollable area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center p-2">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={link}
                  data-instgrm-version="14"
                  style={{
                    margin: '0 auto',
                    maxWidth: '100%'
                  }}
                ></blockquote>
              </div>
            </div>
          );
        }
        break;

      case "linkedin":
        if (linkedinEmbedUrl && !embedError) {
          return (
            <div className="w-full h-full overflow-hidden rounded-lg bg-white border border-gray-200">
              <iframe
                src={linkedinEmbedUrl}
                className="w-full h-full border-none"
                title="LinkedIn Post"
              ></iframe>
            </div>
          );
        }
        break;

      case "pinterest":
        if (pinterestId && !embedError) {
          return (
            <div className="w-full h-full overflow-hidden rounded-lg bg-white border border-gray-200 flex justify-center">
              <iframe
                src={`https://assets.pinterest.com/ext/embed.html?id=${pinterestId}`}
                className="border-none w-full h-full"
                title="Pinterest Pin"
              ></iframe>
            </div>
          );
        }
        break;

      case "documents":
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-200 rounded-lg overflow-hidden">
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="text-8xl mb-4">{getFileIcon(fileName)}</div>
              <div className="text-center w-full">
                <p className="text-lg font-semibold text-blue-800 break-words mb-1">
                  {fileName || "Document"}
                </p>
                {fileSize && (
                  <p className="text-sm text-blue-600 mb-2">
                    {formatFileSize(fileSize)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "other":
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => link && window.open(link, '_blank')}>
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="text-7xl mb-3">🔗</div>
              <div className="text-center w-full">
                <p className="text-lg font-medium text-gray-700 mb-1">Custom Content</p>
                {link && (
                  <p className="text-sm text-gray-600 break-words">
                    {new URL(link).hostname}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
    }

    // Fallback thumbnails (same as Card.tsx)
    const commonClass = "w-full h-full rounded-lg overflow-hidden bg-gradient-to-br shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow";

    const fallbackThumbnails: Record<string, JSX.Element> = {
      youtube: (
        <div className={`${commonClass} from-red-50 to-red-100`}
          onClick={() => link && window.open(link, '_blank')}>
          <div className="text-7xl mb-3"><YoutubeIcon /></div>
          <p className="text-sm font-medium text-red-700">YouTube Video</p>
        </div>
      ),
      twitter: (
        <div className={`${commonClass} from-blue-50 to-blue-100`}
          onClick={() => link && window.open(link, '_blank')}>
          <div className="text-7xl mb-3"><XIcon /></div>
          <p className="text-sm font-medium text-blue-700">Twitter Post</p>
        </div>
      ),
      instagram: (
        <div className={`${commonClass} from-pink-50 to-pink-100`}
          onClick={() => link && window.open(link, '_blank')}>
          <div className="text-7xl mb-3"><InstagramIcon /></div>
          <p className="text-sm font-medium text-pink-700">Instagram Post</p>
        </div>
      ),
      linkedin: (
        <div className={`${commonClass} from-blue-50 to-blue-100`}
          onClick={() => link && window.open(link, '_blank')}>
          <div className="text-7xl mb-2"><LinkedinIcon /></div>
          <p className="text-sm font-medium text-blue-700">LinkedIn Post</p>
        </div>
      ),
      documents: (
        <div className={`${commonClass} from-blue-50 to-blue-100 border-2 border-dashed border-blue-200`}>
          <div className="text-7xl mb-3">{getFileIcon(fileName)}</div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-blue-700 truncate w-full">
              {fileName || "Document"}
            </p>
            {fileSize && <p className="text-xs text-blue-600">{formatFileSize(fileSize)}</p>}
          </div>
        </div>
      ),
      other: (
        <div className={`${commonClass} from-gray-50 to-gray-100 border-2 border-dashed border-gray-200`}
          onClick={() => link && window.open(link, '_blank')}>
          <div className="text-7xl mb-3">🔗</div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-gray-700">Other Content</p>
            {link && <p className="text-xs text-gray-600 truncate w-full">{new URL(link).hostname}</p>}
          </div>
        </div>
      )
    };

    return fallbackThumbnails[type] || (
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

      <div className="relative w-full max-w-[900px] h-[600px] mx-4 rounded-3xl bg-white shadow-2xl border border-gray-300 flex flex-col sm:flex-row overflow-hidden z-10">

        {/* Close Button with CrossIcon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 rounded-full p-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-md z-20"
          onClick={onClose}
          aria-label="Close"
        >
          <CrossIcon/>
        </button>

        {/* Left: Embedded Content */}
        <div className="w-full sm:w-2/5 h-full bg-gray-50 overflow-auto p-4">
          {renderContent()}
        </div>

        {/* Right: Details */}
        <div className="w-full sm:w-3/5 h-full p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl flex-shrink-0">{getTypeIcon(type)}</span>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          </div>
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
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Open Link
                </a>
              )}
              {hasFile && (
                <button
                  onClick={handleFileDownload}
                  className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
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
