// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaHotel, FaGift, FaUser, FaChartBar } from 'react-icons/fa';
import './Navbar.css'; 

const Navbar = ({ token }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        console.log("🔹 Navbar Token Received:", token); 
    }, [token]);
    useEffect(() => {
        // Mock data for unread notifications count
        const mockUnreadCount = 3;
        setUnreadCount(mockUnreadCount);
    }, []);

    return (
        <nav className="navbar1">
            <div className="navbar-brand">
                <FaHotel className="brand-icon" />
                <h2 className="navbar-logo">Haven Hotels</h2>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/Hotels" className="nav-link">
                        <FaHotel className="nav-icon" />
                        Hotels
                    </Link>
                </li>
                <li>
                    <Link to="/OffersClient" className="nav-link">
                        <FaGift className="nav-icon" />
                        Offers
                    </Link>
                </li>
                <li>
                    <Link to="/loginto" className="nav-link">
                        <FaUser className="nav-icon" />
                        Login
                    </Link>
                </li>
                <li>
                    <Link to="/Profile" className="nav-link">
                        <FaUser className="nav-icon" />
                        Profile
                    </Link>
                </li>
                <li>
                <Link to="/user-reports" className="nav-link" state={{ token }}>
    <FaChartBar className="nav-icon" />
    Reports
</Link>

                </li>
                <li>
                    <Link to="/notifications" className="notifications-link">
                        <FaBell className="nav-icon" />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
