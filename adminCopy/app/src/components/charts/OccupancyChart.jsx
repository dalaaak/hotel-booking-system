import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const OccupancyChart = ({ occupied, available }) => {
  const [chartData, setChartData] = useState([
    { name: 'Available Rooms', value: available },
    { name: 'Occupied Rooms', value: occupied }
  ]);

  useEffect(() => {
    setChartData([
      { name: 'Available Rooms', value: available },
      { name: 'Occupied Rooms', value: occupied }
    ]);
  }, [occupied, available]);

  const COLORS = ['#4CAF50', '#FF5252']; // ✅ أخضر للمتوفر وأحمر لغير المتوفر

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
