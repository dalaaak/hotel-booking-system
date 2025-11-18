import React from 'react';
import { Link } from 'react-router-dom';
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaUserAlt, FaPercent, FaUsers, FaBriefcase, FaLock, FaHeadset, FaTag } from "react-icons/fa"
import './Actors.css';

const Actors = () => {
  return (
    <div className='home'>
      <section>
        <header className="header-banner">
          <img src="./assets/images/actors.jpg" alt="Phegon Hotel" className="header-image" />
          <div className="overlay"></div>
          <div className="animated-texts overlay-content">
            <h1>
              Welcome to <span className="phegon-color"> Haven</span>
            </h1>
            
            <h3>We have a system that helps you with easy, convenient and secure booking. 
            Dear customer, we welcome you and wish you an enjoyable booking experience</h3>
            <div className="logo-container">
              <img src="./assets/images/Hotel Logo2.png" alt="Haven Hotels Logo" className="welcome-logo" />
            </div>
          </div>
        </header>
      </section>

      <div className='butoon'>
        <button className='b-1'><MdAdminPanelSettings /> <Link to="/AdminDashboard">Admin Dashboard</Link> </button>
        <button className='b-1'> <MdOutlineAdminPanelSettings /> <Link to="/Manager"> Hotel Manager</Link> </button>
        <button className='b-1'> <FaUserAlt />  <Link to="/Homepageclient">Client</Link> </button>
        <button className='b-1'> <FaUserAlt /> <Link to="/login">Login</Link> </button> 
      </div>

      {/* قسم العروض والفعاليات */}
      <section className="offers-section2">
        <h2 className="section-title">Special Offers & Events</h2>
        
        <div className="offers-grid2">
          <div className="offer-card2">
            <img src="./assets/images/Summer Special.jpg" alt="Summer Offer" />
            <div className="offer-content2">
              <h3><FaPercent /> Summer Special</h3>
              <p>Get 20% off on all bookings during summer season. Enjoy our premium amenities including pool access and spa treatments.</p>
            </div>
          </div>

          <div className="offer-card2">
            <img src="./assets/images/Family Package.jpg" alt="Family Package" />
            <div className="offer-content2">
              <h3><FaUsers /> Family Package</h3>
              <p>Special family rooms with connecting doors. Kids eat free at our restaurants. Free access to kids club.</p>
            </div>
          </div>

          <div className="offer-card2">
            <img src="./assets/images/Business Travel.jpg" alt="Business Offer" />
            <div className="offer-content2">
              <h3><FaBriefcase /> Business Travel</h3>
              <p>Special rates for corporate bookings. Access to business center and meeting rooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المميزات */}
      <section className="features-section">
        <h2 className="section-title">Our Features</h2>
        
        <div className="features-grid">
          <div className="feature-item">
            <img src="./assets/images/Secure Booking.jpg" alt="Secure Booking" />
            <div className="feature-content">
              <h3><FaLock /> Secure Booking</h3>
              <p>Your security is our priority. Book with confidence using our encrypted payment system.</p>
            </div>
          </div>

          <div className="feature-item">
            <img src="./assets/images/247 Support.jpg" alt="24/7 Support" />
            <div className="feature-content">
              <h3><FaHeadset /> 24/7 Support</h3>
              <p>Our customer service team is available round the clock to assist you.</p>
            </div>
          </div>

          <div className="feature-item">
            <img src="./assets/images/price.jpg" alt="Best Price" />
            <div className="feature-content">
              <h3><FaTag /> Best Price Guarantee</h3>
              <p>Find a better price elsewhere? We'll match it and give you an additional 10% off.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Actors;