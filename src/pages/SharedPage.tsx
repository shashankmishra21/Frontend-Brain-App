import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"
import { Card } from "../component/Card"
import { Sidebar } from "../component/Sidebar"
import { BACKEND_URL } from "./config";

const geist = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as React.CSSProperties;

interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: "linkedin" | "twitter" | "instagram" | "youtube" | "pinterest" | "documents" | "other";
}

export default function SharedPage() {
  const { hash } = useParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
        setContent(res.data.content);
        setUsername(res.data.username);
      } catch {
        setError("This brain doesn't exist or the link has expired.");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [hash]);

  const filtered = selectedType === "all"
    ? content
    : content.filter((item) => item.type === selectedType);

  return (
    <div className="flex min-h-screen bg-black text-gray-200" style={geist}>

      {/* sidebarr */}
      <div className="sticky top-0 h-screen shrink-0">
        <Sidebar onSelectType={(type) => setSelectedType(type)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto px-6 py-5 lg:px-10">

        {/* Header */}
        <div className="mb-6">
          {!loading && !error && (
            <div className="ml-12 md:ml-0">
              <p className="text-sm md:text-lg text-green-500 uppercase tracking-widest mb-0 font-medium" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Cache of {username}'s brain
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">

              </h1>
              <p className="text-sm text-gray-200 mt-1">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
                {selectedType !== "all" && ` in ${selectedType}`}
              </p>
            </div>
          )}
        </div>

        {/* States */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Loading brain...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <p className="text-4xl mb-4">🔗</p>
              <p className="text-white font-semibold mb-1">Link not found</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              {/* <p className="text-3xl mb-3">icon</p> */}
              <p className="text-white font-medium">Nothing here yet</p>
              <p className="text-sm text-gray-500 mt-1">No {selectedType} content saved</p>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(({ _id, title, link, type }) => (
              <Card
                key={_id}
                title={title ?? ""}
                link={link ?? ""}
                type={type ?? ""}
                contentId={_id}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}