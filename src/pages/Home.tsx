import { Button } from '../component/Button';
import { Card } from '../component/Card';
import CreateComponentModal from '../component/CreateComponentModal';
import { useContent } from '../Hooks/useContent';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './config';
import { Sidebar } from '../component/Sidebar';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, X, Share2, Plus, Sparkles, Loader2 } from 'lucide-react';

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

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar onSelectType={setSelectedType} />

      <div className="flex-1 overflow-y-auto max-h-screen">
        <CreateComponentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContentCreated}
        />

        {/* ── Top Bar ── */}
        <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60">
          <div className="flex items-center justify-between px-6 py-4">

            {/* Greeting */}
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
                Welcome back
              </p>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight font-display">
                {username}
                <span className="text-blue-500">.</span>
              </h1>
            </div>

            {/* Actions */}
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-100 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => window.location.href = "/signin"}
                className="px-4 py-2 text-sm font-medium text-zinc-900 bg-white hover:bg-zinc-100 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* ── Search Bar ── */}
          {isLoggedIn && !loading && !error && (
            <div className="px-6 pb-4">
              <div className="relative">
                {searching
                  ? <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
                  : <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                }
                <input
                  type="text"
                  placeholder="Ask your knowledge base anything..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-blue-500/50 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search meta */}
              {searchQuery && !searching && (
                <p className="text-xs text-zinc-600 mt-2 px-1">
                  {filteredContents.length} result{filteredContents.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── AI Answer ── */}
        {aiAnswer && !searching && (
          <div className="px-6 pt-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                </div>
                <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">
                  BrainCache AI
                </p>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{aiAnswer}</p>
            </div>
          </div>
        )}

        {/* ── Content Area ── */}
        <div className="px-6 py-5">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
              <p className="text-sm text-zinc-600">Loading your library...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <p className="text-sm text-zinc-500">Please sign in to view your library.</p>
              <button
                onClick={() => window.location.href = "/signin"}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in →
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && !error && filteredContents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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

          {/* Empty State */}
          {!loading && !error && filteredContents.length === 0 && isLoggedIn && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              {searchQuery ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Search className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-400 mb-1">No results found</p>
                    <p className="text-xs text-zinc-600">
                      Try a different query or{' '}
                      <button onClick={clearSearch} className="text-blue-400 hover:text-blue-300 transition-colors">
                        clear search
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-400 mb-1">Your library is empty</p>
                    <p className="text-xs text-zinc-600 mb-4">Start saving content to build your knowledge base</p>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Add your first note →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;