import { Card } from '../component/Card';
import CreateComponentModal from '../component/CreateComponentModal';
import { useContent } from '../Hooks/useContent';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './config';
import { Sidebar } from '../component/Sidebar';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, X, Share2, Plus, Loader2 } from 'lucide-react';

function Home() {
  const [refetch, setRefetch] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const { contents, loading, error } = useContent(refetch);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiResults, setAiResults] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUsername(decoded.username || decoded.name || decoded.email || "User");
      } catch { setUsername("User"); }
    }
  }, []);

  function handleContentCreated() {
    setRefetch(prev => !prev);
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setAiAnswer(null);
    if (!query.trim()) { setAiResults(null); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/content/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await res.json();
      setAiResults(data.results || []);
      setAiAnswer(data.aiAnswer || null);
    } catch { setAiResults([]); }
    finally { setSearching(false); }
  };

  const filteredContents = aiResults !== null
    ? aiResults
    : (selectedType === "all" ? contents : contents.filter(c => c.type === selectedType));

  const clearSearch = () => { setSearchQuery(""); setAiResults(null); setAiAnswer(null); };

  const handleShare = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const shareId = response.data.shareLink.split("/").pop();
      const shareUrl = `${window.location.origin}/share/${shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    } catch { toast.error("Failed to share"); }
  };

  const isLoggedIn = !!localStorage.getItem("token");
//<div className="flex min-h-screen bg-zinc-950"></div>
  return (
  <div className="flex min-h-screen bg-gray-950 text-white">
    <Sidebar onSelectType={setSelectedType} />

    <div className="flex-1 overflow-y-auto max-h-screen">
      <CreateComponentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleContentCreated}
      />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between px-8 py-5">

          <div>
            <p className="text-xs text-white-500 uppercase tracking-widest">
              Welcome back
            </p>
            <h1 className="text-xl font-semibold text-white italic" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {username}
              <span className="text-green-400">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {isLoggedIn && (
              <>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg transition" style={{ fontFamily: "'Orbitron', sans-serif" }} >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-green-500 hover:bg-green-600 rounded-lg transition" style={{ fontFamily: "'Orbitron', sans-serif" }} >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => window.location.href = "/signin"}
                className="px-4 py-2 text-sm font-medium text-black bg-green-500 hover:bg-green-600 rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        {isLoggedIn && !loading && !error && (
          <div className="px-8 pb-6">
            <div className="relative max-w-xxl">

              {searching ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              )}

              <input
                type="text"
                placeholder="Ask your knowledge base..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 transition"
              />

              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searchQuery && !searching && (
              <p className="text-xs text-gray-500 mt-2">
                {filteredContents.length} result
                {filteredContents.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* AI Answer */}
      {aiAnswer && !searching && (
        <div className="px-8 pt-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                BrainCache AI
              </p>
            </div>
            <p className="text-sm text-gray-300">{aiAnswer}</p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="px-8 py-8">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">Loading your library...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center py-24">
            <p className="text-gray-400 mb-4">
              Please sign in to view your library
            </p>
            <button
              onClick={() => window.location.href = "/signin"}
              className="text-green-400 hover:text-green-300"
            >
              Sign in →
            </button>
          </div>
        )}

        {!loading && !error && filteredContents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredContents.map((content) => (
              <Card
                key={content._id ?? "default-id"}
                title={content.title ?? ""}
                link={content.link ?? ""}
                description={content.description}
                type={content.type as any}
                contentId={content._id ?? ""}
                fileName={content.fileName}
                fileSize={content.fileSize}
                hasFile={!!content.fileName}
                downloadUrl={content.downloadUrl}
                onDeleteSuccess={() => setRefetch(prev => !prev)}
                aiSummary={content.aiSummary}
                aiTags={content.aiTags}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default Home;