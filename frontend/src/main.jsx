import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';

import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';

import App from './App.jsx'
import '@picocss/pico';
import './index.css'
import Portfolio from './pages/Portfolio.jsx';
import PortfolioProject from './pages/PortfolioProject.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/project/:projectId" element={<PortfolioProject />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
