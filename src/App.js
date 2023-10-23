import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthenticationPage from './pages/AuthenticationPage';
import HomePage from './pages/HomePage';
import HeaderComponent from './components/HeaderComponent';
import { useLocation } from 'react-router-dom';
import SideBarComponent from './components/SideBarComponent';
import { useState } from 'react';

const App = () => {

   // current link
   let location = useLocation();
   const [isOpen, setIsOpen] = useState(false);
   if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/auth' || location.pathname === '/login/' || location.pathname === '/register/' || location.pathname === '/auth/'){
    return (
       <>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
          </Routes>
       </>
    );
   }
   else{
      return (
         <>
         <HeaderComponent isOpen={isOpen} toggleSidebar={setIsOpen} />
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/auth" element={<AuthenticationPage />} />
            </Routes>
            <SideBarComponent isOpen={isOpen}/>
         </>
      );
   }
}
export default App;