import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthenticationPage from './pages/AuthenticationPage';

const App = () => {
    return (
       <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
          </Routes>
       </>
    );
   };

export default App;