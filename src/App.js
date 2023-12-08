import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthenticationPage from './pages/AuthenticationPage';
import HomePage from './pages/HomePage';
import HeaderComponent from './components/HeaderComponent';
import TeamManagementPage from './pages/TeamManagementPage';
import RightSideBarComponent from './components/RightSidebarComponent';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from "./pages/EditProfilePage.js";
import EditTeamPage from './pages/EditTeamPage.js';
import NewGamePage from "./pages/NewEventPage.js";
import StickySubheaderComponent from "./components/StickySubheaderComponent.js";
import LogRocket from 'logrocket'
import GameOverview from './pages/GameOverview'; // Import GameOverview component
import TeamCreatePage from './pages/TeamCreatePage.js';
import GameSettings from './pages/GameSettings.js';
import { AboutClubPage } from './pages/AboutClubPage.js';
import TeamProfilePage from './pages/TeamProfilePage.js';
import StickySubheaderProfileComponent from './components/StickySubheaderProfileComponent.js';
import NoTeamPage from './pages/NoTeamPage.js';
import { useEffect } from 'react';
import NotificationPage from './pages/NotificationPage.js';


LogRocket.init('u7ityk/synthlete');

const App = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [rightIsOpen, setRightIsOpen] = useState(false);
   const location = useLocation();

     // Close sidebar on route change

   if ( location.pathname==='/club/create/settings' || location.pathname==='/club/create/settings/'  || location.pathname === '/team/create'  || location.pathname === '/team/create/' || location.pathname === '/club/create' || location.pathname === '/club/create/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/auth' || location.pathname === '/login/' || location.pathname === '/register/' || location.pathname === '/auth/'){
      return (
         <>
            <Routes>
               <Route path="/" element={<HomePage/>} />
               <Route path="/login" element={<LoginPage/>} />
               <Route path="/register" element={<RegisterPage/>} />
               <Route path="/auth" element={<AuthenticationPage/>} />
               <Route path="/game-overview" element={<GameOverview />} />
               <Route path="/team/create" element={<TeamCreatePage/>} />
               <Route path="/club/create" element={<AboutClubPage/>} />
               <Route path="/club/create/settings" element={<GameSettings/>} />
            </Routes>
         </>
      );
   } else {
      return (
         <>
         {  location.pathname !== '/team/create' || location.pathname !== '/team/create/' || location.pathname !== '/club/create' || location.pathname !== '/club/create/' ?
            <HeaderComponent rightIsOpen={rightIsOpen} setRightIsOpen={setRightIsOpen}/>
            :
            <div style={{display:'none'}}></div>
         }
         {
            location.pathname === "/game-overview/" || location.pathname === "/game-overview"  ? 
            <StickySubheaderComponent/>
            :
            <div style={{display:'none'}}></div>
         }
         
         {
            location.pathname === "/profile/" || location.pathname === "/profile" ? 
            <StickySubheaderProfileComponent/>
            :
            <div style={{display:'none'}}></div>
         }
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/auth" element={<AuthenticationPage />} />
               <Route path="/team-management" element={<TeamManagementPage />} />
               <Route path="/profile" element={<ProfilePage />} />
               <Route path="/profile/edit" element={<EditProfilePage />} />
               <Route path="/game/create" element={<NewGamePage />} />
               <Route path="/game-overview" element={<GameOverview />} />
               <Route path="/team/create" element={<TeamCreatePage/>} />
               <Route path="/club/create" element={<AboutClubPage/>} />
               <Route path="/club/create/settings" element={<GameSettings/>} />
               <Route path="/team-profile/:clubId/:teamId" element={<TeamProfilePage />} />
               <Route path="/team-profile/edit/:clubId/:teamId" element={<EditTeamPage/>} />
               <Route path="/no-team" element={<NoTeamPage/>} />
               <Route path="/notification" element={<NotificationPage />} />
            </Routes>
            <RightSideBarComponent rightIsOpen={rightIsOpen} setRightIsOpen={setRightIsOpen} />
         </>
      );
   }
}

export default App;
