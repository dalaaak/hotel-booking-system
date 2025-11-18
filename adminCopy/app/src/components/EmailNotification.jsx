import React from 'react';
import { FaHotel, FaPhone, FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import './EmailNotification.css';

const EmailNotification = ({ notification }) => {
  const {
    bookingNumber,
    hotelName,
    checkInDate,
    checkOutDate,
    guestName,
    roomType,
    totalAmount
  } = notification;

  return (
    <div className="email-notification">
      <div className="email-header">
        <div className="hotel-logo">
          <FaHotel className="logo-icon" />
          <h1>Haven Hotels</h1>
        </div>
        <h2>تأكيد الحجز #{bookingNumber}</h2>
      </div>

      <div className="email-content">
        <div className="booking-details">
          <h3>تفاصيل الحجز</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">اسم الضيف:</span>
              <span className="value">{guestName}</span>
            </div>
            <div className="detail-item">
              <span className="label">الفندق:</span>
              <span className="value">{hotelName}</span>
            </div>
            <div className="detail-item">
              <span className="label">نوع الغرفة:</span>
              <span className="value">{roomType}</span>
            </div>
            <div className="detail-item">
              <span className="label">تاريخ الوصول:</span>
              <span className="value">{checkInDate}</span>
            </div>
            <div className="detail-item">
              <span className="label">تاريخ المغادرة:</span>
              <span className="value">{checkOutDate}</span>
            </div>
            <div className="detail-item">
              <span className="label">المبلغ الإجمالي:</span>
              <span className="value">{totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="cta-buttons">
          <a href={`/bookings/${bookingNumber}`} className="cta-button primary">
            عرض الحجز
          </a>
          <a href="https://wa.me/1234567890" className="cta-button secondary">
            <FaWhatsapp /> اتصل بالدعم
          </a>
        </div>

        <div className="cancellation-policy">
          <h4>سياسة الإلغاء</h4>
          <p>
            يمكن إلغاء الحجز مجاناً قبل 24 ساعة من تاريخ الوصول. 
            في حالة الإلغاء بعد ذلك، سيتم خصم رسوم إلغاء بنسبة 50% من المبلغ الإجمالي.
          </p>
        </div>
      </div>

      <div className="email-footer">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
        <div className="contact-info">
          <p>
            <FaPhone /> +1234567890
          </p>
          <p>support@havenhotels.com</p>
        </div>
      </div>
    </div>
  );
};

export default EmailNotification; 