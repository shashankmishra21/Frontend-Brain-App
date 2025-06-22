import { Button } from '../component/Button';
import { Card } from '../component/Card';
import { CreateComponentModal } from '../component/CreateComponentModal';
import { Sidebar } from '../component/Sidebar';
import { useContent } from '../Hooks/useContent';
import { PlusIcon } from '../icons/PlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { useState } from 'react';
import { BACKEND_URL } from './config';
import axios from 'axios';

function Home() {
  const [refetch, setRefetch] = useState(false);
  const [selectedType, setSelectedType] = useState("all"); // 👈 filter state
  const { contents, loading, error } = useContent(refetch);
  const [modalOpen, setModalOpen] = useState(false);

  function handleContentCreated() {
    setRefetch(prev => !prev);
  }

  // 🧠 Filter contents based on selected type
  const filteredContents = selectedType === "all"
    ? contents
    : contents.filter(content => content.type === selectedType);

  return (
    <div>
      <Sidebar onSelectType={setSelectedType} /> {/* 👈 pass setter */}
      <div className='p-4 ml-72 min-h-screen bg-orange-400 border-1'>
        <CreateComponentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContentCreated}
        />

        <div className="flex justify-end gap-4">
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
            text="Share Brain"
            startIcon={<ShareIcon />}
          />

          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />
        </div>

        {/* Loader & Error */}
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}

        {/* Content cards */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {filteredContents.map(({ _id, title, link, type }) => (
              <Card key={_id} title={title} link={link} type={type} contentId={_id} onDelete={() => setRefetch(prev => !prev)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
