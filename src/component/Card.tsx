import { useEffect, useState } from "react";
import { TrashIcon } from "../icons/TrashIcon";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../pages/config";

interface CardProps {
    title: string;
    link?: string;
    description?: string;
    type: 'linkedin' | 'twitter' | 'instagram' | 'youtube' | 'pinterest' | 'documents' | 'other';
    contentId: string;
    fileName?: string;
    fileSize?: number;
    hasFile?: boolean;
    downloadUrl?: string;
    onDeleteSuccess?: (deletedId: string) => void;
    readonly?: boolean;
}

// Utility functions
function extractYouTubeId(url: string): string | null {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
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

function getTypeIcon(type: string): string {
    const icons = {
        'youtube': '🔴', 'twitter': '🐦', 'linkedin': '💼',
        'instagram': '📷', 'pinterest': '📌', 'documents': '📄', 'other': '🔗'
    };
    return icons[type as keyof typeof icons] || '📄';
}

export function Card({ 
    title, 
    link, 
    description, 
    type, 
    contentId, 
    fileName,
    fileSize,
    hasFile,
    downloadUrl,
    onDeleteSuccess, 
    readonly = false 
}: CardProps) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [embedError, setEmbedError] = useState(false);

    useEffect(() => {
        // Instagram embed script
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

        // Twitter embed script
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

        // Pinterest embed script
        if (type === "pinterest" && !document.getElementById("pinterest-embed-script")) {
            const script = document.createElement("script");
            script.id = "pinterest-embed-script";
            script.src = "https://assets.pinterest.com/js/pinit.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, [type]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/content`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: JSON.stringify({ contentId }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Content deleted!");
                if (onDeleteSuccess) onDeleteSuccess(contentId);
            } else {
                toast.error(data.message || "Delete failed");
            }
        } catch (err) {
            console.error("Error deleting content:", err);
            toast.error("Something went wrong!");
        }
    };

    const handleFileDownload = () => {
        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        }
    };

    const renderContent = () => {
        const linkedinEmbedUrl = type === "linkedin" && link ? extractLinkedInEmbedURL(link) : null;
        const pinterestId = type === "pinterest" && link ? extractPinterestId(link) : null;

        switch (type) {
            // YouTube with real thumbnail
            case "youtube":
                if (link) {
                    const videoId = extractYouTubeId(link);
                    if (videoId) {
                        return (
                            <div className="w-full h-40 rounded-lg overflow-hidden">
                                <img 
                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                    alt="YouTube thumbnail"
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => window.open(link, '_blank')}
                                    onError={(e) => {
                                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                    }}
                                />
                            </div>
                        );
                    }
                }
                break;

            // Twitter embedded tweet
            case "twitter":
                if (link && !embedError) {
                    return (
                        <div className="w-full h-40 overflow-hidden rounded-lg bg-gray-50">
                            <blockquote 
                                className="twitter-tweet" 
                                data-width="100%" 
                                data-theme="light"
                                data-cards="hidden"
                                style={{ 
                                    margin: 0, 
                                    transform: 'scale(0.8)', 
                                    transformOrigin: 'top left',
                                    width: '125%'
                                }}
                            >
                                <a href={link.replace("x.com", "twitter.com")}></a>
                            </blockquote>
                        </div>
                    );
                }
                break;

            // LinkedIn embedded post
            case "linkedin":
                if (linkedinEmbedUrl && !embedError) {
                    return (
                        <div className="w-full h-40 overflow-hidden rounded-lg bg-gray-50">
                            <iframe
                                src={linkedinEmbedUrl}
                                className="w-full h-full border-none"
                                title="LinkedIn Post"
                                style={{ 
                                    transform: 'scale(0.8)', 
                                    transformOrigin: 'top left',
                                    width: '125%',
                                    height: '125%'
                                }}
                            ></iframe>
                        </div>
                    );
                }
                break;

            // Instagram embedded post
            case "instagram":
                if (link && !embedError) {
                    return (
                        <div className="w-full h-40 overflow-hidden rounded-lg bg-gray-50">
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink={link}
                                data-instgrm-version="14"
                                style={{
                                    margin: 0,
                                    transform: 'scale(0.7)',
                                    transformOrigin: 'top left',
                                    width: '143%',
                                    height: '143%'
                                }}
                            ></blockquote>
                        </div>
                    );
                }
                break;

            // Pinterest embedded pin
            case "pinterest":
                if (pinterestId && !embedError) {
                    return (
                        <div className="w-full h-40 overflow-hidden rounded-lg bg-gray-50 flex justify-center">
                            <iframe
                                src={`https://assets.pinterest.com/ext/embed.html?id=${pinterestId}`}
                                className="border-none"
                                title="Pinterest Pin"
                                style={{
                                    width: '236px',
                                    height: '320px',
                                    transform: 'scale(0.6)',
                                    transformOrigin: 'top center'
                                }}
                            ></iframe>
                        </div>
                    );
                }
                break;
        }

        // Fallback thumbnails for all types
        const commonClass = "w-full h-40 rounded-lg overflow-hidden bg-gradient-to-br shadow-sm flex flex-col items-center justify-center cursor-pointer";
        
        const fallbackThumbnails = {
            youtube: (
                <div className={`${commonClass} from-red-50 to-red-100`} onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2">🔴</div>
                    <p className="text-sm font-medium text-red-700">YouTube Video</p>
                </div>
            ),
            twitter: (
                <div className={`${commonClass} from-blue-50 to-blue-100`} onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2">🐦</div>
                    <p className="text-sm font-medium text-blue-700">Twitter Post</p>
                </div>
            ),
            linkedin: (
                <div className={`${commonClass} from-blue-50 to-blue-100`} onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2">💼</div>
                    <p className="text-sm font-medium text-blue-700">LinkedIn Post</p>
                </div>
            ),
            instagram: (
                <div className={`${commonClass} from-pink-50 to-pink-100`} onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2">📷</div>
                    <p className="text-sm font-medium text-pink-700">Instagram Post</p>
                </div>
            ),
            pinterest: (
                <div className={`${commonClass} from-red-50 to-red-100`} onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2">📌</div>
                    <p className="text-sm font-medium text-red-700">Pinterest Pin</p>
                </div>
            ),
            documents: (
                <div className={`${commonClass} from-blue-50 to-blue-100 border-2 border-dashed border-blue-200`}>
                    <div className="text-6xl mb-2">{getFileIcon(fileName)}</div>
                    <div className="text-center px-4">
                        <p className="text-sm font-medium text-blue-700 truncate w-full">
                            {fileName || "Document"}
                        </p>
                        {fileSize && <p className="text-xs text-blue-600">{formatFileSize(fileSize)}</p>}
                    </div>
                </div>
            ),
            other: (
                <div className={`${commonClass} from-gray-50 to-gray-100 border-2 border-dashed border-gray-200`} onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2">🔗</div>
                    <div className="text-center px-4">
                        <p className="text-sm font-medium text-gray-700">Other Content</p>
                        {link && <p className="text-xs text-gray-600 truncate w-full">{new URL(link).hostname}</p>}
                    </div>
                </div>
            )
        };

        return fallbackThumbnails[type as keyof typeof fallbackThumbnails];
    };

    return (
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 w-80 h-[520px] flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-200">
            {/* Header */}
            <div className="flex justify-between items-start p-4 pb-2 flex-shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{getTypeIcon(type)}</span>
                    <h3 className="font-semibold text-gray-800 truncate text-sm" title={title}>
                        {title}
                    </h3>
                </div>
                {!readonly && (
                    <button 
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0 transition-colors"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>

            {/* Content/Thumbnail */}
            <div className="px-4 pb-3 flex-shrink-0">
                {renderContent()}
            </div>

            {/* Description */}
            <div className="flex-1 px-4 pb-2 overflow-hidden min-h-0">
                {description ? (
                    <div className="h-full flex flex-col">
                        <div 
                            className={`text-sm text-gray-600 leading-relaxed ${
                                showFullDescription 
                                    ? 'overflow-y-auto flex-1 pr-2' 
                                    : 'line-clamp-3 overflow-hidden'
                            }`}
                        >
                            {description}
                        </div>
                        {description.length > 100 && (
                            <button 
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-blue-500 text-xs hover:underline mt-2 flex-shrink-0 self-start"
                            >
                                {showFullDescription ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 text-sm italic">No description</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t bg-gray-50 rounded-b-xl flex-shrink-0">
                <div className="flex gap-2">
                    {link && (
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-blue-600 transition-colors text-center font-medium"
                        >
                            🌐 Open Link
                        </a>
                    )}
                    {type === 'documents' && hasFile && downloadUrl && (
                        <button 
                            onClick={handleFileDownload}
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600 transition-colors font-medium"
                        >
                            📥 Download
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
