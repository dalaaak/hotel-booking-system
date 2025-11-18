import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchForm from '../components/SearchForm';
import SearchResults, { sampleHotels } from '../components/SearchResults';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaBed, FaWifi, FaSwimmingPool, FaUtensils, FaCar, FaSpa, FaMountain, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHiking } from 'react-icons/fa';

import '../pages/Homepageclient.css'

const Homepageclient = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [hotels, setHotels] = useState([]);
    const token = localStorage.getItem('token'); // استرجاع التوكن من LocalStorage

    useEffect(() => {
        const fetchHotels = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://127.0.0.1:8000/user/api/hotels/", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotels();
    }, []); // تشغيل `useEffect` مرة واحدة فقط عند تحميل المكون




    
    const handleSearchSubmit = async (searchData) => {
        try {
            setIsLoading(true);
            const filteredResults = sampleHotels.filter(hotel => {
                const countryMatch = !searchData.country || 
                    hotel.country.toLowerCase().includes(searchData.country.toLowerCase());
                const nameMatch = !searchData.hotelName || 
                    hotel.name.toLowerCase().includes(searchData.hotelName.toLowerCase());
                return countryMatch && nameMatch;
            });
            
            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Error searching hotels:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="home">
            <Navbar />
            <div>
                <h1>Hotel Search</h1>
                <SearchForm onSubmitSearch={handleSearchSubmit} />
                {isLoading ? (
                    <p>جاري البحث...</p>
                ) : (
                    searchResults && <SearchResults results={searchResults} />
                )}
            </div>

            <h2 className="home-services">Overview of hotels in <span className="phegon-color">Haven </span></h2>
           <section className="service-section">
        {hotels.map(hotel => (
          <div key={hotel.hid} >
                       
                
                <div className="service-card">
                    <div className="hotel-image-container">
                        
                        
                        <img 
                           src={`http://127.0.0.1:8000${hotel.image}`}
                            alt="Mountain View Resort" 
                            className="hotel-image"
                        />
                        <div className="image-overlay"></div>
                        {hotel.featured && <div className="price-badge">SALE</div>}
                        <div className="rating">
                                        <span className="stars">
                {Array(hotel.stars).fill('★').join('')}
            </span>
                            <span className="rating-text">{hotel.stars}</span>
                        </div>
                        <div className="quick-info">
                            <h3>{hotel.name}</h3>
                            <div className="quick-info-tags">
                                <span className="info-tag"><FaMountain /> إطلالة جبلية</span>
                                <span className="info-tag"><FaHiking /> نشاطات خارجية</span>
                            </div>
                        </div>
                    </div>
                    <details>
                    <div className="service-details">
                        <h4><i className="fas fa-info-circle"></i> Hotel Description</h4>
                        <p className="service-description">
                           {hotel.description}
                        </p>

                        <h4><i className="fas fa-address-card"></i> Contact Information</h4>
                        <div className="contact-info">
                            <p><FaMapMarkerAlt className="contact-icon" /> {hotel.address}</p>
                            <p><FaPhone className="contact-icon" />  {hotel.mobile}</p>
                            <p><FaEnvelope className="contact-icon" /> {hotel.email}</p>
                        </div>
                       
                    </div>
                    </details>
                </div>
          
        
          </div>
        ))}

</section>












            <h2 className="home-services">Services <span className="phegon-color"> Haven</span></h2>

            <section className="services-list">
               
                <div className="service-icons">
                    <div className="service-item">
                        <FaBed />
                        <p>Comfort Beds</p>
                        
                    </div>
                    <div className="service-item">
                        <FaWifi />
                        <p>WiFi</p>
                    </div>
                    <div className="service-item">
                        <FaSwimmingPool />
                        <p>Swimming Pool</p>
                    </div>
                    <div className="service-item">
                        <FaUtensils />
                        <p>Luggage Storage</p>
                    </div>
                    <div className="service-item">
                        <FaCar />
                        <p>Private Bathroom</p>
                    </div>
                    <div className="service-item">
                        <FaSpa />
                        <p>Spa</p>
                    </div>
                   
                </div>
            </section>
            <h2 className="home-services">Features <span className="phegon-color">Haven </span></h2>
            <section className="image-gallery">
                <div className="image-item">
                    <img src="./assets/images/Office.jpg" alt="Hotels1" className="gallery-image" />
                    <p className="image-caption">We have special offers for businessmen,
                         with the possibility of booking a meeting room.

                   <h4>To contact us at: www.Haven.com</h4> </p>
                </div>
            
                <div className="image-item">
                    <img src="./assets/images/mm.jpg" alt="Hotels1" className="gallery-image" />
                    <p className="image-caption">When booking 10 times within our app, you will get a free adventure and camping ticket
                    <h4>To contact us at: www.Haven.com</h4>
                    </p>
                </div>
                <div className="image-item">
                    <img src="./assets/images/rom.jpg" alt="Hotels1" className="gallery-image" />
                    <p className="image-caption">There will be a special dinner for couples and unique and special for each customer .
                    <h4>To contact us at: www.Haven.com</h4>
                    </p>
                </div>
            </section>
           

            <div className="follow">
                <h2>Follow Us</h2>
                <p> We love to share new offers and exclusive </p>

                <div className="social-icons3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn />
                    </a>
                </div>

            </div>
<section>
                <header className="header-banner">
                    
                    
                    <img src="./assets/images/hotel.webp" alt="Phegon Hotel" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Welcome to <span className="phegon-color">Haven </span>
                        </h1><br />
                        <h3>We wish you a comfortable and useful booking experience</h3>
                        <div className="logo-container">
              <img src="./assets/images/Hotel Logo2.png" alt="Haven Hotels Logo" className="welcome-logo" />
            </div>
                    </div>
                </header>
            </section>
           
        </div>
    );
}

export default Homepageclient;
