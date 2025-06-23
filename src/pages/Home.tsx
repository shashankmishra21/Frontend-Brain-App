import { Button } from '../component/Button';
import { Card } from '../component/Card';
import { CreateComponentModal } from '../component/CreateComponentModal';

import { useContent } from '../Hooks/useContent';
import { PlusIcon } from '../icons/PlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { useState } from 'react';
import { BACKEND_URL } from './config';
import axios from 'axios';
import { SidebarWrapper } from '../component/SidebarWrapper';

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
      {/* Sidebar - show on larger screens */}
      <div className="hidden lg:block w-64 fixed top-0 left-0 h-full z-10">
        <SidebarWrapper onSelectType={setSelectedType} />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-72 p-0">
        <CreateComponentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContentCreated}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 p-4 mt-2 flex-wrap">
          {localStorage.getItem("token") ? (
            <>
              <Button
                onClick={async () => {
                  const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                    share: true
                  }, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                  });
                  const shareUrl = `${response.data.shareLink}`;
                  alert(shareUrl);
                }}
                variant="secondary"
                text="Share Library"
                startIcon={<ShareIcon />}
              />

              <Button
                onClick={() => setModalOpen(true)}
                variant="primary"
                text="Add Content"
                startIcon={<PlusIcon />}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-0">
              {filteredContents.map(({ _id, title, link, type }) => (
                <Card
                  key={_id}
                  title={title}
                  link={link}
                  type={type}
                  contentId={_id}
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
