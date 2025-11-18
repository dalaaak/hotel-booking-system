import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTag, FaClipboardList, FaCalendarAlt, FaCalendarCheck, FaPercent } from 'react-icons/fa';
import './OfferManagement.css';

const API_URL = "http://127.0.0.1:8000/user/api";


const OfferManagement = () => {
    const [offers, setOffers] = useState([]);
    const [newOffer, setNewOffer] = useState({
        name: '',
        offer_type: 'Black Friday', // Default value
        discount: '',
        start_date: '',
        end_date: '',
        conditions: ''
    });
    
const token = localStorage.getItem('token');
    // Fetch Offers

    useEffect(() => {
        if (token) {
            axios.get(`${API_URL}/get_offers/`, { headers: { 'Authorization': `Bearer ${token}` } })
                 .then(res => setOffers(res.data))
                 .catch(err => console.error("Error fetching offers:", err));
        }
    }, [token]);
    


    // Handle Form Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewOffer({ ...newOffer, [name]: value });
    };

    // Add Offer
    const addOffer = async () => {
        try {
            const response = await axios.post(`${API_URL}/create_offer/`, newOffer, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'  // Ensures Django compatibility
                }
            });
    
            setOffers([...offers, response.data]);  // Update state with new offer
            setNewOffer({ name: '', offer_type: 'Black Friday', discount: '', start_date: '', end_date: '', conditions: '' });
        } catch (error) {
            console.error("Error adding offer:", error);
        }
    };

    // Delete Offer
    const deleteOffer = (offerId) => {
        console.log("🔍 Sending request with:", offerId);
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to delete an offer.");
            return;
        }
        
    
        if (window.confirm('Are you sure you want to delete this offer?')) {
            console.log("Token:", token);
            axios.delete("http://127.0.0.1:8000/user/api/delete_offer/", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ id: offerId }) // Send ID inside Body
            })
            .then((response) => {
                console.log("✅ Delete response:", response.data);
                setOffers(offers.filter(offer => offer.id !== offerId)); // Update the list after deletion
                alert(response.data.message);
            })
            .catch((error) => console.error('🚫 Error deleting offer:', error));
        }
    };

    return (
        <div className="offer-management">
            <h1>Offer Management</h1>
            <div className="offer-form">
                <div><FaTag /> <input type="text" name="name" placeholder="Offer Name" value={newOffer.name} onChange={handleChange} /></div>
                <div>
                    <FaClipboardList /> 
                    <select name="offer_type" value={newOffer.offer_type} onChange={handleChange}>
                        <option value="Black Friday">Black Friday</option>
                        <option value="White Friday">White Friday</option>
                        <option value="Summer Start Offers">Summer Start Offers</option>
                        <option value="First-time Use Discount">First-time Use Discount</option>
                    </select>
                </div>
                <div><FaPercent /> <input type="text" name="discount" placeholder="Discount (%)" value={newOffer.discount} onChange={handleChange} /></div>
                <div><FaCalendarAlt /> <input type="date" name="start_date" value={newOffer.start_date} onChange={handleChange} /></div>
                <div><FaCalendarCheck /> <input type="date" name="end_date" value={newOffer.end_date} onChange={handleChange} /></div>
                <div><FaClipboardList /> <textarea name="conditions" placeholder="Offer Conditions" value={newOffer.conditions} onChange={handleChange}></textarea></div>
                <button onClick={addOffer}>Add Offer</button>
            </div>
            <div className="offer-list">
                {offers.map(offer => (
                    <div key={offer.id} className="offer-item">
                        <h2>{offer.name}</h2>
                        <p><strong>Type:</strong> {offer.offer_type}</p>
                        <p><strong>Discount:</strong> {parseFloat(offer.discount)}%</p>
                        <p><strong>Start Date:</strong> {offer.start_date.split('T')[0]}</p>
                        <p><strong>End Date:</strong> {offer.end_date.split('T')[0]}</p>
                        <p><strong>Conditions:</strong> {offer.conditions}</p>
                        <button className="b-d" onClick={() => deleteOffer(offer.id)}>Delete Offer</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfferManagement;
