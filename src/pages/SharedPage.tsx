import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../component/Card";
import { Sidebar } from "../component/Sidebar";
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
    <div className="flex">
      {/* Optional Sidebar */}
      <Sidebar onSelectType={() => {}} />

      <div className="p-4 ml-72 min-h-screen w-full bg-orange-400">
        <h1 className="text-2xl text-orange-100 font-bold ml-4 mb-4">Shared by {username}</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4">
            {content.map(({ _id, title, link, type }) => (
              <Card key={_id} title={title} link={link} type={type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
