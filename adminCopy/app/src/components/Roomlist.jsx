import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roomlist.css';

const Roomlist = () => {
  const [rooms, setRooms] = useState([]);
  //const [hotels, setHotels] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:8000/api/display_rooms/', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(response => {
      setRooms(response.data.rooms || []);
    })
    .catch(error => console.error("Error fetching rooms:", error));
  }, []);

  const getStatusColor = (room_status) => {
    switch (room_status) {
      case 'available': return 'green';
      case 'maintenance': return 'orange';
      case 'failure': return 'red';
      case 'reserved': return 'blue';
      case 'clean': return 'orange';
      default: return 'black';

    }
  };

  const filteredRooms = filterStatus === 'all' 
    ? rooms 
    : filterStatus === 'available'
    ? rooms.filter(room => room.is_available)
    : rooms.filter(room => !room.is_available); 

  return (
    <div className="hotel-list-container2">
      <header className="hotel-header">
        <h1>Luxury Grand Hotel - Room Management</h1>
        <div className="filter-controls">
          <button onClick={() => setFilterStatus('all')} className={filterStatus === 'all' ? 'active' : ''}>All Rooms</button>
          <button onClick={() => setFilterStatus('available')} className={filterStatus === 'available' ? 'active' : ''}>Available Rooms</button>
          <button onClick={() => setFilterStatus('unavailable')} className={filterStatus === 'unavailable' ? 'active' : ''}>Unavailable Rooms</button>
        </div>
      </header>

      <div className="rooms-grid1">
        {filteredRooms.map(room => (
          <div key={room.rid} className={`room-card1 ${!room.is_available ? 'not-available' : ''}`}>
            <img src={`http://localhost:8000${room.image}`} alt={room.room_type} className="room-image1" />
            <div className="room-info1">
              <h3>{room.room_type}</h3>
              <p><strong>Price:</strong> ${room.p}/night</p>
              <p><strong>Capacity:</strong> {room.room_c} persons</p>
              <p><strong>Status:</strong> 
                <span style={{ color: getStatusColor(room.room_status) }}> {room.room_status}</span>
              </p>
              <p><strong>Amenities:</strong></p>
              <ul className="amenities-list1">
                {room.amenities?.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
              <div className="admin-controls">
                <button 
                  className={`status-button ${room.available ? 'available' : 'occupied'}`}
                  onClick={() => {
                    const updatedRooms = rooms.map(r => 
                      r.id === room.id ? {...r, available: !r.available} : r
                    );
                    setRooms(updatedRooms);
                  }}
                >
                  {room.available ? 'Mark as Occupied' : 'Mark as Available'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roomlist;
