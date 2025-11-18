import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaPercent, FaBed, FaArrowLeft, FaArrowRight, FaUser, FaEnvelope, FaTag } from 'react-icons/fa';
import './OfferManagement.css';

const HotelOffers = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    offerTitle: '',
    username: '',
    email: ''
  });
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [subscriptionTime, setSubscriptionTime] = useState(null);

  useEffect(() => {
    // Get hotel data from localStorage
    const storedHotel = JSON.parse(localStorage.getItem('currentHotel')) || 
                        JSON.parse(localStorage.getItem('hotels'))?.find(h => h.hid === hotelId);
    
    setHotel(storedHotel);

    // Mock data for hotel offers
    const mockOffers = [
      {
        id: 1,
        hotelId: hotelId,
        title: 'Summer Special',
        description: 'Get 20% off on all rooms during summer season. Enjoy your vacation with our premium services and amenities.',
        discount: '20%',
        startDate: '2023-06-01',
        endDate: '2023-08-31',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        isActive: true
      },
      {
        id: 2,
        hotelId: hotelId,
        title: 'Weekend Getaway',
        description: 'Book for 2 nights on weekends and get 1 night free. Perfect for a short break with family and friends.',
        discount: '1 night free',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        isActive: true
      },
      {
        id: 3,
        hotelId: hotelId,
        title: 'Early Bird Discount',
        description: 'Book 30 days in advance and get 15% off on your stay. Plan ahead and save more!',
        discount: '15%',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        isActive: true
      }
    ];
    
    setOffers(mockOffers);
    setLoading(false);
  }, [hotelId]);

  const handleSubscriptionChange = (e) => {
    setSubscriptionForm({
      ...subscriptionForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setShowCancelButton(true);
    setSubscriptionTime(new Date().getTime());
    alert('Details will be sent to your account\nNote: The cancel button will only appear for 24 hours, after which the amount will be deducted and your name will be placed without refund');
  };

  const handleCancel = () => {
    const currentTime = new Date().getTime();
    if (currentTime - subscriptionTime <= 24 * 60 * 60 * 1000) {
      setShowCancelButton(false);
      setSubscriptionTime(null);
      alert('Your subscription has been successfully cancelled');
    }
  };

  useEffect(() => {
    if (subscriptionTime) {
      const timer = setTimeout(() => {
        setShowCancelButton(false);
      }, 24 * 60 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [subscriptionTime]);

  if (loading) {
    return <div className="offer-management"><div className="loading"></div></div>;
  }

  if (!hotel) {
    return (
      <div className="offer-management">
        <h2>Hotel not found</h2>
        <Link to="/hotels" className="back-button">
          <button><FaArrowLeft /> Back to Hotels</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="offer-management">
      <h2>Special Offers for {hotel.name}</h2>
      <p>{hotel.description}</p>
      
      <Link to="/hotels" className="back-button">
        <button><FaArrowLeft /> Back to Hotels</button>
      </Link>
      
      <div className="offer-list">
        {offers.length === 0 ? (
          <p>No special offers available for this hotel at the moment.</p>
        ) : (
          offers.map(offer => (
            <div key={offer.id} className="offer-item">
              <div className="discount-badge">
                <FaPercent /> {offer.discount}
              </div>
              <img src={offer.imageUrl} alt={offer.title} />
              <h2>{offer.title}</h2>
              <p>{offer.description}</p>
              <p>
                <FaCalendarAlt /> <strong>Valid from:</strong> {offer.startDate} <strong>to</strong> {offer.endDate}
              </p>
              
            </div>
          ))
        )}
      </div>
      
      <div className="subscription-section">
        <h3>Subscribe to Offers</h3>
        <p>Welcome! Please fill in the fields below to subscribe to our offers</p>
        
        <form onSubmit={handleSubscribe} className="subscription-form">
          <div className="form-group">
            <label>
              <FaTag className="input-icon" />
              Select Offer:
            </label>
            <select
              name="offerTitle"
              value={subscriptionForm.offerTitle}
              onChange={handleSubscriptionChange}
              required
              className="offer-select"
            >
              <option value="">Select an offer</option>
              {offers.map(offer => (
                <option key={offer.id} value={offer.title}>
                  {offer.title} - {offer.discount} discount
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>
              <FaUser className="input-icon" />
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={subscriptionForm.username}
              onChange={handleSubscriptionChange}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={subscriptionForm.email}
              onChange={handleSubscriptionChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <button type="submit" className="subscribe-button">
            Subscribe
          </button>
          
          {showCancelButton && (
            <>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel Subscription <FaArrowRight />
              </button>
              <div className="cancel-message">
                <p>Note: The cancel button will only be available for 24 hours. After that, the amount will be deducted and your name will be placed without refund.</p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default HotelOffers; 