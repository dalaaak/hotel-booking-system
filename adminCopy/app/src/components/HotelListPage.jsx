// HotelListPage.js
import React, { useEffect, useState } from 'react';
import { hotelAPI } from '../services/api';

const HotelListPage = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await hotelAPI.getHotels();
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };

        fetchHotels();
    }, []);

    return (
        <div>
            <h2>Hotels</h2>
            <div className="hotel-list">
                {hotels.map(hotel => (
                    <div key={hotel.id} className="hotel-card">
                        <h3>{hotel.name}</h3>
                        <p>{hotel.address}</p>
                        <p>{hotel.city}, {hotel.state}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelListPage;
