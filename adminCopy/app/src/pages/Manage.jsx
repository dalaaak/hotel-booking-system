import { Link} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import RoomManagement from '../components/RoomManagement';
import Roomlist from '../components/Roomlist';
import Login from '../components/Login';
import Profile from '../components/Profile';
import SpecialOffers from '../components/SpecialOffers';


import HotelReports from '../components/HotelReports';
import NotificationCenter from '../components/NotificationCenter';

const Manage = () => {
  const [activeComponent, setActiveComponent] = useState('Room-Managment');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("user_role");

    if (!token || userRole !== "employee") {
      navigate("/login");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const renderComponent = () => {
    switch (activeComponent) {
     
          case 'Room-Managment':
          return <RoomManagement />;
          case 'Room-list':
          return <Roomlist />;
          case 'Login':
          return <Login />;
          case 'Profile':
          return <Profile />;
          case 'Special-Offers':
          return <SpecialOffers />;
                    case 'Hotel-Reports':
          return <HotelReports />;
          case 'Notifications':
          return <NotificationCenter />;
          default:
          return <Roomlist />;
    }
  };
  

  

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <div className='navbar'>
        <h1>Manage Dashboard</h1>
        
        
        <Link onClick={() => setActiveComponent('Room-Managment')} to="#">Room Managment
        </Link>
        <Link onClick={() => setActiveComponent('Room-list')} to="#">Room List
        </Link>
        <Link onClick={() => setActiveComponent('Special-Offers')} to="#">Special Offers
        </Link>
                <Link onClick={() => setActiveComponent('Hotel-Reports')} to="#">Hotel Reports 
                </Link>
                <Link onClick={() => setActiveComponent('Notifications')} to="#">Notifications
                </Link>
        <Link onClick={() => setActiveComponent('Login')} to="#">Login</Link>
        <Link onClick={() => setActiveComponent('Profile')} to="#">Profile</Link>
        
        <button onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className='content'>
        {renderComponent()}
      </div>
    </div>
  );
};

export default Manage;
