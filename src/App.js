import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import Login from './pages/auth/Login';
import PrivateRoute from "./pages/auth/PrivateRoute"
import ForgotPassword from "./pages/auth/ForgotPassword"

import AddImage from "./pages/AddImage.js"
import ManageTags from "./pages/ManageTags.js"
import Dashboard from "./pages/Dashboard.js"
import FullImage from "./pages/FullImage.js"

import ResponsiveAppBar from "./components/Navbar"
import React from "react"
import Signup from "./pages/auth/Signup"
import './App.css';
import AnonymousRoute from "./pages/auth/AnonymousRoute.js";
import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CssBaseline} from '@mui/material';
import EditImage from "./pages/EditImage.js";

export default function App() {
  const themeMode = localStorage.getItem('theme') || 'dark';
  localStorage.setItem('theme', themeMode);
  const [mode, setMode] = useState(themeMode);
  const safety = localStorage.getItem('safety') || 'blur';

  localStorage.setItem('safety', safety);

  const [safetyMode, setSafetyMode] = useState(safety);

  const myTheme= createTheme({
    palette:{
          mode: mode
    }
});
  return (
      <ThemeProvider theme={myTheme}>
      <CssBaseline/>
        <BrowserRouter>
        <>
        <ResponsiveAppBar 
        mode={mode} 
        setMode={setMode}
        safetyMode={safetyMode}
        setSafetyMode={setSafetyMode}
        />
      <Box
        component="main"
        sx={{ width: `calc(100% - 240px)`, ml: `240px` }}
      >
        <Routes basename='/index.html'>
          <Route exact path="/" element={<PrivateRoute><AddImage/></PrivateRoute>}/>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute><EditImage /></PrivateRoute>} />
          <Route path="gallery/:id" element={<PrivateRoute><FullImage /></PrivateRoute>} />
          <Route path="/tags" element={<PrivateRoute><ManageTags /></PrivateRoute>} />
          <Route path="/signup" element={<AnonymousRoute><Signup/></AnonymousRoute>}/>
          <Route path="/login" element={<AnonymousRoute><Login/></AnonymousRoute>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="*" element={<NoPage />} />
        </Routes>
        </Box>
  </>
        </BrowserRouter>

      </ThemeProvider>
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />, mountNode);