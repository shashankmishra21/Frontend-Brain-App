import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../component/Card";
import { SidebarWrapper } from "../component/SidebarWrapper";

export default function SharedPage() {
  const { hash } = useParams();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/brain/${hash}`);
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

  return (
    <div className="flex min-h-screen bg-orange-400">
      {/* Fixed Sidebar on large screens, overlay toggle on mobile */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-72 z-50">
        <SidebarWrapper onSelectType={() => {}} />
      </div>

      {/* Main Content */}
      <div className="w-full lg:ml-72 px-4 py-6">
        <h1 className="text-2xl text-orange-100 font-bold ml-4 mb-4 text-center lg:text-left">
          Library of {username}
        </h1>

        {loading && (
          <p className="text-white text-center text-lg">Loading...</p>
        )}
        {error && (
          <p className="text-red-600 text-center text-lg">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map(({ _id, title, link, type }) => (
              <Card key={_id} title={title} link={link} type={type} readonly={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
