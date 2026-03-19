import { useEffect, useState, type JSX } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../pages/config";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { XIcon } from "../icons/XIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { OtherIcon } from "../icons/OtherIcon";
import { BiggerCard } from "./BiggerCard";
import { motion } from "framer-motion";

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
    aiSummary?: string;
    aiTags?: string[];
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
    readonly = false,
    aiSummary,
    aiTags
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
                        <div className="w-full rounded-lg overflow-hidden bg-gray-900/80 border border-gray-800"
                            style={{ minHeight: '200px', padding: 0 }}>
                            <blockquote
                                className="twitter-tweet"
                                data-theme="dark"
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
                        <div className="w-full overflow-hidden rounded-lg bg-gray-900/80 border border-gray-800 flex justify-center"
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
                        <div className="w-full overflow-hidden rounded-lg bg-gray-900/80 border border-gray-800"
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
                        <div className="w-full overflow-hidden rounded-lg bg-gray-900/80 border border-gray-800 flex justify-center"
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
                    <div className="w-full bg-gray-900/80 border-2 border-dashed border-gray-800 rounded-lg overflow-hidden"
                        style={{ height: isExpanded ? '300px' : '340px' }}>
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="text-6xl mb-3">{getFileIcon(fileName)}</div>
                            <div className="text-center w-full">
                                <p className="text-sm font-semibold text-white truncate w-full mb-1" title={fileName}>
                                    {fileName || "Document"}
                                </p>
                                {fileSize && (
                                    <p className="text-xs text-gray-300 mb-2">
                                        {formatFileSize(fileSize)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "other":
                return (
                    <div className="w-full bg-gray-900/80 border-2 border-dashed border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-green-600 transition-colors"
                        style={{ height: isExpanded ? '220px' : '340px' }}
                        onClick={() => link && window.open(link, '_blank')}>
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="text-5xl mb-3">🔗</div>
                            <div className="text-center w-full">
                                <p className="text-sm font-medium text-white mb-1">Custom Content</p>
                                {link && (
                                    <p className="text-xs text-gray-300 truncate w-full" title={link}>
                                        {new URL(link).hostname}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }

        const commonClass = "w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/90 shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_18px_35px_-10px_rgba(34,197,94,0.45)]";

        const fallbackThumbnails = {
            youtube: (
                <div className={`${commonClass}`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-3 text-green-400"><YoutubeIcon /></div>
                    <p className="text-sm font-semibold text-white">YouTube</p>
                    <p className="text-xs text-gray-300">Video embed preview</p>
                </div>
            ),
            twitter: (
                <div className={`${commonClass}`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-3 text-green-400"><XIcon /></div>
                    <p className="text-sm font-semibold text-white">Twitter</p>
                    <p className="text-xs text-gray-300">Post embed preview</p>
                </div>
            ),
            instagram: (
                <div className={`${commonClass}`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-3 text-green-400"><InstagramIcon /></div>
                    <p className="text-sm font-semibold text-white">Instagram</p>
                    <p className="text-xs text-gray-300">Post embed preview</p>
                </div>
            ),
            linkedin: (
                <div className={`${commonClass}`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-6xl mb-2 text-green-400"><LinkedinIcon /></div>
                    <p className="text-sm font-semibold text-white">LinkedIn</p>
                    <p className="text-xs text-gray-300">Post embed preview</p>
                </div>
            ),
            documents: (
                <div className={`${commonClass} border-2 border-dashed border-gray-700`}
                    style={{ height: contentHeight }}>
                    <div className="text-7xl mb-3 text-green-300">{getFileIcon(fileName)}</div>
                    <div className="text-center px-4">
                        <p className="text-sm font-semibold text-white truncate w-full">
                            {fileName || "Document"}
                        </p>
                        {fileSize && <p className="text-xs text-gray-300">{formatFileSize(fileSize)}</p>}
                    </div>
                </div>
            ),
            other: (
                <div className={`${commonClass} border-2 border-dashed border-gray-700`}
                    style={{ height: contentHeight }}
                    onClick={() => link && window.open(link, '_blank')}>
                    <div className="text-7xl mb-3 text-green-300">🔗</div>
                    <div className="text-center px-4">
                        <p className="text-sm font-semibold text-white">Other Content</p>
                        {link && <p className="text-xs text-gray-300 truncate w-full">{new URL(link).hostname}</p>}
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -5 }}
                className="
        group relative w-full min-h-[320px] flex flex-col overflow-hidden
        rounded-2xl border border-gray-800
        bg-gray-950/80 backdrop-blur-sm
        hover:border-green-500/40
        transition-all duration-300
        shadow-sm hover:shadow-xl
      "
            >
                {/* subtle glow overlay */}
                <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300
        bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.08),transparent_40%)]
        pointer-events-none
      " />

                {/* HEADER */}
                <div className="relative z-10 flex justify-between items-center px-4 py-3 border-b border-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="text-gray-400 group-hover:text-green-400 transition">
                            {getTypeIcon(type)}
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white truncate">
                                {title}
                            </h3>

                            {description && (
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* VIEW */}
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.03 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openBiggerCard();
                            }}
                            className="
              px-3 py-1.5 text-xs font-medium rounded-full
              bg-green-600 text-white
              hover:bg-green-500
              transition
            "
                        >
                            View
                        </motion.button>

                        {/* DELETE */}
                        {!readonly && (
                            <motion.button
                                whileTap={{ scale: 0.96 }}
                                whileHover={{ scale: 1.03 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="
                px-3 py-1.5 text-xs font-medium rounded-full
                border border-red-400 text-red-400
                hover:text-red-400 hover:border-red-400
                transition
              "
                            >
                                Delete
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="relative z-10 p-4 flex-1">
                    <div className="
          w-full h-full rounded-xl overflow-hidden
          border border-gray-800
          bg-gradient-to-b from-gray-900 to-gray-950
        ">
                        {renderContent()}
                    </div>
                </div>

                {/* FOOTER */}
                {(aiSummary || aiTags?.length) && (
                    <div className="relative z-10 px-4 pb-4 pt-2 border-t border-gray-800 space-y-2">
                        {aiSummary && (
                            <p className="text-xs text-gray-400 line-clamp-2">
                                {aiSummary}
                            </p>
                        )}

                        {aiTags && (
                            <div className="flex flex-wrap gap-2">
                                {aiTags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="
                    text-[10px] px-2 py-1 rounded-full
                    bg-gray-800/80 text-gray-300
                    border border-gray-700
                    hover:border-green-500/40 hover:text-green-400
                    transition
                  "
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

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
                aiSummary={aiSummary}
                aiTags={aiTags}
            />
        </>
    );
}