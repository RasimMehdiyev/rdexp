import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthenticationPage from './pages/AuthenticationPage';
import HomePage from './pages/HomePage';
import HeaderComponent from './components/HeaderComponent';
import { useLocation } from 'react-router-dom';
import SideBarComponent from './components/SideBarComponent';
import { useState } from 'react';
import TeamManagementPage from './pages/TeamManagementPage';
import RightSideBarComponent from './components/RightSidebarComponent';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from "./pages/EditProfilePage.js";
import NewGamePage from "./pages/NewEventPage.js";
import StickySubheaderComponent from "./components/StickySubheaderComponent.js";

const App = () => {

   // current link
   let location = useLocation();
   console.log(location.pathname)
   const [isOpen, setIsOpen] = useState(false);
   const [rightIsOpen, setRightIsOpen] = useState(false);
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
         <HeaderComponent isOpen={isOpen} toggleSidebar={setIsOpen} rightIsOpen={rightIsOpen} setRightIsOpen={setRightIsOpen}/>
         {
            location.pathname === "/game/create/" || location.pathname === "/game/create" ? 
            <StickySubheaderComponent/>
            :
            <div style={{display:'none'}}></div>
         }
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/auth" element={<AuthenticationPage />} />
               <Route path="/team-management" element={<TeamManagementPage/>} />
               <Route path="/profile" element={<ProfilePage />} />
               <Route path="/editProfile" element={<EditProfilePage />} />
               <Route path="/game/create" element={<NewGamePage/>}/>

            </Routes>
            {/* <SideBarComponent isOpen={isOpen}/> */}
            <RightSideBarComponent rightIsOpen={rightIsOpen}/>
         </>
      );
   }
}
export default App;