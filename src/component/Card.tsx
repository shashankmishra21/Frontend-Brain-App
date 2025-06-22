import { ShareIcon } from "../icons/ShareIcon";
import { useEffect } from "react";

interface Cardprops {
    title: string;
    link: string;
    type: string;
}

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

export function Card({ title, link, type }: Cardprops) {
    const linkedinEmbedUrl = type === "linkedin" ? extractLinkedInEmbedURL(link) : null;

    useEffect(() => {
        if (type === "instagram") {
            if (!document.getElementById("instagram-embed-script")) {
                const script = document.createElement("script");
                script.id = "instagram-embed-script";
                script.src = "https://www.instagram.com/embed.js";
                script.async = true;
                document.body.appendChild(script);
            } else {
                // @ts-ignore
                window.instgrm?.Embeds.process();
            }
        }
    }, [link, type]);

    return (
        <div className="bg-white shadow-sm rounded-lg p-4 m-4 border-slate-200 border max-w-78 min-h-48 min-w-72">
            <div className="flex justify-between">
                <div className="flex items-center text-md">
                    <div className="text-gray-500 pr-2">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            <ShareIcon />
                        </a>
                    </div>
                    {title}
                </div>
                <div className="flex items-center">
                    <div className="pr-2 text-gray-500">
                        <ShareIcon />
                    </div>
                    <div className="text-gray-500">
                        <ShareIcon />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex">
                {/* YouTube Embed */}
                {type === "youtube" && (
                    <iframe
                        className="w-full aspect-video"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(link)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                )}

                {/* Twitter Embed */}
                {type === "twitter" && (
                    <div className="w-full max-h-96 overflow-y-auto overflow-x-hidden">
                        <blockquote
                            className="twitter-tweet"
                            data-width="100%"
                            style={{ width: '100%', maxWidth: '100%', margin: 0 }}
                        >
                            <a href={link.replace("x.com", "twitter.com")}></a>
                        </blockquote>
                    </div>
                )}

                {/* LinkedIn Embed */}
                {linkedinEmbedUrl && (
                    <div className="w-full max-h-96 overflow-y-auto overflow-x-hidden">
                        <iframe
                            src={linkedinEmbedUrl}
                            style={{
                                width: '100%',
                                height: '384px',
                                maxWidth: '100%',
                                border: 'none',
                                margin: 0
                            }}
                            title="Embedded LinkedIn Post"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                {/* Instagram Embed */}
                {type === "instagram" && (
                    <div className="w-full max-h-96  overflow-y-auto overflow-x-hidden">
                        <blockquote
                            className="instagram-media"
                            data-instgrm-permalink={link}
                            data-instgrm-version="14"
                            style={{width: '100%',
                                height: '384px',
                                maxWidth: '100%',
                                border: 'none',
                                margin: 0 }}
                        ></blockquote>
                    </div>
                )}
            </div>
        </div>
    );
}
