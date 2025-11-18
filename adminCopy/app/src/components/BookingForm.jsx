import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ hotelId }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    check_in_date: '',
    check_out_date: '',
    num_adults: 1,
    num_children: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/bookings/', { ...formData, hotel: hotelId })
      .then(response => alert('Booking successful!'))
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="full_name" placeholder="Full Name" onChange={handleChange} />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="check_in_date" type="date" onChange={handleChange} />
      <input name="check_out_date" type="date" onChange={handleChange} />
      <button type="submit">Book Now</button>
    </form>
  );
};

export default BookingForm;
