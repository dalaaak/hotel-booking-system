import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDriveFileRenameOutline } from "react-icons/md";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { FaPhoneVolume } from "react-icons/fa6";
import { BiObjectsHorizontalCenter } from "react-icons/bi";
import { MdOutlineMarkEmailRead } from "react-icons/md";

import './HotelManager.css'; // ملف CSS لتحسين التنسيق

const HotelManager = () => {
  const [hotels, setHotels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    mobile: '',
    email: '',
    status: 'Live',
    image: null,
    manager_username: '',
    manager_email: '',
  });
  const [editingHotel, setEditingHotel] = useState(null);
  const token = localStorage.getItem('token'); // استرجاع التوكن من LocalStorage

  useEffect(() => {
    fetchHotels();
  }, []);
  

  const fetchHotels = () => {
    axios.get("http://127.0.0.1:8000/user/api/hotels/", {
      headers: {
          "Authorization": `Bearer ${token}`
      }
  }) // الاتصال بـ API Django
      .then((response) => {
        console.log('Hotels fetched:', response.data);
        setHotels(response.data);
      })
      .catch((error) => console.error('Error fetching hotels:', error));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.manager_username || !formData.manager_email) {
      alert("Manager username and email are required!");
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        formDataObj.append(key, formData[key], formData[key].name);
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      if (editingHotel) {
        await axios.put(`/api/hotels/${editingHotel.hid}/`, formDataObj);
        alert('تم تعديل الفندق بنجاح!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/user/api/addhotel/', formDataObj, {
          headers: { 
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json'  // تحسين التوافق مع Django
          }
      });
      
        if (response.status === 201) {
          alert('تم إضافة الفندق بنجاح!');
          fetchHotels();
        } else {
          alert('حدث خطأ أثناء الإضافة!');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error while adding/updating hotel:', error);
      alert('حدث خطأ أثناء الإرسال!');
    }
  };

  const resetForm = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      mobile: '',
      email: '',
      status: 'Live',
      image: null,
      manager_username: '',
      manager_email: '',
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleDelete = (hotelId) => {
    console.log("🔍 Sending request with:", hotelId);

    const token = localStorage.getItem('token');
    if (!token) {
        alert("You must be logged in to delete a hotel.");
        return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذا الفندق؟')) {
        axios.delete("http://127.0.0.1:8000/user/api/delete/", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ hid: hotelId }) // إرسال المعرف داخل Body
        })
        .then((response) => {
            console.log("✅ Delete response:", response.data);
            fetchHotels();
            alert(response.data.message);
        })
        .catch((error) => console.error('🚫 Error deleting hotel:', error));
    }
};

  
  

  
  return (
    <div className="hotel-manager-container">
      <form onSubmit={handleSubmit} className="hotel-form">
        <h2>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>

        <label>
          <MdDriveFileRenameOutline /> Hotel Name
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          <TbPhotoSquareRounded /> Description
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>

        <label>
          <BiObjectsHorizontalCenter /> Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>

        <label>
          <FaPhoneVolume /> Mobile
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </label>

        <label>
          <MdOutlineMarkEmailRead /> Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Draft">Draft</option>
            <option value="Live">Live</option>
          </select>
        </label>

        <label>
          <TbPhotoSquareRounded /> Image
          <input type="file" name="image" onChange={handleChange} accept="image/*" />
        </label>

        <label>
          Manager Username
          <input type="text" name="manager_username" value={formData.manager_username} onChange={handleChange} required />
        </label>

        <label>
          Manager Email
          <input type="email" name="manager_email" value={formData.manager_email} onChange={handleChange} required />
        </label>

        <button type="submit">{editingHotel ? 'Update Hotel' : 'Add Hotel'}</button>
        {editingHotel && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <div className="hotel-list">
        <h4>Hotel List</h4>
        
        {hotels.map((hotel) => (
          <div key={hotel.hid} className="hotel-cardam">
             <img src={`http://127.0.0.1:8000${hotel.image}`} alt={hotel.name} className="hotel-imageam" />
            <div>
              <h3>{hotel.name}</h3>
              <p>{hotel.description}</p>
              <p><strong>Address:</strong> {hotel.address}</p>
              <p><strong>Contact:</strong> {hotel.mobile}</p>
              <p><strong>Email:</strong> {hotel.email}</p>
              
              <button onClick={() => setEditingHotel(hotel)}>Edit</button>
              <button onClick={() => handleDelete(hotel.hid)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelManager;
