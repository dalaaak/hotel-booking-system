import React, { useState } from 'react';
import { FaCalendarAlt,  FaMoneyBillWave, FaStar,  FaTable, FaChartPie, FaChartLine, FaComments } from 'react-icons/fa';
import OccupancyChart from './charts/OccupancyChart';
import RevenueChart from './charts/RevenueChart';
import './HotelReports.css';
import axios from 'axios';
import { useEffect } from 'react';


const HotelReports = () => {
  // State management
  const yourAuthToken = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('bookings');
  const [dateFilter, setDateFilter] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  //const [revenuePeriod, setRevenuePeriod] = useState('week');
  const [bookingsData, setBookingsData] = useState([]);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomsData, setRoomsData] = useState([]);

  const [totalRooms, setTotalRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);

  const [revenuePeriod, setRevenuePeriod] = useState("month");
  const [revenueData, setRevenueData] = useState({ period: "month", revenue: 0 });
  const [reviewsData, setReviewsData] = useState([]);


  
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get("http://localhost:8000/api/get_reviews/", {
          headers: { Authorization: `Bearer ${yourAuthToken}` },  // تمرير التوكن
        });

        setReviewsData(response.data);  // تحديث الحالة بالتقييمات المسترجعة
      } catch (error) {
        console.error("خطأ أثناء جلب التقييمات:", error);
      }
    }

    fetchReviews();
  }, []);


useEffect(() => {
  async function fetchRevenueData() {
    if (!yourAuthToken) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/api/get_revenue_report', {
        headers: { Authorization: `Bearer ${yourAuthToken}` },  // تمرير التوكن
        params: { period: revenuePeriod },
      });

      console.log("Revenue Response:", response.data); // طباعة البيانات للتأكد من وصولها
      setRevenueData(response.data.data); // تحديث الحالة بالبيانات الصحيحة
    } catch (error) {
      console.error("خطأ أثناء جلب بيانات الإيرادات:", error);
    }
  }

  fetchRevenueData();
}, [revenuePeriod]);



  
    useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get('http://localhost:8000/api/display_rooms/', {
          headers: { Authorization: `Bearer ${yourAuthToken}` }
        });

        const rooms = response.data.rooms || [];
        setRoomsData(rooms);

        // حساب عدد الغرف المتاحة والمشغولة
        const total = rooms.length;
        const occupied = rooms.filter(room => !room.is_available).length;
        const available = total - occupied;
        const rate = total > 0 ? (occupied / total) * 100 : 0;

        setTotalRooms(total);
        setOccupiedRooms(occupied);
        setAvailableRooms(available);
        setOccupancyRate(rate.toFixed(2));
      } catch (error) {
        console.error("خطأ أثناء جلب بيانات الغرف:", error);
      }
    }

    fetchRooms();
  }, []);

  
   useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axios.get('http://localhost:8000/api/hotel_bookings_managerreport/', {
          headers: {
            Authorization: `Bearer ${yourAuthToken}` // أضف المصادقة إذا كانت مطلوبة
          },
          params: {
            checkInDate,
            checkOutDate
          }
        });
        setBookingsData(response.data);
      } catch (error) {
        console.error("خطأ أثناء جلب البيانات:", error);
      }
    }

    fetchBookings();
  }, [checkInDate, checkOutDate]); // تحديث البيانات عند تغيير التواريخ

  const handleCheckInChange = (e) => setCheckInDate(e.target.value);
  const handleCheckOutChange = (e) => setCheckOutDate(e.target.value);




  // Event handlers
  const handleTabChange = (tab) => setActiveTab(tab);
  const handleDateFilterChange = (e) => setDateFilter(e.target.value);
  const handleRoomTypeFilterChange = (e) => setRoomTypeFilter(e.target.value);
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleRevenuePeriodChange = (e) => setRevenuePeriod(e.target.value);

  // Render components
  const renderFilters = () => (
    <div className="filters">
      <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <input
            type="date"
            value={checkInDate}
            onChange={handleCheckInChange}
            placeholder="تاريخ تسجيل الدخول"
          />
        </div>
        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <input
            type="date"
            value={checkOutDate}
            onChange={handleCheckOutChange}
            placeholder="تاريخ تسجيل الخروج"
          />
        </div>
 
    </div>
  );

  const renderBookingsTable = () => (
    <div className="table-container">
      <FaTable className="table-icon" />
      <table className="report-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Check in date</th>
            <th>Check out date</th>
            <th>Total days</th>
            <th>Before discount</th>
            <th>Total</th>
         
          </tr>
        </thead>
        <tbody>
          {bookingsData.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.full_name}</td>
              <td>{booking.email}</td>
              <td>{booking.check_in_date}</td>   
              <td>{booking.check_out_date}</td>
              <td>{booking.total_days}</td>
              <td>{booking.before_discount}</td>
              <td>{booking.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

const renderOccupancyReport = () => (
    <div className="report-section">
      <div className="chart-container">
        <FaChartPie className="chart-icon" />
         <OccupancyChart occupied={occupiedRooms} available={availableRooms} />
      </div>
      <div className="table-container">
        <FaTable className="table-icon" />
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Occupied Rooms</th>
              <th>Available Rooms</th>
              <th>Occupancy Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{new Date().toISOString().split('T')[0]}</td> 
              <td>{occupiedRooms}</td>
              <td>{availableRooms}</td>
              <td>{occupancyRate}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRevenueReport = () => (
 <div className="report-section">
      <div className="filters">
        <div className="filter-group">
          <FaMoneyBillWave className="filter-icon" />
<select value={revenuePeriod} onChange={(e) => setRevenuePeriod(e.target.value)}>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
        </div>
      </div>
      <div className="chart-container">
        <FaChartLine className="chart-icon" />
        <RevenueChart period={revenuePeriod} authToken={yourAuthToken} />
      </div>
    </div>
  );

  const renderReviewsReport = () => (
    <div className="report-section">
      <div className="reviews-list">
        {reviewsData.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.user}</h3>
              <div className="rating">
                <FaStar className="star-icon" />
                {review.rating}/5
              </div>
            </div>
            <p>{review.comment}</p>
            <div className="review-actions">
              <button className="reply-btn">Reply</button>
              <button className="report-btn">Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingsReport = () => (
    <div className="report-section">
      {renderFilters()}
      {renderBookingsTable()}
    </div>
  );

  // Main render
  return (
    <div className="hotel-reports">
      <div className="reports-tabs">
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => handleTabChange('bookings')}
        >
          <FaCalendarAlt className="tab-icon" />
          Bookings Report
        </button>
        <button
          className={activeTab === 'occupancy' ? 'active' : ''}
          onClick={() => handleTabChange('occupancy')}
        >
          <FaChartPie className="tab-icon" />
          Occupancy Report
        </button>
        <button
          className={activeTab === 'revenue' ? 'active' : ''}
          onClick={() => handleTabChange('revenue')}
        >
          <FaMoneyBillWave className="tab-icon" />
          Revenue Report
        </button>
        <button
          className={activeTab === 'reviews' ? 'active' : ''}
          onClick={() => handleTabChange('reviews')}
        >
          <FaComments className="tab-icon" />
          Reviews Report
        </button>
      </div>

      <div className="report-content">
        {activeTab === 'bookings' && renderBookingsReport()}
        {activeTab === 'occupancy' && renderOccupancyReport()}
        {activeTab === 'revenue' && renderRevenueReport()}
        {activeTab === 'reviews' && renderReviewsReport()}
      </div>
    </div>
  );
};

export default HotelReports; 