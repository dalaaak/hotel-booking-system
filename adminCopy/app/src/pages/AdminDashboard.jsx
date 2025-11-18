import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import HotelList from '../components/HotelList';
import HotelForm from '../components/HotelForm';
import HotelDetails from '../components/HotelDetails';
import Login from '../components/Login';
import Profile from '../components/Profile';
import OfferManagement from '../components/OfferManagement';
import AddManager from '../components/AddManager';
import Reports from '../components/Reports';
import NotificationDashboard from '../components/NotificationDashboard';
import NotificationSettings from '../components/NotificationSettings';
import SystemAlert from '../components/SystemAlert';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('hotelList');
  const [systemAlert, setSystemAlert] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("user_role");

    if (!token || userRole !== "admin") {
      navigate("/login"); // 🔹 تحويل المستخدم إلى صفحة تسجيل الدخول
    }
  }, []);

  const showSystemAlert = (message, type) => {
    setSystemAlert({ message, type });
  };

  const handleAlertClose = () => {
    setSystemAlert(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'hotelList':
        return <HotelList />;
      case 'hotelDetails':
        return <HotelDetails />;
      case 'hotelForm':
        return <HotelForm />;
      case 'Login':
        return <Login />;
      case 'Profile':
        return <Profile />;
      case 'offerManagement':
        return <OfferManagement />;
      case 'addManager':
        return <AddManager />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <NotificationDashboard />;
      case 'notificationSettings':
        return <NotificationSettings />;
      default:
        return <HotelList />;
    }
  };

  return (
    <div>
      {systemAlert && (
        <SystemAlert
          message={systemAlert.message}
          type={systemAlert.type}
          onClose={handleAlertClose}
        />
      )}
      <div className='navbar'>
        <h1>Admin Dashboard</h1>
        <Link onClick={() => setActiveComponent('hotelList')} to="#">Hotel List</Link>
        <Link onClick={() => setActiveComponent('hotelDetails')} to="#">Hotel Details</Link>
        <Link onClick={() => setActiveComponent('hotelForm')} to="#">Hotel Management</Link>
        <Link onClick={() => setActiveComponent('offerManagement')} to="#">Offer Management</Link>
        <Link onClick={() => setActiveComponent('addManager')} to="#">Add Manager</Link>
        <Link onClick={() => setActiveComponent('reports')} to="#">Reports</Link>
        <Link onClick={() => setActiveComponent('notifications')} to="#">Notifications</Link>
        <Link onClick={() => setActiveComponent('notificationSettings')} to="#">Notification Settings</Link>
        <Link onClick={() => setActiveComponent('Login')} to="#">Login</Link>
        <Link onClick={() => setActiveComponent('Profile')} to="#">Profile</Link>
      </div>
      <div className='content'>
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
