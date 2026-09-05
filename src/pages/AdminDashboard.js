import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dailyData = [
  { name: 'Mon', sales: 400, revenue: 240 },
  { name: 'Tue', sales: 300, revenue: 139 },
  { name: 'Wed', sales: 200, revenue: 980 },
  { name: 'Thu', sales: 278, revenue: 390 },
  { name: 'Fri', sales: 189, revenue: 480 },
  { name: 'Sat', sales: 239, revenue: 380 },
  { name: 'Sun', sales: 349, revenue: 430 },
];

const monthlyData = [
  { name: 'May', sales: 4000, revenue: 2400 },
  { name: 'Jun', sales: 3000, revenue: 1398 },
  { name: 'Jul', sales: 2000, revenue: 9800 },
  { name: 'Aug', sales: 2780, revenue: 3908 },
  { name: 'Sep', sales: 1890, revenue: 4800 },
  { name: 'Oct', sales: 2390, revenue: 3800 },
  { name: 'Nov', sales: 3490, revenue: 4300 },
];

const yearlyData = [
  { name: '2022', sales: 40000, revenue: 24000 },
  { name: '2023', sales: 30000, revenue: 13980 },
  { name: '2024', sales: 20000, revenue: 98000 },
  { name: '2025', sales: 27800, revenue: 39080 },
  { name: '2026', sales: 18900, revenue: 48000 },
];

const AdminDashboard = () => {
  const [timeScale, setTimeScale] = useState('month');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    // If no orders exist, provide some mock defaults
    if (savedOrders.length === 0) {
      const mockOrders = [
        { id: '#ORD-8942', customer: 'Priya Sharma', date: 'Oct 24, 2026', amount: '₹850', status: 'Processing' },
        { id: '#ORD-8941', customer: 'Rajesh Kumar', date: 'Oct 23, 2026', amount: '₹1,200', status: 'Shipped' },
        { id: '#ORD-8940', customer: 'Ananya Singh', date: 'Oct 22, 2026', amount: '₹320', status: 'Delivered' }
      ];
      setOrders(mockOrders);
      localStorage.setItem('adminOrders', JSON.stringify(mockOrders));
    } else {
      setOrders(savedOrders);
    }
  }, []);

  let activeData;
  if (timeScale === 'day') activeData = dailyData;
  else if (timeScale === 'year') activeData = yearlyData;
  else activeData = monthlyData;

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Dashboard Overview</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{currentDate}</div>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Sales</div>
          <div className="metric-value">₹1,24,500</div>
          <div className="metric-change positive">+15% this month</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Active Orders</div>
          <div className="metric-value">{orders.length}</div>
          <div className="metric-change">{orders.filter(o => o.status === 'Processing').length} pending fulfillment</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Products</div>
          <div className="metric-value">128</div>
          <div className="metric-change">12 low in stock</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Customers</div>
          <div className="metric-value">845</div>
          <div className="metric-change positive">+32 new this week</div>
        </div>
      </div>

      <div className="admin-section" style={{ marginTop: 40 }}>
        <div className="graph-header">
          <h3>Sales Analysis</h3>
          <div className="time-scale-toggles">
            <button 
              className={`scale-btn ${timeScale === 'day' ? 'active' : ''}`} 
              onClick={() => setTimeScale('day')}>Daily</button>
            <button 
              className={`scale-btn ${timeScale === 'month' ? 'active' : ''}`} 
              onClick={() => setTimeScale('month')}>Monthly</button>
            <button 
              className={`scale-btn ${timeScale === 'year' ? 'active' : ''}`} 
              onClick={() => setTimeScale('year')}>Yearly</button>
          </div>
        </div>
        
        <div style={{ height: 400, marginTop: 24 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="var(--accent-primary)" strokeWidth={3} activeDot={{ r: 8 }} isAnimationActive={true} />
              <Line type="monotone" dataKey="sales" name="Sales (Units)" stroke="#8884d8" strokeWidth={3} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-section" style={{ marginTop: 40 }}>
        <h3>Recent Orders</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
