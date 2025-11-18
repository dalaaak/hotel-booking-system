import React, { useState, useEffect } from 'react';
import { MdOutlineMarkEmailRead, MdEdit, MdDelete } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdHotel } from "react-icons/md";
import axios from 'axios';
import './AddManager.css';

const AddManager = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hotelId: ''
  });
  
  const [managers, setManagers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    fetchHotels();
    fetchManagers();
  }, []);

  const fetchHotels = () => {
    axios.get('/api/hotels/')
      .then(response => {
        setHotels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  };

  const fetchManagers = () => {
    axios.get('/api/managers/')
      .then(response => {
        setManagers(response.data);
      })
      .catch(error => {
        console.error('Error fetching managers:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      axios.put(`/api/managers/${editingId}`, formData)
        .then(response => {
          alert('Manager updated successfully!');
          resetForm();
          fetchManagers();
        })
        .catch(error => {
          console.error('Error updating manager:', error);
          alert('Error updating manager');
        });
    } else {
      axios.post('/api/managers/', formData)
        .then(response => {
          alert('Manager added successfully!');
          resetForm();
          fetchManagers();
        })
        .catch(error => {
          console.error('Error adding manager:', error);
          alert('Error adding manager');
        });
    }
  };

  const handleEdit = (manager) => {
    setIsEditing(true);
    setEditingId(manager.id);
    setFormData({
      email: manager.email,
      password: '', // Password field is cleared for security
      hotelId: manager.hotelId
    });
  };

  const handleDelete = (managerId) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      axios.delete(`/api/managers/${managerId}`)
        .then(response => {
          alert('Manager deleted successfully!');
          fetchManagers();
        })
        .catch(error => {
          console.error('Error deleting manager:', error);
          alert('Error deleting manager');
        });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      hotelId: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="add-manager-container">
      <h2>{isEditing ? 'Edit Manager' : 'Add New Manager'}</h2>
      
      <form onSubmit={handleSubmit} className="manager-form">
        <div className="form-group">
          <label>
            <MdOutlineMarkEmailRead className="icon" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <RiLockPasswordLine className="icon" />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>
            <MdHotel className="icon" />
            Select Hotel
          </label>
          <select
            name="hotelId"
            value={formData.hotelId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Hotel --</option>
            {hotels.map(hotel => (
              <option key={hotel.hid} value={hotel.hid}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit">{isEditing ? 'Update Manager' : 'Add Manager'}</button>
          {isEditing && (
            <button type="button" onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="managers-list">
        <h2>Managers List</h2>
        <div className="managers-grid">
          {managers.map(manager => (
            <div key={manager.id} className="manager-card">
              <div className="manager-info">
                <p><strong>Email:</strong> {manager.email}</p>
                <p><strong>Hotel:</strong> {hotels.find(h => h.hid === manager.hotelId)?.name}</p>
              </div>
              <div className="manager-actions">
                <button 
                  onClick={() => handleEdit(manager)}
                  className="edit-button"
                >
                  <MdEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(manager.id)}
                  className="delete-button"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddManager; 