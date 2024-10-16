import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Video from './pages/Video/Video';
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [category, setCategory] = useState(0);

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Routes>
        <Route 
          path='/' 
          element={<Home sidebar={sidebar} category={category} setCategory={setCategory} />} 
        />
        <Route 
          path='/video/:categoryId/:videoId' 
          element={<Video sidebar={sidebar} />} 
        />
        {/* Redirect unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
