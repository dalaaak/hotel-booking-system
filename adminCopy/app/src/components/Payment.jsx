import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
console.log("Token being sent:", token);

  const [paymentData, setPaymentData] = useState({
    bank: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  

  useEffect(() => {
    if (!location.state?.bookingDetails) {
      navigate('/');
      return;
    }
    setBookingDetails(location.state.bookingDetails);
  }, [location.state, navigate]);

  const banks = [
    'البنك الأهلي السعودي',
    'بنك الراجحي',
    'بنك الرياض',
    'البنك العربي الوطني',
    'بنك سامبا',
    'بنك الجزيرة'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };



const handleSubmit = async (token) => {
  console.log("Tokbeing sent:", token);
  if (!bookingDetails) {
    alert("Error: Booking details are missing!");
    return;
  }

  if (!token) {
    alert("Error: Authentication token missing!");
    return;
  }

  const bookingInfo = {
    hotel: bookingDetails.hotelId,
    hotelName: bookingDetails.hotelName,
    checkIn: bookingDetails.checkIn,
    checkOut: bookingDetails.checkOut,
    guests: bookingDetails.guests,
    totalPrice: bookingDetails.totalPrice
  };

  try {
    const response = await axios.post('http://localhost:8000/api/bookings/', bookingInfo, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // التأكد من تمرير التوكن الصحيح
      }
    });

    if (response.status === 201) {
      alert('تم تأكيد الدفع بنجاح!');
      navigate('/');
    } else {
      alert('حدث خطأ أثناء تأكيد الدفع!');
    }
  } catch (error) {
    console.error('خطأ أثناء الاتصال بالسيرفر:', error);
    alert('حدث خطأ في الاتصال بالسيرفر!');
  }
};



  if (!bookingDetails) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2><i className="fas fa-credit-card"></i> Payment details</h2>
        
        <div className="booking-summary">
          <h3><i className="fas fa-receipt"></i>  Booking Summary</h3>
          <p><i className="fas fa-hotel"></i> Hotel: {bookingDetails.hotelName}</p>
          <p><i className="fas fa-calendar-check"></i> Check In : {bookingDetails.checkIn}</p>
          <p><i className="fas fa-calendar-times"></i> Check Out : {bookingDetails.checkOut}</p>
          <p><i className="fas fa-users"></i> Number of guest : {bookingDetails.guests}</p>
          <p className="total-price"><i className="fas fa-money-bill-wave"></i> Total Price: ${bookingDetails.totalPrice}</p>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label><i className="fas fa-university"></i>  Choose the bank</label>
            <select 
              name="bank" 
              value={paymentData.bank}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose the bank</option>
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><i className="fas fa-credit-card"></i> Card number </label>
            <input
              type="text"
              name="cardNumber"
              placeholder="xxxx xxxx xxxx xxxx"
              value={paymentData.cardNumber}
              onChange={handleInputChange}
              required
              maxLength="19"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><i className="far fa-calendar-alt"></i> Expiry date </label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={handleInputChange}
                required
                maxLength="5"
              />
            </div>

            <div className="form-group">
              <label><i className="fas fa-lock"></i> code CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleInputChange}
                required
                maxLength="3"
              />
            </div>
          </div>

          <button 
  type="submit" 
  className="pay-button" 
  onClick={() => handleSubmit(token)}
>
  <i className="fas fa-check-circle"></i> Complete payment
</button>


        </form>
      </div>
    </div>
  );
};

export default Payment;