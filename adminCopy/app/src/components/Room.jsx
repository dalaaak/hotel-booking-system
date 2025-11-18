import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Room.css';
import { FaCalendarAlt, FaUsers, FaBed, FaWifi, FaSwimmingPool, FaUtensils, FaCar, FaSpa } from 'react-icons/fa';

const Room = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  

  useEffect(() => {
  const storedHotel = localStorage.getItem('currentHotel');
  const storedRooms = localStorage.getItem('rooms');

  if (storedHotel && storedRooms) {
    setHotel(JSON.parse(storedHotel));
    setRooms(JSON.parse(storedRooms));
  }
}, []);



  //const [hotel, setHotel] = useState(sampleHotelData);
  // تهيئة state مع البيانات التجريبية مباشرة
  const [searchResults, setSearchResults] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    additionalServices: [],
    nights: 1,
  });

  const additionalServices = [
    { id: 1, name: 'Comfort Beds', price: 20, icon: FaBed },
    { id: 2, name: 'WiFi', price: 10, icon: FaWifi },
    { id: 3, name: 'Swimming Pool', price: 30, icon: FaSwimmingPool },
    { id: 4, name: 'Luggage Storage', price: 15, icon: FaUtensils },
    { id: 5, name: 'Private park', price: 25, icon: FaCar },
    { id: 6, name: 'Spa', price: 50, icon: FaSpa },
    
  ];

const handleBooking = (roomId) => {
  const selectedRoom = searchResults ? searchResults.find(r => r.rid === roomId) : rooms?.find(r => r.rid === roomId);
  console.log("الغرفة المختارة بعد البحث:", selectedRoom); // هنا يتم طباعة بيانات الغرفة المختارة

  if (!selectedRoom) {
    alert("Error: Room data is not available.");
    return;
  }

  const bookingDetails = {
    ...bookingData,
    roomId,
    hotelId,
    hotelName: hotel?.name,
    totalPrice: calculateTotalPrice(selectedRoom), // تحديث السعر الفعلي للغرفة المختارة
  };
  navigate('/payment', { state: { bookingDetails, hotelId: hotel.id, hotelName: hotel.name } });
 

};



const calculateTotalPrice = (room) => {
  if (!room) return 0;

  const roomPrice = parseFloat(room.p) || 0;
  const nightsCount = parseInt(bookingData.nights) || 1;

  const servicesPrice = bookingData.additionalServices.reduce((total, serviceId) => {
    const service = additionalServices.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  return (roomPrice * nightsCount) + servicesPrice;
};



useEffect(() => {
  if (searchResults) {
    setBookingData(prevData => ({
      ...prevData,
      totalPrice: calculateTotalPrice(searchResults.find(r => r.id === prevData.roomId))
    }));
  }
}, [bookingData.nights, bookingData.additionalServices, bookingData.roomId]);






  const handleServiceToggle = (serviceId) => {
    setBookingData(prevData => {
      const isSelected = prevData.additionalServices.includes(serviceId);
      const updatedServices = isSelected
        ? prevData.additionalServices.filter(id => id !== serviceId) // إزالة الخدمة إذا كانت محددة
        : [...prevData.additionalServices, serviceId]; // إضافة الخدمة إذا لم تكن محددة

      return { ...prevData, additionalServices: updatedServices };
    });
  };

  const validateSearchFields = () => {
    // تخفيف شروط التحقق للسماح بالبحث بمعايير أقل
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    
    if (bookingData.checkIn && bookingData.checkOut) {
      if (checkOut <= checkIn) {
        alert('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
        return false;
      }
    }
    
    return true;
  };

  const handleSearch = () => {
    if (!validateSearchFields()) return;

    // تعديل منطق البحث ليكون أكثر مرونة
    const filteredRooms = hotel.rooms.filter(room => {
      let matchesType = true;
      let matchesGuests = true;

      // فلترة حسب نوع الغرفة فقط إذا تم اختيار نوع
      if (bookingData.roomType) {
        matchesType = room.type.toLowerCase() === bookingData.roomType.toLowerCase();
      }

      // فلترة حسب عدد الضيوف
      if (bookingData.guests > 1) {
        matchesGuests = room.maxGuests >= bookingData.guests;
      }

      return room.available && matchesType && matchesGuests;
    });

    // إظهار جميع الغرف إذا لم يتم تحديد أي معايير بحث
    setSearchResults(filteredRooms.length > 0 ? filteredRooms : hotel.rooms);
  };

  // تحديث طريقة العرض مع فحص القيم
  return (
    <div className="rooms-container">
      {hotel && (
        <>
          <div className="hotel-header">
            <h1>{hotel.name}</h1>
            <p>{hotel.description}</p>
          </div>
          
          {/* Search Form */}
          <div className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label><FaCalendarAlt /> Check-in Date</label>
                <input
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaCalendarAlt /> Check-out Date</label>
                <input
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label><FaUsers /> Number of Guests</label>
                <input
                  type="number"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label><FaBed /> Room Type</label>
                <select
                  value={bookingData.roomType}
                  onChange={(e) => setBookingData({...bookingData, roomType: e.target.value})}
                  required
                >
                  <option value="">Select Room Type</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              <div className="form-group">
  <label><FaCalendarAlt /> Number of Nights</label>
  <input
    type="number"
    value={bookingData.nights}
    onChange={(e) => setBookingData({...bookingData, nights: parseInt(e.target.value)})}
    min="1"
    required
  />
</div>

            </div>
            
            <button onClick={handleSearch} className="search-button">
              Search Rooms
            </button>
          </div>

          {/* Additional Services */}
          <div className="additional-services">
            <h3>✨ Additional Services</h3>
            <div className="services-grid">
              {additionalServices.map(service => (
                <div
                  key={service.id}
                  className={`service-item ${
                    bookingData.additionalServices.includes(service.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <service.icon />
                  <p className="service-name">{service.name}</p>
                  <span className="service-badge">${service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div className="search-results">
            <h2>Available Rooms</h2>
            <div className="rooms-grid">
              {(searchResults || hotel.rooms).map((room, index) => (
  <div key={room.rid || index} className="room-card"> {/* تأكد أن المفتاح فريد لكل غرفة */}
    <div className="room-image-container">
      <img src={`http://localhost:8000${room.image}`} alt={room.type} className="room-image" />
    </div>
    <div className="room-info">
      <p>{room.room_type}</p>
      <div className="room-features">
        <span><FaUsers /> Up to {room.room_c} guests</span>
      </div>
      <div className="room-details">
        <span className="price">${room.p}</span>
        <span className="per-night">per night</span>
      </div>
      <div className="total-price">
        Total with services: ${calculateTotalPrice(room)}
      </div>
      <button onClick={() => handleBooking(room.rid)} className="book-button">
        Book Now
      </button>
    </div>
  </div>
))}

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Room;

