import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ period, authToken }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!authToken) {
      console.error("No token found. Please log in.");
      return;
    }

    fetch(`http://localhost:8000/api/get_revenue_report?period=${period}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,  // تمرير التوكن
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("Revenue Data:", data);  // تحقق من صحة البيانات
        setData(data.data); // تحديث البيانات
      })
      .catch(error => console.error("Error fetching revenue data:", error));
  }, [period, authToken]);


  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#2196F3" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
