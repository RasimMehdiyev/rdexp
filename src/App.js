import React, { useState, useEffect } from 'react';
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
import NewGamePage from "./pages/NewEventPage.js";
import StickySubheaderComponent from "./components/StickySubheaderComponent.js";
import LogRocket from 'logrocket'
import EventOverview from './pages/EventOverview';
import EventOverviewEdit from './pages/EventOverviewEdit';
import TeamCreatePage from './pages/TeamCreatePage.js';
import GameSettings from './pages/GameSettings.js';
import { AboutClubPage } from './pages/AboutClubPage.js';
import TeamProfilePage from './pages/TeamProfilePage.js';
import StickySubheaderProfileComponent from './components/StickySubheaderProfileComponent.js';
import NoTeamPage from './pages/NoTeamPage.js';
import NotificationPage from './pages/NotificationPage.js';
import EditTeamPage from './pages/EditTeamPage.js';
import Oops from './pages/OopsPage.js';
import ChangePasswordPage from './pages/ChangePasswordPage.js';
import { ForgottenPasswordPage } from './pages/ForgottenPasswordPage.js';

LogRocket.init('u7ityk/synthlete');

const App = () => {
   const [rightIsOpen, setRightIsOpen] = useState(false);
   const location = useLocation();

   const toggleSidebar = () => {
      setRightIsOpen(!rightIsOpen);
    };

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (!event.target.closest('.profile-dropdown')) {
         setRightIsOpen(false);
        }
      };
    
      document.body.addEventListener('click', handleOutsideClick);
    
      return () => {
        document.body.removeEventListener('click', handleOutsideClick);
      };
    }, []);
  

     // Close sidebar on route change

   if ( location.pathname==='/club/create/settings' || location.pathname==='/club/create/settings/'  || location.pathname === '/team/create'  || location.pathname === '/team/create/' || location.pathname === '/club/create' || location.pathname === '/club/create/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/auth' || location.pathname === '/login/' || location.pathname === '/register/' || location.pathname === '/auth/'){
      return (
         <>
            <Routes>
               <Route path="/" element={<HomePage/>} />
               <Route path="/login" element={<LoginPage/>} />
               <Route path="/register" element={<RegisterPage/>} />
               <Route path="/auth" element={<AuthenticationPage/>} />
               <Route path="/team/create" element={<TeamCreatePage/>} />
               <Route path="/club/create" element={<AboutClubPage/>} />
               <Route path="/club/create/settings" element={<GameSettings/>} />
               <Route path="/password/reset" element={<ForgottenPasswordPage/>}/>
               <Route path="*" element={<Oops/>} />
            </Routes>
         </>
      );
   } else {
      return (
         <>
         {  location.pathname !== '/team/create' || location.pathname !== '/team/create/' || location.pathname !== '/club/create' || location.pathname !== '/club/create/' ?
            <>
               <HeaderComponent toggleSidebar={toggleSidebar} />
               {rightIsOpen && <RightSideBarComponent toggleSidebar={toggleSidebar} />}
            </>
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

               <Route path="/event-overview/:eventId" element={<EventOverview />} />
               <Route path="/event-overview/edit/:eventId" element={<EventOverviewEdit />} />

               <Route path="/team/create" element={<TeamCreatePage/>} />
               <Route path="/club/create" element={<AboutClubPage/>} />
               <Route path="/club/create/settings" element={<GameSettings/>} />
               <Route path="/team-profile/:clubId/:teamId" element={<TeamProfilePage />} />

               <Route path="/team-profile/edit/:clubId/:teamId" element={<EditTeamPage/>} />
               <Route path="/no-team" element={<NoTeamPage/>} />
               <Route path="/notification" element={<NotificationPage />} />
               <Route path="/password/change" element={<ChangePasswordPage/>}/>
               <Route path="*" element={<Oops/>} />


            </Routes>
         </>
      );
   }
}   

export default App;
