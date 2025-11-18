import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaFilter, FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaClock, FaUser, FaHotel, FaCalendarCheck, FaGift, FaExclamationTriangle } from 'react-icons/fa';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock data for notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'booking',
        icon: '✔️',
        message: 'تم تأكيد حجزك في فندق الأفق #123',
        time: 'منذ ساعتين',
        isRead: false,
        action: 'عرض التفاصيل',
        bookingId: '123'
      },
      {
        id: 2,
        type: 'offer',
        icon: '🔥',
        message: 'عرض خاص: خصم 20% على الإقامة لمدة أسبوع',
        time: 'منذ 3 ساعات',
        isRead: false,
        action: 'عرض العرض',
        offerId: '456'
      },
      {
        id: 3,
        type: 'alert',
        icon: '⚠️',
        message: 'تذكير: موعد تسجيل الخروج غداً الساعة 12 ظهراً',
        time: 'منذ 5 ساعات',
        isRead: true,
        action: 'تأكيد',
        bookingId: '789'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  const handleAction = (notification) => {
    switch (notification.type) {
      case 'booking':
        navigate(`/email-notification/${notification.bookingId}`);
        break;
      case 'offer':
        navigate(`/OffersClient`);
        break;
      case 'alert':
        // يمكن إضافة منطق خاص للتنبيهات هنا
        console.log('تم تأكيد التنبيه');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <FaCalendarCheck className="notification-icon booking" />;
      case 'offer':
        return <FaGift className="notification-icon offer" />;
      case 'alert':
        return <FaExclamationTriangle className="notification-icon alert" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>
          <FaBell className="header-icon" />
          الإشعارات
        </h2>
        <div className="notifications-actions">
          <button onClick={markAllAsRead} className="mark-all-read">
            <FaCheck /> تحديد الكل كمقروء
          </button>
          <div className="filter-dropdown">
            <FaFilter />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">الكل</option>
              <option value="booking">الحجوزات</option>
              <option value="offer">العروض</option>
              <option value="alert">التنبيهات</option>
            </select>
          </div>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${notification.type}`}
          >
            <div className="notification-content">
              <div className="notification-icon-container">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-details">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  <FaClock className="time-icon" />
                  {notification.time}
                </span>
              </div>
            </div>
            <div className="notification-actions">
              {!notification.isRead && (
                <button
                  className="mark-read-button"
                  onClick={() => markAsRead(notification.id)}
                >
                  <FaCheckCircle /> تحديد كمقروء
                </button>
              )}
              <button 
                className="action-button"
                onClick={() => handleAction(notification)}
              >
                {notification.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage; 