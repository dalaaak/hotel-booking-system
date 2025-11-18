import React, { useState } from 'react';
import { FaChartBar, FaChartLine, FaUsers, FaExclamationTriangle, FaHotel, FaMoneyBillWave, FaStar, FaCalendarAlt, FaCity, FaBuilding } from 'react-icons/fa';
import './Reports.css';
import { useEffect } from 'react';
import axios from 'axios';


const Reports = () => {
  const [activeReport, setActiveReport] = useState('general');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [city, setCity] = useState('');
  const [hotelType, setHotelType] = useState('');
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);  // تعريف setActiveUsers
  const [newUsers, setNewUsers] = useState(0);        // تعريف setNewUsers

useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/top-bookers/")
    .then(response => {
      console.log("🔎 تقرير المستخدمين:", response.data);
      
      // التأكد من استقبال البيانات بشكل صحيح
      setBookings(Array.isArray(response.data.topBookers) ? response.data.topBookers : []);
      setActiveUsers(response.data.activeUsers);
      setNewUsers(response.data.newUsers);
    })
    .catch(error => console.error("❌ خطأ أثناء جلب البيانات:", error));
}, []);




const [performanceDat, setPerformanceDat] = useState({
  occupancy: [],
  revenue: []
});


const handlePerformanceSearch = () => {
  const token = localStorage.getItem('token');

  axios.get(`http://127.0.0.1:8000/api/hotel_performance_report/`, {
    params: {
      start_date: dateRange.start,
      end_date: dateRange.end,
    },
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log("Filtered performance report:", response.data);

    const occupancyData = response.data.map(hotel => ({
      hotel: hotel.name,
      rate: hotel.occupancy_rate
    }));

    const revenueData = response.data.map(hotel => ({
      hotel: hotel.name,
      amount: hotel.revenue
    }));

    setPerformanceDat({ occupancy: occupancyData, revenue: revenueData });
  })
  .catch(error => {
    console.error('Error fetching performance data:', error);
  });
};


useEffect(() => {
  const token = localStorage.getItem('token');

  axios.get('http://127.0.0.1:8000/user/api/hotels/', {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log("Performance Report Data:", response.data);
    
    const occupancyData = response.data.map(hotel => ({
      hotel: hotel.name,
      rate: hotel.occupancy_rate
    }));

    const revenueData = response.data.map(hotel => ({
      hotel: hotel.name,
      amount: hotel.revenue
    }));

    setPerformanceDat({ occupancy: occupancyData, revenue: revenueData });
  })
  .catch(error => {
    console.error('Error fetching performance data:', error);
  });
}, []);


const handleSearch = () => {
  const token = localStorage.getItem('token'); // استرجاع التوكن

  // تجهيز المعلمات المرسلة للـ API
  let params = {};
  if (dateRange.start && dateRange.end) {
    params.start_date = dateRange.start;
    params.end_date = dateRange.end;
  }
  if (city) {
    params.address = city;
  }
  if (hotelType) {
    params.hotel_type = hotelType;
  }

  axios.get(`http://127.0.0.1:8000/api/hotel-bookings-report/`, {
    params: params,
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log("Filtered bookings report:", response.data); // طباعة البيانات المسترجعة
    setHotels(response.data); // تحديث الجدول بالنتائج
  })
  .catch(error => {
    console.error('Error fetching hotel bookings:', error);
  });
};


