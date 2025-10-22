import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../component/Card";
import { Sidebar } from "../component/Sidebar";
import { BACKEND_URL } from "./config";

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
        setLoading(false);
      } catch (err) {
        setError("Failed to load content");
        setLoading(false);
      }
    }

    fetchContent();
  }, [hash]);

  const filteredContent =
    selectedType === "all"
      ? content
      : content.filter((item) => item.type === selectedType);

  return (
    <div className="flex min-h-screen bg-orange-400">
      {/* Sidebar */}
      <Sidebar onSelectType={(type) => setSelectedType(type)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 px-4 py-6 overflow-y-auto max-h-screen">
        <div className="flex justify-center">
          <h1 className="text-2xl text-orange-100 font-bold text-center lg:text-left mb-4">
            Library of {username}
          </h1>
        </div>

        {loading && (
          <p className="text-white text-center text-lg">Loading...</p>
        )}
        {error && (
          <p className="text-red-600 text-center text-lg">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map(({ _id, title, link, type }) => (
              <Card
                key={_id ?? "default-id"}
                title={title ?? ""}
                link={link ?? ""}
                type={type ?? ""}
                contentId={_id ?? ""}
              />

            ))}
          </div>
        )}
      </div>
    </div>
  );
}
