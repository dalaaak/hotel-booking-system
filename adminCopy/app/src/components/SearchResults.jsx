// SearchResults.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResults.css';
import axios from 'axios';

export const sampleHotels = [
    {
        hid: '1',
        Country: 'Syria',

        name: 'Luxury Grand Hotel',
        country: 'Dubai',
        description: 'A luxurious hotel offering premium services and comfort.',
        address: '123 Main Street, Cityville',
        mobile: '+123456789',
        email: 'info@luxurygrandhotel.com',
        image: '/assets/images/h4.jpg',
        rating: 5,
        rooms: [
            {
                id: 1,
                type: 'Single',
                price: 100,
                available: true,
                image: '/assets/images/room1.jpg',
                description: 'Comfortable single room with modern amenities'
            }
        ]
    },
    {
        hid: '2',
        Country: 'Syria',
        name: 'Seaside Escape',
        country: 'Saudi Arabia',
        description: 'A beautiful seaside hotel with breathtaking ocean views.',
        address: '456 Beach Avenue, Coasttown',
        mobile: '+987654321',
        email: 'contact@seasideescape.com',
        image: '/assets/images/h7.jpg',
        rating: 4
        
    },
    {
        hid: '3',
        Country: 'Syria',
        name: 'Mountain Retreat',
        country: 'Egypt',
        description: 'A peaceful retreat nestled in the mountains.',
        address: '789 Summit Road, Mountaintop',
        mobile: '+192837465',
        email: 'stay@mountainretreat.com',
        image: '/assets/images/h9.jpg',
        rating: 4
    }
];

const SearchResults = ({ results = sampleHotels, searchQuery }) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    const query = searchQuery || '';

    const handleAddComment = (hotelId) => {
        if (!newComment.trim()) return;
        
        const currentDate = new Date();
        const newCommentObj = {
            text: newComment,
            username: "User",
            timestamp: currentDate.toLocaleString(),
        };

        setComments(prev => ({
            ...prev,
            [hotelId]: [...(prev[hotelId] || []), newCommentObj]
        }));
        setNewComment('');
    };




const handleViewRooms = async (hotelId) => {
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/display_rooms_user/", {
            
            params: { hotel_id: hotelId }, // إرسال hotelId كجزء من الطلب
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log("Hotel ID before request:", hotelId);  // تأكد من أن hotelId يحتوي على رقم صحيح


        const { hotel, rooms } = response.data;

        localStorage.setItem('currentHotel', JSON.stringify(hotel));
        localStorage.setItem('rooms', JSON.stringify(rooms));

        navigate(`/hotel/${hotelId}/rooms`);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
};



    const filteredResults = results.filter(hotel => {
        return (
            hotel.name.toLowerCase().includes(query.toLowerCase()) ||
            hotel.description.toLowerCase().includes(query.toLowerCase()) ||
            hotel.address.toLowerCase().includes(query.toLowerCase())
        );
    });

    return (
        <div className="hotel-list-container1">
            <section className="hotel-grid1">
                {filteredResults.length > 0 ? (
                    filteredResults.map(hotel => (
                        <div key={hotel.hid} className="hotel-card1">
                            <img src={`http://127.0.0.1:8000${hotel.image}`} alt={hotel.name} className="hotel-image1" />
                            <div className="hotel-info1">
                                <h2>{hotel.name}</h2>
                                <p className="country">Country: {hotel.country}</p>
                                <p>{hotel.description}</p>
                                <p><strong>Address:</strong> {hotel.address}</p>
                                <p><strong>Mobile:</strong> {hotel.mobile}</p>
                                <p><strong>Email:</strong> {hotel.email}</p>
                                
                                <button 
                                    className="view-rooms-btn" 
                                    onClick={() => handleViewRooms(hotel.slug)}
                                >
                                    View Available Rooms
                                </button>

                                <div className="comments-section">
                                    <h3>Comments</h3>
                                    <div className="comments-list">
                                        {comments[hotel.hid]?.map((comment, index) => (
                                            <div key={index} className="comment">
                                                <p className="comment-text">{comment.text}</p>
                                                <p className="comment-meta">
                                                    By {comment.username} in {comment.timestamp}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="add-comment">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add comments..."
                                        />
                                        <button onClick={() => handleAddComment(hotel.hid)}>
                                            Add comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p> No result</p>
                )}
            </section>
        </div>
    );
};

export default SearchResults;
