import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Roommanagment.css';
import { FaBed, FaMoneyBillWave, FaFileAlt, FaImage, FaList, FaCheckCircle } from 'react-icons/fa';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ 
        room_number: '',
        is_available: true,
        room_status: "available",
        room_type: '',
        image: null,
        p: 0,
        n: 1,
        room_c: 1,
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);


    const fetchRooms = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await axios.get('http://localhost:8000/api/display_rooms/', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log("🔹 API Response:", response.data);  // طباعة البيانات للتأكد من صحتها
    
            if (Array.isArray(response.data.rooms)) {
                setRooms(response.data.rooms); // تعيين القيم إذا كانت مصفوفة
            } else {
                console.error("Error: `rooms` is not an array", response.data);
                setRooms([]); // منع الخطأ وتعيين قيمة فارغة
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };
    

    // 🔵 **إضافة غرفة**
    const addRoom = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append("room_number", newRoom.room_number);
        formData.append("is_available", newRoom.is_available);
        formData.append("room_status", newRoom.room_status);
        formData.append("room_type", newRoom.room_type);
        formData.append("image", newRoom.image);
        formData.append("p", newRoom.p);
        formData.append("n", newRoom.n);
        formData.append("room_c", newRoom.room_c);
        formData.append("description", newRoom.description);
    
        try {
            const response = await axios.post('http://localhost:8000/api/add-room/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Room added successfully:', response.data);
        } catch (error) {
            console.error('Error adding room:', error.response.data);
        }
    };
    

    // 🟠 **تحديث غرفة**
    const updateRoom = async (id) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.keys(newRoom).forEach(key => formData.append(key, newRoom[key]));

        try {
            await axios.put(`http://localhost:8000/api/rooms/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchRooms();
            resetForm();
        } catch (error) {
            console.error('Error updating room:', error.response.data);
        }
    };

    // 🔴 **حذف غرفة**
    const deleteRoom = async (rid) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8000/api/delete/`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ room_id: rid }) // تأكد من تحويل البيانات إلى JSON
            });
            fetchRooms();
        } catch (error) {
            console.error('Error deleting room:', error.response?.data);
        }
    };
    
    
    

    const handleEdit = (room) => {
        setIsEditing(true);
        setNewRoom(room);
        setEditingIndex(room.id);
    };

    const resetForm = () => {
        setNewRoom({
            room_number: '',
            is_available: true,
            room_status: "available",
            room_type: '',
            image: null,
            p: 0,
            n: 1,
            room_c: 1,
            description: '',    
        });
        setIsEditing(false);
        setEditingIndex(null);
    };

    return (
        <div className="hotel-manager-container1">
            <h1>Room Management</h1>
            <div className="input-group">
                <FaBed className="input-icon" />       
                <input type="text" value={newRoom.room_number} onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })} placeholder="Room Number" />
            </div>
 


<div className="input-group">
    <label>Room Status:</label>
    <select 
        value={newRoom.room_status} 
        onChange={(e) => setNewRoom({ ...newRoom, room_status: e.target.value })}
        className="room-status-select"
    >
        <option value="clean">🧼 Clean</option>
        <option value="maintenance">🛠️ Maintenance</option>
        <option value="failure">❌ Failure</option>
        <option value="reserved">🔒 Reserved</option>
        <option value="available">✅ Available</option>
    </select>
</div>

            <div className="input-group">
            
                <FaFileAlt className="input-icon" />
                <input type="text" value={newRoom. room_type} onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })} placeholder="Room Type" />
            </div>

            <div className="input-group">
                <FaImage className="input-icon" />
                <input type="file" accept="image/*" onChange={(e) => setNewRoom({ ...newRoom, image: e.target.files[0] })} />
            </div>

            <div className="input-group">
                <FaMoneyBillWave className="input-icon" />
                <input type="number" value={newRoom.p} onChange={(e) => setNewRoom({ ...newRoom, p: parseFloat(e.target.value) })} placeholder="Price" />
            </div>

            <div className="input-group">
            <label>Number of Beds:</label>
                
                <input type="number" value={newRoom.n} onChange={(e) => setNewRoom({ ...newRoom, n: parseInt(e.target.value, 10) })} placeholder="Number of Beds" />
            </div>

            <div className="input-group">
            <label>Room Capacity:</label>
               
                <input type="number" value={newRoom.room_c} onChange={(e) => setNewRoom({ ...newRoom, room_c: parseInt(e.target.value, 10) })} placeholder="Room Capacity" />
            </div>


            <div className="input-group">
                <FaFileAlt className="input-icon" />
                <input type="text" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })} placeholder="Description" />
            </div>

            <button onClick={isEditing ? () => updateRoom(editingIndex) : addRoom}>
                {isEditing ? 'Update Room' : 'Add Room'}
            </button>

            <div className="hotel-list1">
                {rooms.map((room) => (
                    <div key={room.rid} className="room-card1">
                        <img src={`http://localhost:8000${room.image}`} alt="Room" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <h3>{room.description}</h3>
                        <p>Room number: {room.room_number}</p>
                        <p>Room status: {room.room_status}</p>
                        <p>Room Type: {room.room_type}</p>
                        <p>Price: {room.p}$</p>
                        <p>Number of Beds: {room.n}</p>
                        <p>Room Capacity: {room.room_c}</p>
                        <button onClick={() => handleEdit(room)}>Edit</button>
                        <button onClick={() => deleteRoom(room.rid)}>Delete</button>
                          
                    </div>
                ))}
            </div>
        </div>
    );
};




export default RoomManagement;


