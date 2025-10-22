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

function Home() {
  const [refetch, setRefetch] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const { contents, loading, error } = useContent(refetch);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("User");

  // Decode username from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // JWT token ke 3 parts hote hain: header.payload.signature
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        console.log('Decoded token:', decodedPayload);
        
        // Token me username field check karo
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

  const filteredContents = selectedType === "all"
    ? contents
    : contents.filter(content => content.type === selectedType);

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
          <h1 className="text-3xl md:text-4xl font-medium text-white">
            Hey <span className="text-white bg-clip-text text-transparent">{username} !</span>
          </h1>

          {/* Top Buttons */}
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

        {loading && <div className='text-white text-xl font-semibold mt-8 text-center'>Loading...</div>}
        {error && <div className="text-white text-xl font-semibold mt-8 text-center">Hey! Please Sign In first</div>}

        {!loading && !error && (
          filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6 px-6 ml-1">
              {filteredContents.map((content) => (
                <Card
                  key={content._id ?? "default-id"}
                  title={content.title ?? ""}
                  link={content.link ?? ""}
                  description={content.description}
                  type={content.type ?? ""}
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
                Your Library is empty 📁
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Home;
