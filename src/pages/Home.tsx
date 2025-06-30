import { Button } from '../component/Button';
import { Card } from '../component/Card';
import CreateComponentModal from '../component/CreateComponentModal';
import { useContent } from '../Hooks/useContent';
import { PlusIcon } from '../icons/PlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { useState } from 'react';
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

  function handleContentCreated() {
    setRefetch(prev => !prev);
  }

  const filteredContents = selectedType === "all"
    ? contents
    : contents.filter(content => content.type === selectedType);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-orange-400">
      {/* Sidebar (responsive with toggle) */}
      <Sidebar onSelectType={setSelectedType} />

      {/* Main content */}
      <div className="flex-1 lg:ml-0 overflow-y-auto max-h-screen">
        <CreateComponentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContentCreated}
        />

        {/* Top Buttons */}
        <div className="flex justify-end gap-4 p-4 mt-2 flex-wrap">
          {localStorage.getItem("token") ? (
            <>
              {/* Share Button */}
              <Button
                onClick={async () => {
                  const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                    share: true,
                  }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  // const shareUrl = `${response.data.shareLink}`;
                  const fullBackendLink = response.data.shareLink; // e.g., http://localhost:3000/api/v1/brain/share/abc123
                  const shareId = fullBackendLink.split("/").pop(); // gets 'abc123'

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
              // startIcon={<ShareIcon />}
              />

              {/* Add Content Button */}
              <Button
                onClick={() => setModalOpen(true)}
                variant="primary"
                text={
                  <>
                    <span className="hidden sm:inline">Add Content</span>
                    <span className="sm:hidden"><PlusIcon /></span>
                  </>
                }
              // startIcon={<PlusIcon />}
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


        {/* Loader & Error */}
        {loading && <div className='text-white text-xl font-semibold mt-8 text-center'>Loading...</div>}
        {error && <div className="text-white text-xl font-semibold mt-8 text-center">Hey! Please Sign In first</div>}

        {/* Content Cards */}
        {!loading && !error && (
          filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-0 m-0">
              {filteredContents.map(({ _id, title, link, type }) => (
                <Card
                  key={_id ?? "default-id"}
                  title={title ?? ""}
                  link={link ?? ""}
                  type={type ?? ""}
                  contentId={_id ?? ""}
                  onDelete={() => setRefetch(prev => !prev)}
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
