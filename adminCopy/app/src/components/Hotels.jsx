import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Room from './Room';
import './HotelList.css';

const Hotels = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [ratings, setRatings] = useState({});
  const [commentImage, setCommentImage] = useState(null);

  const hotels = [
    {
      Country: 'Dubie',
      hid: '1',
      name: 'Luxury Grand Hotel',
      description: 'A luxurious hotel offering premium services and comfort.',
      address: '123 Main Street, Cityville',
      mobile: '+123456789',
      email: 'info@luxurygrandhotel.com',
      image: '/assets/images/h4.jpg',
      rooms: [
        {
          id: 1,
          type: 'Single',
          price: 100,
          available: true,
          image: '/assets/images/room1.jpg',
          description: 'Comfortable single room with modern amenities'
        },
        // ... المزيد من الغرف
      ]
    },
    {
      hid: '2',
      name: 'Seaside Escape',
      description: 'A beautiful seaside hotel with breathtaking ocean views.',
      address: '456 Beach Avenue, Coasttown',
      mobile: '+987654321',
      email: 'contact@seasideescape.com',
      image: '/assets/images/h7.jpg',
    },
    {
      hid: '3',
      name: 'Mountain Retreat',
      description: 'A peaceful retreat nestled in the mountains.',
      address: '789 Summit Road, Mountaintop',
      mobile: '+192837465',
      email: 'stay@mountainretreat.com',
      image: '/assets/images/h9.jpg',
    },
  ];

  const handleRating = (hotelId, rating) => {
    setRatings(prev => ({
      ...prev,
      [hotelId]: {
        value: rating,
        count: prev[hotelId]?.count ? prev[hotelId].count + 1 : 1,
        average: prev[hotelId]?.average 
          ? (prev[hotelId].average * prev[hotelId].count + rating) / (prev[hotelId].count + 1)
          : rating
      }
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddComment = (hotelId) => {
    if (!newComment.trim()) return;
    
    const currentDate = new Date();
    const newCommentObj = {
      text: newComment,
      username: "User",
      timestamp: currentDate.toLocaleString(),
      image: commentImage
    };

    setComments(prev => ({
      ...prev,
      [hotelId]: [...(prev[hotelId] || []), newCommentObj]
    }));
    setNewComment('');
    setCommentImage(null);
  };

  const handleViewRooms = (hotelId) => {
    const hotel = hotels.find(h => h.hid === hotelId);
    localStorage.setItem('currentHotel', JSON.stringify(hotel));
    navigate(`/hotel/${hotelId}/rooms`);
  };

  return (
    <div className="hotel-list-container1">
      <header className="hotel-header">
        <h1>Welcome to Our Hotel Directory</h1>
        <p>Find the best hotels tailored to your needs.</p>
      </header>

      <section className="hotel-grid1">
        {hotels.map(hotel => (
          <div key={hotel.hid} className="hotel-card1">
            <img src={hotel.image} alt={hotel.name} className="hotel-image1" />
            <div className="hotel-info1">
              <h2><i className="fas fa-hotel"></i> {hotel.name}</h2>
              <p><i className="fas fa-info-circle info-icon"></i> {hotel.description}</p>
              <p>
                <i className="fas fa-map-marker-alt location-icon"></i>
                <strong>Address:</strong> {hotel.address}
              </p>
              <p>
                <i className="fas fa-phone-alt phone-icon"></i>
                <strong>Contact:</strong> {hotel.mobile}
              </p>
              <p>
                <i className="fas fa-envelope email-icon"></i>
                <strong>Email:</strong> {hotel.email}
              </p>
              
              <div className="rating-section">
                <h3><i className="fas fa-star"></i> Rating</h3>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${ratings[hotel.hid]?.value >= star ? 'active' : ''}`}
                      onClick={() => handleRating(hotel.hid, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {ratings[hotel.hid] && (
                  <p>Average Rating: {ratings[hotel.hid].average.toFixed(1)} ({ratings[hotel.hid].count} reviews)</p>
                )}
              </div>

              <button 
                className="view-rooms-btn" 
                onClick={() => handleViewRooms(hotel.hid)}
              >
                <i className="fas fa-door-open"></i> View Available Rooms
              </button>
              
              <button 
                className="view-offers-btn" 
                onClick={() => navigate(`/hotel/${hotel.hid}/offers`)}
              >
                <i className="fas fa-gift"></i> View Special Offers
              </button>

              <div className="comments-section">
                <h3><i className="fas fa-comments"></i> Comments</h3>
                <div className="comments-list">
                  {comments[hotel.hid]?.map((comment, index) => (
                    <div key={index} className="comment">
                      {comment.image && (
                        <img 
                          src={comment.image} 
                          alt="Comment" 
                          className="comment-image"
                        />
                      )}
                      <p className="comment-text">{comment.text}</p>
                      <p className="comment-meta">
                        By {comment.username} on {comment.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="add-comment">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload"
                  />
                  {commentImage && (
                    <img 
                      src={commentImage} 
                      alt="Preview" 
                      className="image-preview"
                    />
                  )}
                  <button onClick={() => handleAddComment(hotel.hid)}>
                    <i className="fas fa-paper-plane"></i> Add Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hotels;
