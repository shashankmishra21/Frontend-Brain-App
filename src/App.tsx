import './App.css'
import { Signup } from "./pages/Signup"
import { Signin } from './pages/Signin'
import Home from "./pages/Home"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SharedPage from './pages/SharedPage'
function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/share/:hash" element={<SharedPage />} />
    </Routes>

  </BrowserRouter>

}

export default App
