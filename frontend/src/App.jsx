import React, { useEffect, useContext } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { GlobalContext } from './context/globalContext';

const App = () => {
  const { user } = useContext(GlobalContext);

  
  return (
    <>
      <Routes>
        <Route path="/" element={user ?<Dashboard /> :<Home />} />
        <Route path="/dashboard" element={user ? <Dashboard /> :<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
