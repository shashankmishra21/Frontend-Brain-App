import { ShareIcon } from "../icons/ShareIcon";

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

// function getLinkedInEmbedURL(normalUrl: string): string | null {
//   const match = normalUrl.match(/activity-(\d+)/);
//   return match ? `https://www.linkedin.com/embed/feed/update/urn:li:share:${match[1]}` : null;
// }


export function Card({ title, link, type }: Cardprops) {
    return (

        <div className="bg-white shadow-sm rounded-lg p-4 m-4 border-slate-200 border max-w-78 min-h-48 min-w-72">
            <div className="flex justify-between">
                <div className="flex items-center text-md">
                    <div className="text-gray-500 pr-2">
                        <a href={link} target="_blank">
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

                {/* {type === "youtube" && <iframe className="w-full" src={link.replace("watch", "embed").replace("?v=", "/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>} */}

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
{/* 
                {type === "linkedin" && getLinkedInEmbedURL(link) && (
  <iframe
    src={getLinkedInEmbedURL(link)!}
    height="902"
    width="504"
    frameBorder="0"
    allowFullScreen
    title="LinkedIn Post"
    className="mx-auto"
  ></iframe>
)}
 */}


            </div>
        </div>
    )

}