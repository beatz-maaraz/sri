import React, { useState, useEffect } from 'react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    // Extract unique customers based on name and phone (or just use orders to mock customer list)
    // To make it simple for the mock, we'll just use the orders and deduplicate by phone/name
    const customerMap = new Map();
    
    savedOrders.forEach(order => {
      // Mocking a unique key if phone is missing
      const key = order.phone || order.customer;
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: order.customer,
          phone: order.phone || 'N/A',
          location: order.location || 'N/A',
          email: order.email || 'N/A',
          ordersCount: 1,
          totalSpent: parseInt(order.amount.replace(/[^0-9]/g, ''), 10) || 0,
          lastOrderDate: order.date
        });
      } else {
        const existing = customerMap.get(key);
        existing.ordersCount += 1;
        existing.totalSpent += parseInt(order.amount.replace(/[^0-9]/g, ''), 10) || 0;
        customerMap.set(key, existing);
      }
    });

    setCustomers(Array.from(customerMap.values()));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Customer Management</h2>
      </div>
      
      <div className="admin-section">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Details</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>
                    <td>
                      <div>{customer.phone}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{customer.email}</div>
                    </td>
                    <td>{customer.location}</td>
                    <td>{customer.ordersCount}</td>
                    <td>₹{customer.totalSpent}</td>
                    <td>{customer.lastOrderDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>No customers found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
