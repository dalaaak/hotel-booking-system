  
import React, { useState } from 'react';
import { deleteHotel } from '../services/api';
import './Deletehotel.css'
const DeleteHotelForm = ({ onDelete }) => {
    const [hotelId, setHotelId] = useState('');

    const handleInputChange = (e) => {
        setHotelId(e.target.value);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this hotel?")) {
            await deleteHotel(hotelId);
            onDelete();  // استدعاء التحديث بعد الحذف
        }
    };

    return (
        <div className='button-b'>
           
            <input
                type="text"
                placeholder="Enter Hotel ID"
                value={hotelId}
                onChange={handleInputChange}
                style={{ marginRight: '10px' }}
            />
            <button
                type="button"
                onClick={handleDelete}
                style={{ backgroundColor:' #007F86' , color: 'white' }}
            >
                Delete
            </button>
        </div>
    );
};

export default DeleteHotelForm;
