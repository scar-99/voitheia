import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Intro from './components/Intro';
import { useState, useEffect } from 'react';

import Home          from './pages/Home';
import Login         from './pages/Auth/Login';
import Register      from './pages/Auth/Register';
import Marketplace   from './pages/Marketplace/Marketplace';
import ProductDetail from './pages/Marketplace/ProductDetail';
import AddProduct    from './pages/Marketplace/AddProduct';
import Freelancing   from './pages/Freelancing/Freelancing';
import AddGig        from './pages/Freelancing/AddGig';
import ChatPage      from './pages/Chat/ChatPage';
import ChatInbox     from './pages/Chat/ChatInbox';
import Dashboard     from './pages/Dashboard/Dashboard';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  // Use session storage so intro only plays once per session
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('voitheia_intro_seen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('voitheia_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <AuthProvider>
      <SocketProvider>
        {showIntro ? (
          <Intro onComplete={handleIntroComplete} />
        ) : (
          <div className="fade-in-scale" style={{ animationDuration: '0.8s' }}>
            <BrowserRouter>
              <Navbar/>
              <Routes>
                <Route path="/"            element={<Home/>}/>
                <Route path="/login"       element={<Login/>}/>
                <Route path="/register"    element={<Register/>}/>
                <Route path="/marketplace" element={<Marketplace/>}/>
                <Route path="/marketplace/:id" element={<ProductDetail/>}/>
                <Route path="/sell"        element={<AddProduct/>}/>
                <Route path="/gigs"        element={<Freelancing/>}/>
                <Route path="/gigs/add"    element={<AddGig/>}/>
                <Route path="/chat"        element={<ChatInbox/>}/>
                <Route path="/chat/:chatId" element={<ChatPage/>}/>
                <Route path="/dashboard"   element={<Dashboard/>}/>
              </Routes>
              <Toaster position="top-right"/>
            </BrowserRouter>
          </div>
        )}
      </SocketProvider>
    </AuthProvider>
  );
}
