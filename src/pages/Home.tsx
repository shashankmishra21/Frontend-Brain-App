import { Button } from '../component/Button';
import { Card } from '../component/Card';
import CreateComponentModal from '../component/CreateComponentModal';
import { useContent } from '../Hooks/useContent';
import { PlusIcon } from '../icons/PlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './config';
import { Sidebar } from '../component/Sidebar';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, X } from 'lucide-react';

function Home() {
  const [refetch, setRefetch] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const { contents, loading, error } = useContent(refetch);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");

  // Decode username from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        const name = decodedPayload.username || decodedPayload.name || decodedPayload.email || "User";
        setUsername(name);
      } catch (e) {
        console.error('Error decoding token:', e);
        setUsername("User");
      }
    }
  }, []);

  function handleContentCreated() {
    setRefetch(prev => !prev);
  }

  // Filter by type
  const typeFilteredContents = selectedType === "all"
    ? contents
    : contents.filter(content => content.type === selectedType);

  // Filter by search query (title and description)
  const filteredContents = typeFilteredContents.filter(content => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const title = (content.title || "").toLowerCase();
    const description = (content.description || "").toLowerCase();

    return title.includes(query) || description.includes(query);
  });

  const clearSearch = () => setSearchQuery("");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">
      <Sidebar onSelectType={setSelectedType} />

      <div className="flex-1 lg:ml-0 overflow-y-auto max-h-screen">
        <CreateComponentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContentCreated}
        />

        {/* Greeting Section with Buttons */}
        <div className="flex items-center justify-between px-6 py-6 backdrop-blur-sm">
          <h1 className="text-3xl md:text-3xl font-semibold italic text-white">
            Hey <span className="bg-orange-100 bg-clip-text text-transparent">{username}</span>
          </h1>

          <div className="flex gap-4 flex-wrap">
            {localStorage.getItem("token") ? (
              <>
                <Button
                  onClick={async () => {
                    const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                      share: true,
                    }, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    });
                    const fullBackendLink = response.data.shareLink;
                    const shareId = fullBackendLink.split("/").pop();
                    const shareUrl = `${window.location.origin}/share/${shareId}`;
                    await navigator.clipboard.writeText(shareUrl);
                    toast.info("Link copied to clipboard!");
                  }}
                  variant="secondary"
                  text={
                    <>
                      <span className="hidden sm:inline">Share Library</span>
                      <span className="sm:hidden"><ShareIcon /></span>
                    </>
                  }
                />

                <Button
                  onClick={() => setModalOpen(true)}
                  variant="primary"
                  text={
                    <>
                      <span className="hidden sm:inline">Add Content</span>
                      <span className="sm:hidden"><PlusIcon /></span>
                    </>
                  }
                />
              </>
            ) : (
              <Button
                onClick={() => window.location.href = "/signin"}
                variant="primary"
                text="Sign In"
              />
            )}
          </div>
        </div>

        {/* Search Bar */}
        {localStorage.getItem("token") && !loading && !error && (
          <div className="px-6 py-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white/25 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="text-center text-white/70 text-sm mt-2">
                Found {filteredContents.length} result{filteredContents.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* Loader & Error */}
        {loading && <div className='text-white text-xl font-semibold mt-8 text-center'>Loading...</div>}
        {error && <div className="text-white text-xl font-semibold mt-8 text-center">Hey! Please Sign In first</div>}

        {/* Content Cards */}
        {!loading && !error && (
          filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-0 px-6 ml-1">
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
                />
              ))}
            </div>
          ) : (
            localStorage.getItem("token") && (
              <div className="text-white text-xl font-semibold mt-8 text-center">
                {searchQuery ? `No results found for "${searchQuery}" 🔍` : 'Your Library is empty 📁'}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Home;
