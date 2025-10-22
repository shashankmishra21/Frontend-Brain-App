import { useEffect, useState, type JSX } from "react";
import { TrashIcon } from "../icons/TrashIcon";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../pages/config";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { XIcon } from "../icons/XIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { OtherIcon } from "../icons/OtherIcon";
import { BiggerCard } from "./BiggerCard";

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

export function getTypeIcon(type: string): JSX.Element {
    const icons: Record<string, JSX.Element> = {
        youtube: <YoutubeIcon />,
        twitter: <XIcon />,
        linkedin: <LinkedinIcon />,
        instagram: <InstagramIcon />,
        documents: <DocumentIcon />,
        other: <OtherIcon />
    };

    return icons[type] || <DocumentIcon />;
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

    const [embedError] = useState(false);
    const [isExpanded] = useState(false);
    const [biggerCardOpen, setBiggerCardOpen] = useState(false);

    useEffect(() => {
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

    const renderContent = () => {
        const linkedinEmbedUrl = type === "linkedin" && link ? extractLinkedInEmbedURL(link) : null;
        const pinterestId = type === "pinterest" && link ? extractPinterestId(link) : null;

        const contentHeight = isExpanded ? 'auto' : '320px';

        switch (type) {
            case "youtube":
                if (link) {
                    const videoId = extractYouTubeId(link);
                    if (videoId) {
                        return (
                            <div className="w-full overflow-hidden rounded-lg shadow-sm relative"
                                style={{ height: isExpanded ? '400px' : '240px' }}>
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
                                        <span className="text-2xl">▶️</span>
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
                        <div className="w-full rounded-lg overflow-hidden bg-white border border-gray-200"
                            style={{ minHeight: '200px', padding: 0 }}>
                            <blockquote
                                className="twitter-tweet"
                                data-theme="light"
                                style={{ margin: 0 }}
                            >
                                <a href={canonicalLink}></a>
                            </blockquote>
                        </div>
                    );
                }
                break;

            case "instagram":
                if (link && !embedError) {
                    return (
                        <div className="w-full overflow-hidden rounded-lg bg-white border border-gray-200 flex justify-center"
                            style={{ height: isExpanded ? 'auto' : '350px', minHeight: '300px' }}>
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink={link}
                                data-instgrm-version="14"
                                style={{
                                    margin: '0 auto',
                                    transform: isExpanded ? 'scale(1)' : 'scale(0.9)',
                                    transformOrigin: 'top center',
                                    width: isExpanded ? '100%' : '111%',
                                    minHeight: isExpanded ? '500px' : '300px',
                                    maxWidth: '400px'
                                }}
                            ></blockquote>
                        </div>
                    );
                }
                break;

            case "linkedin":
                if (linkedinEmbedUrl && !embedError) {
                    return (
                        <div className="w-full overflow-hidden rounded-lg bg-white border border-gray-200"
                            style={{ height: isExpanded ? 'auto' : '300px', minHeight: '330px' }}>
                            <iframe
                                src={linkedinEmbedUrl}
                                className="w-full h-full border-none"
                                title="LinkedIn Post"
                                style={{
                                    transform: isExpanded ? 'scale(1)' : 'scale(0.95)',
                                    transformOrigin: 'top center',
                                    width: isExpanded ? '100%' : '105%',
                                    height: isExpanded ? '100%' : '105%'
                                }}
                            ></iframe>
                        </div>
                    );
                }
                break;

            case "pinterest":
                if (pinterestId && !embedError) {
                    return (
                        <div className="w-full overflow-hidden rounded-lg bg-white border border-gray-200 flex justify-center"
                            style={{ height: isExpanded ? 'auto' : '320px' }}>
                            <iframe
                                src={`https://assets.pinterest.com/ext/embed.html?id=${pinterestId}`}
                                className="border-none"
                                title="Pinterest Pin"
                                style={{
                                    width: isExpanded ? '350px' : '280px',
                                    height: '100%',
                                    transform: isExpanded ? 'scale(1)' : 'scale(0.9)',
                                    transformOrigin: 'top center'
                                }}
                            ></iframe>
                        </div>
                    );
                }
                break;

            case "documents":
                return (
                    <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-200 rounded-lg overflow-hidden"
                        style={{ height: isExpanded ? '300px' : '340px' }}>
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="text-6xl mb-3">{getFileIcon(fileName)}</div>
                            <div className="text-center w-full">
                                <p className="text-sm font-semibold text-blue-800 truncate w-full mb-1" title={fileName}>
                                    {fileName || "Document"}
                                </p>
                                {fileSize && (
                                    <p className="text-xs text-blue-600 mb-2">
                                        {formatFileSize(fileSize)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "other":
                return (
                    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                        style={{ height: isExpanded ? '220px' : '340px' }}
                        onClick={() => link && window.open(link, '_blank')}>
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="text-5xl mb-3">🔗</div>
                            <div className="text-center w-full">
                                <p className="text-sm font-medium text-gray-700 mb-1">Custom Content</p>
                                {link && (
                                    <p className="text-xs text-gray-600 truncate w-full" title={link}>
                                        {new URL(link).hostname}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }

        const commonClass = "w-full rounded-lg overflow-hidden bg-gradient-to-br shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow";

        const fallbackThumbnails = {
            youtube: (
                <div className={`${commonClass} from-red-50 to-red-100`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-7xl mb-3"><YoutubeIcon /></div>
                    <p className="text-sm font-medium text-red-700">YouTube Video</p>
                </div>
            ),
            twitter: (
                <div className={`${commonClass} from-blue-50 to-blue-100`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-7xl mb-3"><XIcon /></div>
                    <p className="text-sm font-medium text-blue-700">Twitter Post</p>
                </div>
            ),
            instagram: (
                <div className={`${commonClass} from-pink-50 to-pink-100`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-7xl mb-3"><InstagramIcon /></div>
                    <p className="text-sm font-medium text-pink-700">Instagram Post</p>
                </div>
            ),
            linkedin: (
                <div className={`${commonClass} from-blue-50 to-blue-100`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-7xl mb-2"><LinkedinIcon /></div>
                    <p className="text-sm font-medium text-blue-700">LinkedIn Post</p>
                </div>
            ),
            documents: (
                <div className={`${commonClass} from-blue-50 to-blue-100 border-2 border-dashed border-blue-200`}
                    style={{ height: contentHeight }}>
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
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-7xl mb-3">🔗</div>
                    <div className="text-center px-4">
                        <p className="text-sm font-medium text-gray-700">Other Content</p>
                        {link && <p className="text-xs text-gray-600 truncate w-full">{new URL(link).hostname}</p>}
                    </div>
                </div>
            )
        };

        return fallbackThumbnails[type as keyof typeof fallbackThumbnails];
    };

    const openBiggerCard = () => setBiggerCardOpen(true);
    const closeBiggerCard = () => setBiggerCardOpen(false);

    return (
        <>
            <div
                className={`bg-white shadow-lg rounded-xl border border-gray-200 w-80 h-[435px] flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 relative`}>
                <div className="flex justify-between items-start px-4 py-3 flex-shrink-0 bg-grey-100 border-b">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">{getTypeIcon(type)}</span>
                        <h3 className="font-semibold text-gray-800 truncate text-sm" title={title}>
                            {title}
                        </h3>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openBiggerCard();
                            }}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-sm font-semibold"
                            aria-label="View bigger content"
                        >
                            View
                        </button>
                        {!readonly && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="text-gray-500 text-red-600 p-1.5 rounded-full bg-red-50 transition-all duration-200"
                                aria-label="Delete content"
                            >
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-3 flex-shrink-0 relative">
                    {renderContent()}
                </div>
            </div>

            <BiggerCard
                open={biggerCardOpen}
                onClose={closeBiggerCard}
                title={title}
                description={description}
                type={type}
                link={link}
                fileName={fileName}
                fileSize={fileSize}
                hasFile={hasFile}
                downloadUrl={downloadUrl}
                contentId={contentId}  
            />

        </>
    );
}
