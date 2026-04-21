import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';

import Home          from './pages/Home';
import Login         from './pages/Auth/Login';
import Register      from './pages/Auth/Register';
import Marketplace   from './pages/Marketplace/Marketplace';
import ProductDetail from './pages/Marketplace/ProductDetail';
import AddProduct    from './pages/Marketplace/AddProduct';
import Freelancing   from './pages/Freelancing/Freelancing';
import AddGig        from './pages/Freelancing/AddGig';
import ChatPage      from './pages/Chat/ChatPage';
import Dashboard     from './pages/Dashboard/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
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
            <Route path="/chat/:chatId" element={<ChatPage/>}/>
            <Route path="/dashboard"   element={<Dashboard/>}/>
          </Routes>
          <Toaster position="top-right"/>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