useEffect(() => {
  const token = localStorage.getItem('token'); // تأكد من تخزين التوكن
  axios.get('http://127.0.0.1:8000/user/api/hotels/', {
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    console.log("Fetched hotels data:", response.data);
    if (Array.isArray(response.data)) {
      setHotels(response.data);
    } else {
      console.error('Unexpected API response format:', response.data);
    }
  })
  .catch(error => {
    console.error('Error fetching hotels:', error);
  });
}, []);


  // Improved mock data


  const performanceData = {
    occupancy: [
      { hotel: 'Golden Palace Hotel', rate: 92 },
      { hotel: 'Oasis Hotel', rate: 85 },
      { hotel: 'Desert Hotel', rate: 78 },
      { hotel: 'Red Sea Hotel', rate: 88 },
      { hotel: 'Mountain Hotel', rate: 75 },
      { hotel: 'City Hotel', rate: 82 },
    ],
    revenue: [
      { hotel: 'Golden Palace Hotel', amount: 75000 },
      { hotel: 'Oasis Hotel', amount: 54000 },
      { hotel: 'Desert Hotel', amount: 45000 },
      { hotel: 'Red Sea Hotel', amount: 66000 },
      { hotel: 'Mountain Hotel', amount: 39000 },
      { hotel: 'City Hotel', amount: 60000 },
    ],
  };

  const userReportData = {
    newUsers: 85,
    activeUsers: 320,
    topBookers: [
      { name: 'John Smith', bookings: 25 },
      { name: 'Sarah Johnson', bookings: 18 },
      { name: 'Michael Brown', bookings: 15 },
      { name: 'Emily Davis', bookings: 12 },
      { name: 'David Wilson', bookings: 10 },
    ],
  };

  const systemReportData = {
    errors: [
      { id: 1, message: 'Database connection error', timestamp: '2024-03-15 10:30' },
      { id: 2, message: 'Payment gateway error', timestamp: '2024-03-15 11:45' },
      { id: 3, message: 'Email service error', timestamp: '2024-03-15 14:20' },
      { id: 4, message: 'Booking system error', timestamp: '2024-03-15 16:15' },
    ],
    uptime: 99.9,
    notifications: [
      { id: 1, message: 'System backup completed successfully', type: 'info', timestamp: '2024-03-15 09:00' },
      { id: 2, message: 'New security update available', type: 'warning', timestamp: '2024-03-15 08:30' },
      { id: 3, message: 'Booking system updated successfully', type: 'info', timestamp: '2024-03-15 07:45' },
      { id: 4, message: 'Alert: High concurrent user load', type: 'warning', timestamp: '2024-03-15 06:20' },
    ],
  };

  const renderGeneralReport = () => (
    <div className="report-section">
      <h2>General Booking Report</h2>
      <div className="filters">
        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start Date"
          />
        </div>
        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End Date"
          />
        </div>
        
        <div className="filter-group">
          <FaCity className="filter-icon" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="filter-group">
          <FaBuilding className="filter-icon" />
          <select value={hotelType} onChange={(e) => setHotelType(e.target.value)}>
            <option value="">Sort by</option>
            <option value="highest">highest</option>
            <option value="lowest">lowest</option>
            <option value="random">random</option>
          </select>
        </div>
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      
      <table className="report-table">
        <thead>
          <tr>
            <th><FaHotel /> Hotel Name</th>
            <th><FaUsers /> Bookings</th>
            <th><FaMoneyBillWave /> Revenue</th>
            <th><FaStar /> Rating</th>
          </tr>
        </thead>
        <tbody>
  {hotels.map((hotel, index) => (
    <tr key={index}>
      <td>{hotel.name}</td>
      <td>{hotel.bookingcount}</td>
      <td>${hotel.revenue ? hotel.revenue.toLocaleString() : "N/A"}</td>

      <td>
  <div className="ratings">
    {[...Array(hotel.stars)].map((_, index) => (
      <FaStar key={index} className="star-icons" />
    ))}
  </div>
</td>

    </tr>
  ))}
</tbody>

      </table>
    </div>
  );

  const renderPerformanceReport = () => (
    <div className="report-section">
      <h2>Performance Report</h2>
      <div className="filters">
        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="Start Date"
          />
        </div>
        
        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="End Date"
          />
        </div>
        
        <button onClick={handlePerformanceSearch} className="search-button">Search</button>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h3>Occupancy Rate</h3>
          <div className="bar-chart">
            {performanceDat.occupancy.map((hotel, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{hotel.hotel}</div>
                <div className="bar" style={{ height: `${hotel.rate * 2}px`, minHeight: '10px' }}>
  {hotel.rate}%
</div>

                
              </div>
            ))}
          </div>
        </div>
        <div className="chart">
          <h3>Revenue Comparison</h3>
          <div className="line-chart">
            {performanceDat.revenue.map((hotel, index) => (
              <div key={index} className="line-item">
                <div className="line-label">{hotel.hotel}</div>
                <div className="line" style={{ height: `${hotel.amount ? (hotel.amount / 800) * 2 : 10}px` }}>
  ${hotel.amount ? hotel.amount.toLocaleString() : "0"}
</div>

                  

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserReport = () => (
    <div className="report-section">
      <h2>User Report</h2>
     
      <div className="user-stats">
        <div className="stat-card">
          <h3>Hotel Managers</h3>
          <p>{newUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p>{activeUsers}</p>
        </div>
      </div>
      <div className="top-bookers">
        <h3>Top Bookers</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Bookings</th>
            </tr>
          </thead>
<tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
            
              <td>{booking.user_name}</td>
              <td>{booking.bookings}</td>
              
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );

  const renderSystemReport = () => (
    <div className="report-section">
      <h2>System Report</h2>
      <div className="system-stats">
        <div className="stat-card">
          <h3>Uptime Rate</h3>
          <p>{systemReportData.uptime}%</p>
        </div>
      </div>
      <div className="errors-section">
        <h3>Error Log</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            {systemReportData.errors.map((error) => (
              <tr key={error.id}>
                <td>{error.timestamp}</td>
                <td>{error.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="notifications-section">
        <h3>System Notifications</h3>
        <div className="notifications-list">
          {systemReportData.notifications.map((notification) => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              <span className="timestamp">{notification.timestamp}</span>
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="reports-container">
      <div className="reports-sidebar">
        <button
          className={`sidebar-item ${activeReport === 'general' ? 'active' : ''}`}
          onClick={() => setActiveReport('general')}
        >
          <FaChartBar /> General Report
        </button>
        <button
          className={`sidebar-item ${activeReport === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveReport('performance')}
        >
          <FaChartLine /> Performance Report
        </button>
        <button
          className={`sidebar-item ${activeReport === 'users' ? 'active' : ''}`}
          onClick={() => setActiveReport('users')}
        >
          <FaUsers /> User Report
        </button>
        <button
          className={`sidebar-item ${activeReport === 'system' ? 'active' : ''}`}
          onClick={() => setActiveReport('system')}
        >
          <FaExclamationTriangle /> System Report
        </button>
      </div>
      <div className="reports-content">
        {activeReport === 'general' && renderGeneralReport()}
        {activeReport === 'performance' && renderPerformanceReport()}
        {activeReport === 'users' && renderUserReport()}
        {activeReport === 'system' && renderSystemReport()}
      </div>
    </div>
  );
};

export default Reports; 