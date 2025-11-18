import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HotelDetails = () => {
  const { slug } = useParams(); // جلب قيمة slug من الرابط
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // جلب بيانات الفندق باستخدام slug
    axios.get(`http://127.0.0.1:8000/api/hotel/${slug}/`)
      .then(response => {
        setHotel(response.data); // تخزين بيانات الفندق في الحالة
      })
      .catch(error => {
        console.error('Error fetching hotel details:', error);
        setError('Failed to fetch hotel details.');
      });
  }, [slug]);

  if (error) {
    return <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!hotel) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', alignItems:'initial'}}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src={`http://127.0.0.1:8000${hotel.image}`} alt={hotel.name} style={{ width: '70%', borderRadius: '10px' }} />
        <h1 style={{ color: '#333', margin: '10px 0' }}>{hotel.name}</h1>
        <p style={{ color: '#666' }}>{hotel.description}</p>
      </header>
      <div className="auth-container1">
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#444', fontSize:'30px' }}>Contact Information</h2>
          <p><strong>Manager:</strong> {hotel.manager}</p>
          <p><strong>Manager Email:</strong> {hotel.manager_email}</p>
          <p><strong>Address:</strong> {hotel.address}</p>
          <p><strong>Phone:</strong> {hotel.mobile}</p>
          <p><strong>Email:</strong> {hotel.email}</p>
        </section>
      </div>

      <section>
        <h2 style={{ color: '#444' }}>Available Rooms</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {hotel.rooms && hotel.rooms.length > 0 ? (
            hotel.rooms.map(room => (
              <li
                key={room.rid}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  border: '3px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#eff6e9',
                }}
              >
                <p><strong>Price:</strong> ${room.p}</p>
                <p><strong>Description:</strong> {room.description}</p>
              </li>
            ))
          ) : (
            <p>No rooms available.</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default HotelDetails;




