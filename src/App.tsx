import './App.css'
import { Signup } from "./pages/Signup"
import  Signin  from './pages/Signin'
// import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SharedPage from './pages/SharedPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/landingPage';

function App() {

  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/share/:hash" element={<SharedPage />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
    <ToastContainer position="top-center" autoClose={2000} />

  </BrowserRouter>

}

export default App
