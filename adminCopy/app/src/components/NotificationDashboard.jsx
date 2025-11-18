import React, { useState, useEffect } from 'react';
import { FaBell, FaChartLine, FaFilter, FaCalendarAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import './NotificationDashboard.css';

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    userType: '',
    notificationType: '',
    dateRange: ''
  });
  const [stats, setStats] = useState({
    todayCount: 0,
    openRate: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        userType: 'client',
        notificationType: 'promotion',
        message: 'Special offer: 20% off on weekend stays',
        date: '2024-04-30',
        opened: true
      },
      {
        id: 2,
        userType: 'hotel_manager',
        notificationType: 'system',
        message: 'New booking received',
        date: '2024-04-30',
        opened: false
      }
    ];
    setNotifications(mockNotifications);
    
    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todayNotifications = mockNotifications.filter(n => n.date === today);
    const openedCount = mockNotifications.filter(n => n.opened).length;
    
    setStats({
      todayCount: todayNotifications.length,
      openRate: (openedCount / mockNotifications.length) * 100
    });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filters.userType && notification.userType !== filters.userType) return false;
    if (filters.notificationType && notification.notificationType !== filters.notificationType) return false;
    if (filters.dateRange) {
      const notificationDate = new Date(notification.date);
      const today = new Date();
      const diffTime = Math.abs(today - notificationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filters.dateRange === 'today' && diffDays > 0) return false;
      if (filters.dateRange === 'week' && diffDays > 7) return false;
      if (filters.dateRange === 'month' && diffDays > 30) return false;
    }
    return true;
  });

  return (
    <div className="notification-dashboard">
      <div className="stats-container">
        <div className="stat-card">
          <FaBell className="stat-icon" />
          <h3>Today's Notifications</h3>
          <p>{stats.todayCount}</p>
        </div>
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <h3>Open Rate</h3>
          <p>{stats.openRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <FaUser className="filter-icon" />
          <select name="userType" value={filters.userType} onChange={handleFilterChange}>
            <option value="">All Users</option>
            <option value="client">Clients</option>
            <option value="hotel_manager">Hotel Managers</option>
          </select>
        </div>

        <div className="filter-group">
          <FaEnvelope className="filter-icon" />
          <select name="notificationType" value={filters.notificationType} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="promotion">Promotions</option>
            <option value="system">System Alerts</option>
            <option value="booking">Booking Updates</option>
          </select>
        </div>

        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <select name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      <div className="notifications-table">
        <table>
          <thead>
            <tr>
              <th><FaCalendarAlt className="table-icon" /> Date</th>
              <th><FaUser className="table-icon" /> User Type</th>
              <th><FaEnvelope className="table-icon" /> Type</th>
              <th><FaBell className="table-icon" /> Message</th>
              <th><FaChartLine className="table-icon" /> Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map(notification => (
              <tr key={notification.id}>
                <td>{notification.date}</td>
                <td>{notification.userType}</td>
                <td>{notification.notificationType}</td>
                <td>{notification.message}</td>
                <td>{notification.opened ? 'Opened' : 'Unopened'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationDashboard; 