import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaHotel, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaStar, 
  FaFilePdf, 
  FaEdit, 
  FaTrash, 
  FaGift,
  FaBook,
  FaCreditCard,
  FaCommentDots,
  FaChartLine,
  FaEye,
  FaDownload,
  FaHistory
} from 'react-icons/fa';
import './UserReports.css';
import { useLocation } from "react-router-dom";

const UserReports = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const token = location.state?.token; 
  const [reviews, setReviews] = useState([]);

  const [editMode, setEditMode] = useState(null);  
  const [editedComment, setEditedComment] = useState("")

  const handleDeleteReview = (reviewId) => {
    axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}/delete/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        setReviews(reviews.filter(review => review.id !== reviewId));  // إزالة التعليق من الواجهة
    })
    .catch(error => console.error('Error deleting review:', error));
};

  const handleEditClick = (review) => {
        setEditMode(review.id);  
        setEditedComment(review.comment);  
    };


    const handleUpdateReview = (reviewId) => {
        axios.put(`http://127.0.0.1:8000/api/reviews/${reviewId}/update/`, 
            { comment: editedComment },
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
        .then(response => {
            setReviews(reviews.map(review => 
                review.id === reviewId ? { ...review, comment: editedComment } : review
            ));
            setEditMode(null);  
        })
        .catch(error => console.error('Error updating review:', error));
    };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};





    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/get_user_reviews/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Fetched User Reviews:", response.data);
            setReviews(response.data);
        })
        .catch(error => console.error('Error fetching user reviews:', error));
    }, [token]);
  

  // Mock data - replace with actual API calls
useEffect(() => {
    if (!token) {
        console.error("No authentication token found!");
        return;
    }

    if (activeTab === 'bookings') {  // التأكد من أن الطلب يتم فقط عند الضغط على التاب
        axios.get('http://127.0.0.1:8000/api/user-bookings/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("Fetched Bookings:", response.data); // طباعة البيانات لمتابعة الخطأ
            setBookings(response.data);
        })
        .catch(error => console.error('Error fetching bookings:', error));
    }
}, [token, activeTab]);  // إضافة `activeTab` لضمان إعادة تنفيذ الطلب عند تغييره



  const loyaltyPoints = {
    totalPoints: 500,
    pointsToNextLevel: 200,
    currentLevel: 'Silver',
    nextLevel: 'Gold'
  };

  const renderBookingsReport = () => (
    <div className="report-section">
      <div className="section-header">
        <FaBook className="section-icon" />
        <h2>Booking Reports</h2>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th><FaHotel /> Hotel Name</th>
            <th><FaCalendarAlt /> Booking Dates</th>
            <th>Room Number</th>
            <th><FaHistory /> Room Type</th>
            <th><FaMoneyBillWave /> Price</th>
            <th>Actions</th>
          </tr>
        </thead>
<tbody>
                    {bookings.map(booking => (
                        <tr key={booking.booking_id}>
                            <td>{booking.hotel_name}</td>
                            <td>{booking.check_in_date} - {booking.check_out_date}</td>
                            <td>{booking.room_numbers}</td>
                            <td>{booking.room_types}</td>
                            <td>${booking.room_price}</td>
                            <td>
                                <button className="action-btn view-btn">
                                    <FaEye /> View Details
                                </button>
                                <a href={booking.invoiceUrl} className="action-btn download-btn">
                                    <FaDownload /> Download Invoice
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </div>
  );

  const renderPaymentsReport = () => (
    <div className="report-section">
      <div className="section-header">
        <FaCreditCard className="section-icon" />
        <h2>Payment Reports</h2>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th><FaHistory /> before discount</th>
            <th><FaMoneyBillWave /> Amount</th>
            <th><FaCalendarAlt /> Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.before_discount}</td>
              <td>${booking.total}</td>
              <td>{booking.check_in_date}</td>
              <td>
                <a href={booking.invoiceUrl} className="action-btn download-btn">
                  <FaFilePdf /> Export PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReviewsReport = () => (
    <div className="report-section">
      <div className="section-header">
        <FaCommentDots className="section-icon" />
        <h2>My Reviews</h2>
      </div>
      <div className="reviews-list">
        {reviews.map(review => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <h3>{review.hotel_name}</h3>
                        <div className="rating">
                            <FaStar className="star-icon" />
                            {review.rating}/5
                        </div>
                    </div>

                    {editMode === review.id ? (
                        <textarea 
                            value={editedComment} 
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="edit-textarea"
                        />
                    ) : (
                        <p className="review-comment">{review.comment}</p>
                    )}

                    <div className="review-footer">
                        <span className="review-date">{formatDate(review.created_at)}</span>
                        <div className="review-actions">
                            {editMode === review.id ? (
                                <button className="action-btn save-btn" onClick={() => handleUpdateReview(review.id)}>
                                    Save
                                </button>
                            ) : (
                                <button className="action-btn edit-btn" onClick={() => handleEditClick(review)}>
                                    <FaEdit /> Edit
                                </button>
                            )}
                            <button className="action-btn delete-btn" onClick={() => handleDeleteReview(review.id)}>
                                    <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
      </div>
    </div>
  );

  const renderLoyaltyReport = () => (
    <div className="report-section">
      <div className="loyalty-card">
        <div className="loyalty-header">
          <FaGift className="loyalty-icon" />
          <h2>Loyalty Points</h2>
        </div>
        <div className="loyalty-details">
          <div className="points-info">
            <h3>Current Points</h3>
            <p className="total-points">{loyaltyPoints.totalPoints} points</p>
          </div>
          <div className="level-info">
            <h3>Current Level</h3>
            <p className="current-level">{loyaltyPoints.currentLevel}</p>
            <p className="next-level">
              {loyaltyPoints.pointsToNextLevel} points needed to reach {loyaltyPoints.nextLevel} level
            </p>
          </div>
          <div className="points-usage">
            <h3>How to Use Points</h3>
            <ul>
              <li>100 points = $50 discount on next booking</li>
              <li>200 points = Free room upgrade</li>
              <li>500 points = Free night stay</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-reports">
      <div className="reports-tabs">
<button
  className={activeTab === 'bookings' ? 'active' : ''}
  onClick={() => {
    setActiveTab('bookings');
    console.log("Active Tab Changed to:", 'bookings'); // تأكد أن التاب يتغير
  }}
>
  <FaBook className="tab-icon" />
  Bookings
</button>


        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          <FaCreditCard className="tab-icon" />
          Payments
        </button>
        <button
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => setActiveTab('reviews')}
        >
          <FaCommentDots className="tab-icon" />
          Reviews
        </button>
        <button
          className={activeTab === 'loyalty' ? 'active' : ''}
          onClick={() => setActiveTab('loyalty')}
        >
          <FaGift className="tab-icon" />
          Loyalty
        </button>
      </div>

      <div className="report-content">
        {activeTab === 'bookings' && renderBookingsReport()}
        {activeTab === 'payments' && renderPaymentsReport()}
        {activeTab === 'reviews' && renderReviewsReport()}
        {activeTab === 'loyalty' && renderLoyaltyReport()}
      </div>
    </div>
  );
};

export default UserReports; 