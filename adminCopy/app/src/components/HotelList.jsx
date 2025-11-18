import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // إضافة التوجيه
import axios from 'axios';
//import slugify from 'slugify';
import './HotelList.css'; // ملف CSS لتحسين التنسيق


const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // استرجاع التوكن من LocalStorage
  useEffect(() => {
    // جلب البيانات من الواجهة الخلفية
    axios.get("http://127.0.0.1:8000/user/api/hotels/", {
      headers: {
          "Authorization": `Bearer ${token}`
      }
  })
      .then(response => {
        const updatedHotels = response.data.map(hotel => ({
          ...hotel,
          slug: hotel.slug, // تخزين الـ slug
        }));
        setHotels(updatedHotels); // تخزين البيانات المحدثة في الحالة
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
        setError('Failed to fetch hotels');
      });
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotel-list-container1">
      <header className="hotel-header">
        <h1>Welcome to Our Hotel Directory</h1>
        <p>Find the best hotels tailored to your needs.</p>
      </header>

      <section className="hotel-grid1">
        {hotels.map(hotel => (
          <div key={hotel.hid} className="hotel-card1">
            <img src={`http://127.0.0.1:8000${hotel.image}`} alt={hotel.name} className="hotel-image1" />
            <div className="hotel-info1">
              <h2>{hotel.name}</h2>
              <p>{hotel.description}</p>
              <p><strong>Address:</strong> {hotel.address}</p>
              <p>
                <strong>Contact:</strong> 
                <i className="fas fa-phone"></i> {hotel.mobile}
              </p>
              <p>
                <strong>Email:</strong> 
                <i className="fas fa-envelope"></i> {hotel.email}
              </p>
              {/* رابط للتوجيه إلى صفحة تفاصيل الفندق */}
              <Link to={`/hotel/${hotel.slug}/`} className="view-details-link">View Details</Link>
            {/*  <Link to={`http://127.0.0.1:8000/api/hotel/${hotel.slug}/`} className="view-details-link">View Details</Link>*/}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HotelList;
