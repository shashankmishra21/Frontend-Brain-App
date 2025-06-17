import './App.css'
import { Button } from './component/Button'
import { Card } from './component/Card'
import { CreateComponentModal } from './component/CreateComponentModal'
import { Sidebar } from './component/Sidebar'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'
import { useState } from 'react'

function App() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div>
<Sidebar/>

    <div className='p-4 ml-72 min-h-screen bg-gray-200 border-4'>
      <CreateComponentModal open={modalOpen} onClose={() => {
        setModalOpen(false);
      }} />
      <div className="flex justify-end gap-4">
        <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} />
        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add Content" startIcon={<PlusIcon />} />
      </div>
      <div className='flex gap-4'>
        <Card type="twitter" link='https://x.com/mishrashashank_/status/1931409506245980404' title='first tweet' />

        <Card type="youtube" link='https://youtu.be/p2j6Wq57MEE?si=aeSp9SWjvSUGftw2' title='first video' />
      </div>
    </div>
    </div>
  )
}

export default App
