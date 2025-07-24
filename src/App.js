import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import Dashboard from './Pages/Deshboard/Deshboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>

    </>
  );
}

export default App;
