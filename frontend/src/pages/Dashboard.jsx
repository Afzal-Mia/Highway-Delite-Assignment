import React from 'react'
import { GlobalContext } from '../context/globalContext';
import { useContext } from 'react';

const Dashboard = () => {
  const {profileName}=useContext(GlobalContext);
  return (<>
    <div className="bg-amber-500">Dashboard</div>
    <h1>{profileName}</h1>
  </>
  )
}

export default Dashboard;