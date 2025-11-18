import React, { useState } from 'react';
import { 
  FaVolumeUp, 
  FaVolumeMute, 
  FaMobile, 
  FaEnvelope, 
  FaGift, 
  FaCalendarCheck, 
  FaCog, 
  FaNewspaper 
} from 'react-icons/fa';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    notificationTypes: {
      promotions: true,
      bookings: true,
      system: true,
      updates: true
    }
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleNotificationTypeToggle = (type) => {
    setSettings(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: !prev.notificationTypes[type]
      }
    }));
  };

  return (
    <div className="notification-settings">
      <h2>Notification Settings</h2>
      
      <div className="settings-section">
        <h3>General Settings</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={() => handleToggle('soundEnabled')}
            />
            {settings.soundEnabled ? <FaVolumeUp className="setting-icon" /> : <FaVolumeMute className="setting-icon" />}
            Enable Sound
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.vibrationEnabled}
              onChange={() => handleToggle('vibrationEnabled')}
            />
            <FaMobile className="setting-icon" />
            Enable Vibration
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notification Channels</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <FaEnvelope className="setting-icon" />
            Email Notifications
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            <FaMobile className="setting-icon" />
            Push Notifications
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notification Types</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationTypes.promotions}
              onChange={() => handleNotificationTypeToggle('promotions')}
            />
            <FaGift className="setting-icon" />
            Promotions and Offers
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationTypes.bookings}
              onChange={() => handleNotificationTypeToggle('bookings')}
            />
            <FaCalendarCheck className="setting-icon" />
            Booking Updates
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationTypes.system}
              onChange={() => handleNotificationTypeToggle('system')}
            />
            <FaCog className="setting-icon" />
            System Notifications
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationTypes.updates}
              onChange={() => handleNotificationTypeToggle('updates')}
            />
            <FaNewspaper className="setting-icon" />
            Updates and News
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings; 