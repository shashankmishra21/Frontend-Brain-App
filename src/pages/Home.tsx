import { Button } from '../component/Button'
import { Card } from '../component/Card'
import { CreateComponentModal } from '../component/CreateComponentModal'
import { Sidebar } from '../component/Sidebar'
import { useContent } from '../Hooks/useContent'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { useState } from 'react'


function Home() {

  const [refetch, setRefetch] = useState(false);
  const { contents, loading, error } = useContent(refetch);
  const [modalOpen, setModalOpen] = useState(false);
  // const contents = useContent();

  function handleContentCreated() {
    setRefetch(prev => !prev);
  }


  return (
    <div>
      <Sidebar />
      <div className='p-4 ml-72 min-h-screen bg-orange-400 border-1'>
        <CreateComponentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleContentCreated}
        />

        <div className="flex justify-end gap-4">
          <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} />
          <Button onClick={() => {
            setModalOpen(true)
          }} variant="primary" text="Add Content" startIcon={<PlusIcon />} />
        </div>


        {/*  Loading and Error UI */}
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}

        {/*  Show content when ready */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {contents.map(({ _id, title, link, type }) => (
              <Card
                key={_id}
                title={title}
                link={link}
                type={type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
