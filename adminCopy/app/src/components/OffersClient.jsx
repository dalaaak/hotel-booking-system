import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaInfoCircle, FaTag, FaUser, FaEnvelope } from 'react-icons/fa';
import './OffersClient.css';
import Navbar from './Navbar';

const OffersClient = () => {
    // In a real application, this data would come from an API or context
    // For now, we'll use the same dummy data as in OfferManagement
    const [offers, setOffers] = useState([
        {
            id: 1,
            name: "Special Ramadan Offer",
            type: "Seasonal Discount",
            startDate: "2024-03-10",
            endDate: "2024-04-10",
            conditions: "Discount applies to all products except electronics",
            image: "/assets/images/of1.jpg",
            discount: "30%"
        },
        {
            id: 2,
            name: "Weekend Offer",
            type: "Special Discount",
            startDate: "2024-03-15",
            endDate: "2024-03-17",
            conditions: "25% discount on clothes and shoes",
            image: "/assets/images/of2.jpg",
            discount: "25%"
        },
        {
            id: 3,
            name: "Capul",
            type: "Seasonal Offer",
            startDate: "2024-08-15",
            endDate: "2024-09-15",
            conditions: "30% discount on all school supplies",
            image: "/assets/images/room2.jpg",
            discount: "30%"
        },
        
    ]);

    const [selectedOffer, setSelectedOffer] = useState(null);

    const [subscriptionData, setSubscriptionData] = useState({
        offerName: '',
        username: '',
        email: ''
    });
    
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
    const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
    const [subscriptionTime, setSubscriptionTime] = useState(null);
    const [canCancel, setCanCancel] = useState(false);

    // التحقق من وقت الإلغاء كل دقيقة
    useEffect(() => {
        if (subscriptionTime) {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const subscriptionDate = new Date(subscriptionTime).getTime();
                const hoursPassed = (now - subscriptionDate) / (1000 * 60 * 60);
                
                if (hoursPassed >= 24) {
                    setCanCancel(false);
                }
            }, 60000);

            return () => clearInterval(timer);
        }
    }, [subscriptionTime]);

    const handleSubscribe = (e) => {
        e.preventDefault();
        setSubscriptionSuccess(true);
        setSubscriptionTime(new Date());
        setCanCancel(true);
        setShowSubscriptionForm(false);
    };

    const handleCancelSubscription = () => {
        setSubscriptionSuccess(false);
        setSubscriptionTime(null);
        setCanCancel(false);
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Check if an offer is active
    const isOfferActive = (offer) => {
        const currentDate = new Date();
        const startDate = new Date(offer.startDate);
        const endDate = new Date(offer.endDate);
        return currentDate >= startDate && currentDate <= endDate;
    };

    // Open offer details modal
    const openOfferDetails = (offer) => {
        setSelectedOffer(offer);
    };

    // Close offer details modal
    const closeOfferDetails = () => {
        setSelectedOffer(null);
    };

    // إضافة خيارات افتراضية للعروض
    const defaultOffers = [
        {
            id: 'premium',
            name: 'Premium Package',
            discount: '40%',
            description: 'Full access to all premium features'
        },
        {
            id: 'standard',
            name: 'Standard Package',
            discount: '25%',
            description: 'Access to standard features'
        },
        {
            id: 'basic',
            name: 'Basic Package',
            discount: '15%',
            description: 'Basic features access'
        }
    ];

    return (
        <div className="offers-client-container">
            <div className="offers-header">
                <h1>Special Offers</h1>
                <p>Take advantage of the latest available offers and discounts</p>
            </div>

            <div className="offers-filter">
                <button className="filter-btn active">All Offers</button>
                <button className="filter-btn">Active Offers</button>
                <button className="filter-btn">Upcoming Offers</button>
            </div>

            <div className="offers-grid">
                {offers.map((offer) => (
                    <div 
                        key={offer.id} 
                        className={`offer-card ${isOfferActive(offer) ? 'active-offer' : 'inactive-offer'}`}
                        onClick={() => openOfferDetails(offer)}
                    >
                        <div className="offer-image">
                            {/* Fallback image if the actual image is not available */}
                            <img 
                                src={offer.image || "https://via.placeholder.com/300x200?text=Special+Offer"} 
                                alt={offer.name} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/300x200?text=Special+Offer";
                                }}
                            />
                            <div className="offer-discount">{offer.discount}</div>
                        </div>
                        <div className="offer-content">
                            <h3>{offer.name}</h3>
                            <p className="offer-type">{offer.type}</p>
                            <div className="offer-dates">
                                <div>
                                    <FaCalendarAlt /> <span>{formatDate(offer.startDate)}</span>
                                </div>
                                <div>
                                    <FaCalendarCheck /> <span>{formatDate(offer.endDate)}</span>
                                </div>
                            </div>
                            <div className="offer-status">
                                {isOfferActive(offer) ? 
                                    <span className="active-badge">Active Now</span> : 
                                    <span className="inactive-badge">Inactive</span>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* قسم الاشتراك المستقل */}
            <div className="subscription-section">
                <h2>Subscribe to Offers</h2>
                <p>Welcome dear customer, please fill in the fields to subscribe to the offer</p>
                
                <div className="subscription-form-container">
                    <form onSubmit={handleSubscribe}>
                        <div className="form-group">
                            <label>
                                Offer Name
                                <FaTag className="field-icon-left" />
                            </label>
                            <select 
                                required
                                value={subscriptionData.offerName}
                                onChange={(e) => setSubscriptionData({
                                    ...subscriptionData,
                                    offerName: e.target.value
                                })}
                            >
                                <option value="">Select an Offer</option>
                                {/* خيارات العروض النشطة */}
                                {offers.filter(offer => isOfferActive(offer)).map(offer => (
                                    <option key={offer.id} value={offer.name}>
                                        {offer.name} - {offer.discount} Discount
                                    </option>
                                ))}
                                {/* الخيارات الافتراضية */}
                                <optgroup label="Default Packages">
                                    {defaultOffers.map(offer => (
                                        <option key={offer.id} value={offer.name}>
                                            {offer.name} - {offer.discount} Off - {offer.description}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Username
                                <FaUser className="field-icon-left" />
                            </label>
                            <input 
                                type="text" 
                                required
                                placeholder="Enter your username"
                                value={subscriptionData.username}
                                onChange={(e) => setSubscriptionData({
                                    ...subscriptionData,
                                    username: e.target.value
                                })}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Email Address
                                <FaEnvelope className="field-icon-left" />
                            </label>
                            <input 
                                type="email" 
                                required
                                placeholder="Enter your email"
                                value={subscriptionData.email}
                                onChange={(e) => setSubscriptionData({
                                    ...subscriptionData,
                                    email: e.target.value
                                })}
                            />
                        </div>
                        
                        <button type="submit" className="subscribe-btn">
                            Subscribe Now
                        </button>
                    </form>
                </div>

                {subscriptionSuccess && (
                    <div className="subscription-messages">
                        <div className="success-message">
                            Success! <FaInfoCircle className="message-icon-left" />
                            Offer details will be sent to your account
                        </div>
                        <div className="warning-message">
                            Note! <FaInfoCircle className="message-icon-left" />
                            You can cancel the subscription within 24 hours only. 
                            After that, the amount will be deducted without refund
                        </div>
                        {canCancel && (
                            <button 
                                className="cancel-btn"
                                onClick={handleCancelSubscription}
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                )}
            </div>

            
        </div>
    );
};

export default OffersClient;