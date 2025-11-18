import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaFilter, FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaClock, FaUser, FaHotel } from 'react-icons/fa';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [emergencyNotification, setEmergencyNotification] = useState(null);

  // Mock data for notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'booking',
        message: 'New Booking: Room 101 - Mr. Ahmed Mohamed',
        timestamp: new Date(),
        read: false,
        color: 'green'
      },
      {
        id: 2,
        type: 'cancellation',
        message: 'Booking Cancelled: Room 203 - Mrs. Sarah Ahmed',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        color: 'red'
      },
      {
        id: 3,
        type: 'service',
        message: 'Service Request: Room Cleaning - Room 305',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        color: 'blue'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Simulate emergency notifications
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      setEmergencyNotification({
        id: 999,
        type: 'emergency',
        title: 'Last-Minute Cancellation Alert',
        message: 'Emergency Cancellation: Room 401 - Mr. Mohamed Ali',
        details: {
          roomNumber: '401',
          guestName: 'Mr. Mohamed Ali',
          checkInDate: '2024-03-20',
          cancellationTime: new Date().toLocaleTimeString(),
          reason: 'Family Emergency',
          refundStatus: 'Pending'
        },
        timestamp: new Date(),
        color: 'red',
        priority: 'high'
      });
      setShowEmergencyPopup(true);
    }, 5000);

    return () => clearTimeout(emergencyTimeout);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  const handleNotificationAction = (notificationId, action) => {
    if (action === 'accept') {
      console.log('Accepted notification:', notificationId);
    } else if (action === 'reject') {
      console.log('Rejected notification:', notificationId);
    }
    
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleEmergencyAction = (action) => {
    if (action === 'process') {
      console.log('Processing emergency cancellation:', emergencyNotification.id);
      // Add logic to handle the cancellation
    } else if (action === 'contact') {
      console.log('Contacting guest:', emergencyNotification.details.guestName);
      // Add logic to contact the guest
    }
    setShowEmergencyPopup(false);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>
          <FaBell className="header-icon" />
          Notifications
        </h2>
        <div className="notification-actions">
          <button onClick={markAllAsRead} className="mark-all-read">
            <FaCheck /> Mark All as Read
          </button>
          <div className="filter-dropdown">
            <FaFilter />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="booking">Bookings</option>
              <option value="cancellation">Cancellations</option>
              <option value="service">Service Requests</option>
            </select>
          </div>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.color}`}
          >
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {notification.type === 'service' && !notification.read && (
              <div className="notification-actions">
                <button
                  className="action-button accept"
                  onClick={() => handleNotificationAction(notification.id, 'accept')}
                >
                  <FaCheckCircle /> Accept
                </button>
                <button
                  className="action-button reject"
                  onClick={() => handleNotificationAction(notification.id, 'reject')}
                >
                  <FaTimesCircle /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showEmergencyPopup && emergencyNotification && (
        <div className="emergency-popup">
          <div className="emergency-content">
            <div className="emergency-header">
              <FaExclamationCircle className="emergency-icon" />
              <h3>{emergencyNotification.title}</h3>
              <button
                className="close-emergency"
                onClick={() => setShowEmergencyPopup(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="emergency-body">
              <p className="emergency-message">{emergencyNotification.message}</p>
              <div className="emergency-details">
                <div className="detail-item">
                  <FaHotel className="detail-icon" />
                  <span>Room: {emergencyNotification.details.roomNumber}</span>
                </div>
                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <span>Guest: {emergencyNotification.details.guestName}</span>
                </div>
                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <span>Cancelled at: {emergencyNotification.details.cancellationTime}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reason:</span>
                  <span>{emergencyNotification.details.reason}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Refund Status:</span>
                  <span className={`status-${emergencyNotification.details.refundStatus.toLowerCase()}`}>
                    {emergencyNotification.details.refundStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="emergency-actions">
              <button
                className="emergency-button process"
                onClick={() => handleEmergencyAction('process')}
              >
                Process Cancellation
              </button>
              <button
                className="emergency-button contact"
                onClick={() => handleEmergencyAction('contact')}
              >
                Contact Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 