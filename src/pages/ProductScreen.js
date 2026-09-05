import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductScreen = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState(null);
  const [formError, setFormError] = useState('');
  
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    location: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
    if (formError) setFormError('');
  };

  const handlePlaceOrder = () => {
    if (!orderDetails.name.trim() || !orderDetails.location.trim() || !orderDetails.phone.trim()) {
      setFormError('Please enter your name, location, and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: orderDetails.name,
        location: orderDetails.location,
        phone: orderDetails.phone,
        email: orderDetails.email,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `₹${160 * quantity}`,
        status: 'Processing',
        timestamp: Date.now()
      };

      // Save to local storage
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      localStorage.setItem('adminOrders', JSON.stringify([newOrder, ...existingOrders]));

      setIsSubmitting(false);
      setOrderSuccessId(newOrder.id);
      setOrderDetails({ name: '', location: '', phone: '', email: '' });
      setQuantity(1);
    }, 1500); // Fake network delay for animation
  };

  const closeOrderModal = () => {
    setIsOrdering(false);
    setOrderSuccessId(null);
    setFormError('');
  };

  return (
    <div className="product-detail-screen">
      <div className="breadcrumb">
        <button className="back-arrow" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="breadcrumb-text">
          Catalog &gt; Pottery &gt; <span>Sri Art Handmade Terracotta Diya (Product Name)</span>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="main-image">
            <img src="https://images.unsplash.com/photo-1602498456745-e9503b30470b?auto=format&fit=crop&w=800&q=80" alt="Terracotta Diya" />
            <div className="product-badge" style={{ top: 20, left: 20, backgroundColor: 'rgba(0,0,0,0.6)' }}>Authentic Clay Craft</div>
            <button className="favorite-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div className="thumbnail-list">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className={`thumbnail ${idx === 1 ? 'active' : ''}`}>
                <img src={`https://images.unsplash.com/photo-1602498456745-e9503b30470b?auto=format&fit=crop&w=200&q=80&sig=${idx}`} alt={`Thumb ${idx}`} />
              </div>
            ))}
          </div>
          
          <div className="special-price-box">
            <div>
              <h3>Special Direct Price</h3>
              <div className="price-tag">
                <span className="price-val">₹160</span>
                <span className="price-old">₹200</span>
                <span className="discount">20% OFF</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Inclusive of all taxes. Pan-India shipping ₹50.</p>
            </div>
            <div className="in-stock">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              In Stock
            </div>
          </div>
        </div>

        <div className="detail-info">
          <div className="product-badges">
            <span className="best-seller">Artisan Edition</span>
            <div className="ratings">
              ★ ★ ★ ★ ★ <span className="ratings-text">(98 custom craft reviews)</span>
            </div>
          </div>
          
          <h1>Product Description</h1>
          <div className="detail-subtitle">Sri Art Guild • Handcrafted in Gorakhpur</div>
          
          <div className="detail-desc">
            Molded individually by hand using refined all-natural terracotta river clay. Each piece is sundried over four days and cured in traditional brick wood-fire kilns to achieve its distinctive earthen aroma and rustic terracotta shade.
          </div>
          
          <p className="detail-para">
            Features hand embossed scalloped edges and traditional floral filigree contours designed to hold natural oils or ghee for prolonged spiritual ceremonies, Diwali illumination, and warm home ambient styling.
          </p>
          
          <div className="attributes-grid">
            <div className="attr-box">
              <div className="attr-label">Raw Material</div>
              <div className="attr-val">Natural Red Clay</div>
            </div>
            <div className="attr-box">
              <div className="attr-label">Dimensions</div>
              <div className="attr-val">8cm × 8cm × 4.5cm</div>
            </div>
            <div className="attr-box">
              <div className="attr-label">Finish</div>
              <div className="attr-val">Unlacquered Matte</div>
            </div>
            <div className="attr-box">
              <div className="attr-label">Weight</div>
              <div className="attr-val">150 grams</div>
            </div>
          </div>
          
          <div className="purchase-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Quantity:</span>
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <div className="qty-val">{quantity}</div>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <div className="subtotal">
              Subtotal: <span>₹{160 * quantity}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn-checkout" style={{ width: '100%' }} onClick={() => setIsOrdering(true)}>
              Place Order Now (₹{160 * quantity})
            </button>
          </div>
          
          <div className="trust-badges">
            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              100% Fair-Trade Certified
            </div>
            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Direct From Gorakhpur Potteries
            </div>
            <div className="trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Damage-Free Eco Packaging
            </div>
          </div>
        </div>
      </div>

      {isOrdering && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{orderSuccessId ? 'Order Confirmed' : 'Checkout'}</h3>
              {!isSubmitting && <button className="modal-close" onClick={closeOrderModal}>×</button>}
            </div>
            
            {orderSuccessId ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-main)' }}>Success!</h3>
                <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)' }}>Your order has been placed and sent to the artisan team.</p>
                <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '8px', margin: '24px 0', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14, color: 'var(--text-muted)' }}>Order Reference ID:</p>
                  <strong style={{ fontSize: 20, color: 'var(--text-main)', letterSpacing: '1px' }}>{orderSuccessId}</strong>
                </div>
                <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={closeOrderModal}>Continue Shopping</button>
              </div>
            ) : isSubmitting ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 20px auto', width: 40, height: 40, border: '4px solid var(--border-color)', borderTop: '4px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Processing Order...</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Securely transmitting your details to Sri Art.</p>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 20px 0', fontSize: 14, color: 'var(--text-muted)' }}>
                  You are ordering <strong>{quantity}x Sri Art Handmade Terracotta Diya</strong> for <strong>₹{160 * quantity}</strong>.
                </p>
                
                {formError && (
                  <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', border: '1px solid #ffcdd2' }}>
                    {formError}
                  </div>
                )}
                
                <div style={{ marginBottom: 12 }}>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Full Name *" 
                    value={orderDetails.name}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: 6, border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="Phone Number *" 
                    value={orderDetails.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: 6, border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <textarea 
                    name="location"
                    placeholder="Delivery Address *" 
                    value={orderDetails.location}
                    onChange={handleInputChange}
                    rows={3}
                    style={{ width: '100%', padding: '12px', borderRadius: 6, border: '1px solid var(--border-color)', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
                
                <div style={{ marginBottom: 24 }}>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address (Optional)" 
                    value={orderDetails.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '12px', borderRadius: 6, border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: 12 }} onClick={closeOrderModal}>Cancel</button>
                  <button className="btn-primary" style={{ flex: 1, padding: 12 }} onClick={handlePlaceOrder}>Confirm Order</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
