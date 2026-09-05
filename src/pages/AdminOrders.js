import React, { useState, useEffect } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    setOrders(savedOrders);
  }, []);

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder) return;
    
    let updatedOrder = { ...selectedOrder, status: newStatus };
    
    if (newStatus === 'Delivered' && !selectedOrder.deliveryDate) {
      updatedOrder.deliveryDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    const updatedOrders = orders.map(o => 
      o.id === selectedOrder.id ? updatedOrder : o
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
    setSelectedOrder(updatedOrder);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Order Management</h2>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setViewMode('list')} 
            style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--text-main)', fontWeight: viewMode === 'list' ? 600 : 500 }}
          >List</button>
          <button 
            onClick={() => setViewMode('grid')} 
            style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--text-main)', fontWeight: viewMode === 'grid' ? 600 : 500 }}
          >Grid</button>
          <button 
            onClick={() => setViewMode('masonry')} 
            style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: viewMode === 'masonry' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'masonry' ? 'white' : 'var(--text-main)', fontWeight: viewMode === 'masonry' ? 600 : 500 }}
          >Masonry</button>
        </div>
      </div>
      
      <div className="admin-section">
        {viewMode === 'list' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product & Qty</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index}>
                      <td><strong>{order.id}</strong></td>
                      <td>
                        <div>{order.customer}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.phone}</div>
                      </td>
                      <td>Terracotta Diya</td>
                      <td>{order.amount}</td>
                      <td>{order.date}</td>
                      <td><span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'processing'}`}>{order.status || 'Processing'}</span></td>
                      <td>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
                      <div style={{ color: 'var(--text-muted)' }}>No orders found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {orders.length > 0 ? orders.map((order, index) => (
              <div key={index} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{order.id}</h4>
                    <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'processing'}`} style={{ fontSize: '12px' }}>{order.status || 'Processing'}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{order.amount}</span>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Customer</div>
                  <div style={{ fontWeight: 500 }}>{order.customer}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{order.date}</div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found.</div>
            )}
          </div>
        )}

        {viewMode === 'masonry' && (
          <div style={{ columns: '1', columnGap: '24px', '@media (minWidth: 768px)': { columns: '2' }, '@media (minWidth: 1024px)': { columns: '3' } }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
              {orders.length > 0 ? orders.map((order, index) => (
                <div key={index} style={{ breakInside: 'avoid', marginBottom: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderTop: `4px solid ${order.status === 'Delivered' ? '#4caf50' : order.status === 'Shipped' ? '#2196f3' : '#ff9800'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</span>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '18px' }}>{order.id}</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'processing'}`} style={{ fontSize: '12px', display: 'inline-block', marginBottom: '8px' }}>{order.status || 'Processing'}</span>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.date}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Customer:</span>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>{order.customer}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Items:</span>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>Terracotta Diya</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Total</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '18px' }}>{order.amount}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-secondary" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3>Order Details: {selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Current Status</div>
                  <span className={`status-badge status-${selectedOrder.status ? selectedOrder.status.toLowerCase() : 'processing'}`} style={{ fontSize: 14 }}>
                    {selectedOrder.status || 'Processing'}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Update Status</div>
                  <select 
                    value={selectedOrder.status || 'Processing'} 
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {selectedOrder.status === 'Delivered' && (
                <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2e7d32', marginBottom: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h4 style={{ margin: 0 }}>Delivery Successful</h4>
                  </div>
                  <div style={{ fontSize: 13, color: '#1b5e20' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Delivered On:</strong> {selectedOrder.deliveryDate || 'N/A'}</p>
                    <p style={{ margin: 0 }}><strong>Proof of Delivery:</strong> Signature acquired. Package left at {selectedOrder.location || 'Customer Address'}.</p>
                  </div>
                </div>
              )}

              <div>
                <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Customer Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                  <strong>{selectedOrder.customer}</strong>
                  
                  <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                  <span>{selectedOrder.phone || 'N/A'}</span>
                  
                  <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                  <span>{selectedOrder.email || 'N/A'}</span>
                  
                  <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                  <span>{selectedOrder.location || 'N/A'}</span>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Order Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date Placed:</span>
                  <span>{selectedOrder.date}</span>
                  
                  <span style={{ color: 'var(--text-muted)' }}>Item:</span>
                  <span>Sri Art Handmade Terracotta Diya</span>
                  
                  <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: 16 }}>{selectedOrder.amount}</strong>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => setSelectedOrder(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
