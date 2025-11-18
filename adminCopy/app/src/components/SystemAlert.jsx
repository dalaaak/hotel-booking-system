import React, { useState, useEffect } from 'react';
import { FaTimes, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaBell } from 'react-icons/fa';
import './SystemAlert.css';

const SystemAlert = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Play sound based on notification type
    if (type === 'important') {
      // Play important notification sound
      const audio = new Audio('/sounds/important-notification.mp3');
      audio.play();
    } else {
      // Play normal notification sound
      const audio = new Audio('/sounds/normal-notification.mp3');
      audio.play();
    }
  }, [type]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <FaInfoCircle className="alert-icon" />;
      case 'important':
        return <FaExclamationTriangle className="alert-icon" />;
      case 'success':
        return <FaCheckCircle className="alert-icon" />;
      case 'warning':
        return <FaBell className="alert-icon" />;
      default:
        return <FaInfoCircle className="alert-icon" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`system-alert ${type}`}>
      <div className="alert-content">
        {getIcon()}
        <span className="alert-message">{message}</span>
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default SystemAlert; 