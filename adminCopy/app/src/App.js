import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import HotelListPage from './components/HotelListPage';
import Profile from './components/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Actors from './pages/Actors';
import RoomManagement from './components/RoomManagement';
import Homepageclient from './pages/Homepageclient';
import FooterComponent from './components/Footer';
import Manage from './pages/Manage';
import Loginto from './components/Loginto';
import Hotels from './components/Hotels';
import Room from './components/Room';
import Payment from './components/Payment';
import OffersClient from './components/OffersClient';
import HotelOffers from './components/HotelOffers';
import HotelDetails from './components/HotelDetails'
import axios from 'axios';
import BookingForm from './components/BookingForm';

import HotelList from './components/HotelList';


import UserReports from './components/UserReports';
import NotificationsPage from './components/NotificationsPage';
import EmailNotification from './components/EmailNotification';
import ProtectedRoute from "./components/ProtectedRoute";







function App() {
  const [data, setData] = useState(null);

  
  
  useEffect(() => {
    // استبدل هذا الرابط برابط API الخاص بك
    fetch('http://localhost:8000')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, []); // [] تعني أن التأثير سيعمل مرة واحدة عند تحميل المكون

  class App extends React.Component{
    state = {detalis:[],}
    componentDidMount(){
      let data;
      axios.get('http://127.0.0.1:8000/')
      .then(res => {
        data = res.data;
        this.setState({
          detalis:data
        });

      })
      .catch(err => {})
    }
  }
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Actors />} />
          <Route path="/Homepageclient" element={<Homepageclient data={data} />} />
          

<Route path="/AdminDashboard" element={
    <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
    </ProtectedRoute>
} />




   
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotel/:slug" element={<HotelDetails />} />


<Route path="/Manager" element={
    <ProtectedRoute allowedRoles={["employee"]}>
        <Manage />
    </ProtectedRoute>
} />


          <Route path="/Booking" element={<BookingForm />}/>
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/loginto" element={<Loginto />} />
          <Route path="/Hotels" element={<Hotels/>}/>
          <Route path="/hotel/:hotelId/rooms" element={<Room />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/OffersClient" element={<OffersClient />} />
          <Route path="/hotel/:hotelId/offers" element={<HotelOffers />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/hotels" element={<HotelListPage data={data} />} />
          <Route path="/RoomManagement" element={<RoomManagement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-reports" element={<UserReports />} />
          
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/email-notification/:bookingId" element={<EmailNotification />} />
        </Routes>
        <FooterComponent />
      </Router>
    </div>
  );
}


          

export default App;







