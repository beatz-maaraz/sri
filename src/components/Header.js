import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleTrackOrder = () => {
    if (!trackOrderId.trim()) {
      setTrackError('Please enter an Order ID.');
      return;
    }
    
    setTrackError('');
    setTrackResult(null);
    
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const foundOrder = savedOrders.find(o => o.id.toLowerCase() === trackOrderId.trim().toLowerCase());
    
    if (foundOrder) {
      // Force mobile keyboard to close
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }
      
      setTrackResult(foundOrder);
      
      // Auto-scroll modal to top smoothly to ensure nothing is hidden
      setTimeout(() => {
        const modal = document.querySelector('.modal-content');
        if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      setTrackError(`Could not find an order with ID: ${trackOrderId}`);
    }
  };

  const closeTrackModal = () => {
    setShowTrackModal(false);
    setTrackOrderId('');
    setTrackResult(null);
    setTrackError('');
  };

  return (
    <>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="logo" onClick={() => navigate('/')} style={{ gap: '12px' }}>
            <img 
              src="/logo.png" 
              alt="Sri Art Logo" 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', boxShadow: '0 4px 12px rgba(196, 91, 54, 0.15)' }} 
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex'; 
              }} 
            />
            <div className="logo-icon" style={{ display: 'none' }}>SA</div>
            <div className="logo-text">
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px' }}>Sri Art</h1>
              <span style={{ letterSpacing: '2px', fontWeight: 600, fontSize: '9px' }}>DESIGN STUDIO</span>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search handcrafted pottery, paintings, woodcraft..." />
        </div>

        <nav className="nav-links">
          <a href="#curated">Curated Picks</a>
          <a href="#spotlight">Product Spotlight <span style={{ color: 'var(--accent-primary)', fontSize: '10px', verticalAlign: 'top' }}>NEW</span></a>
        </nav>

        <div className="nav-actions">
          <button className="btn-secondary desktop-only" style={{ padding: '8px 12px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'transparent' }} onClick={() => setShowTrackModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Track Order
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="cart-icon" style={{ padding: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <div className="cart-badge">0</div>
            </div>

            <button className="login-btn desktop-only" onClick={() => setShowSignInModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Sign Up
            </button>

            <div className="mobile-only" style={{ position: 'relative', display: 'none' }}>
              <button className="profile-icon-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {showProfileMenu && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} onClick={() => setShowProfileMenu(false)}></div>
                  <div className="profile-dropdown-menu">
                    <button onClick={() => { setShowProfileMenu(false); setShowSignInModal(true); }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Sign Up
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); setShowTrackModal(true); }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      Track Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {showTrackModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3>Track Your Order</h3>
              <button className="modal-close" onClick={closeTrackModal}>×</button>
            </div>
            <div style={{ padding: '20px 0' }}>
              {!trackResult ? (
                <>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Enter your Order Reference ID to check its current status.</p>
                  
                  <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    <input 
                      type="text" 
                      placeholder="e.g. ORD-1234" 
                      value={trackOrderId}
                      onChange={(e) => setTrackOrderId(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
                      onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
                    />
                    <button className="btn-primary" onClick={handleTrackOrder}>Track</button>
                  </div>

                  {trackError && (
                    <div style={{ padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', fontSize: '14px', border: '1px solid #ffcdd2' }}>
                      {trackError}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10 }}>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }} 
                    onClick={() => { setTrackResult(null); setTrackOrderId(''); }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Search Another
                  </button>
                </div>
              )}

              {trackResult && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ marginBottom: 32, padding: '0 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 12, left: '12.5%', right: '12.5%', height: 2, backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                      
                      {(() => {
                        const currentStatus = trackResult.status || 'Processing';
                        const statusOrder = ['Processing', 'Shipped', 'Delivered'];
                        const currentIndex = statusOrder.indexOf(currentStatus) + 1;
                        
                        return (
                          <div className="progress-line" style={{ 
                            position: 'absolute', 
                            top: 12, 
                            left: '12.5%', 
                            height: 2, 
                            backgroundColor: 'var(--accent-primary)', 
                            zIndex: 0,
                            width: `calc(${(currentIndex / 3) * 75}%)`,
                            transition: 'width 0.8s ease-in-out'
                          }}></div>
                        );
                      })()}
                      
                      {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                        const currentStatus = trackResult.status || 'Processing';
                        const statusOrder = ['Processing', 'Shipped', 'Delivered'];
                        const currentIndex = statusOrder.indexOf(currentStatus) + 1;
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;
                        
                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1, position: 'relative' }}>
                            <div style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: 'var(--bg-surface)',
                              border: `2px solid ${isCompleted ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                              position: 'absolute',
                              top: 4,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              transition: 'all 0.4s ease-in-out',
                              transitionDelay: `${idx * 0.15}s`,
                              boxShadow: isCurrent ? '0 0 0 3px rgba(196, 91, 54, 0.2)' : 'none'
                            }}>
                              {isCompleted && <div style={{ width: 6, height: 6, backgroundColor: 'var(--accent-primary)', borderRadius: '50%', margin: '4px auto' }}></div>}
                            </div>
                            <span style={{ 
                              marginTop: 28,
                              fontSize: 'clamp(9px, 2.5vw, 11px)', 
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)',
                              transition: 'color 0.4s ease-in-out',
                              transitionDelay: `${idx * 0.15}s`,
                              textAlign: 'center'
                            }}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ padding: 20, backgroundColor: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
                      <h4 style={{ margin: 0, fontSize: 18 }}>Order Details</h4>
                      <span className={`status-badge status-${trackResult.status ? trackResult.status.toLowerCase() : 'processing'}`} style={{ padding: '6px 12px', fontSize: 13 }}>{trackResult.status || 'Processing'}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Order ID</span>
                        <strong style={{ color: 'var(--text-main)' }}>{trackResult.id}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date Placed</span>
                        <strong style={{ color: 'var(--text-main)' }}>{trackResult.date}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Customer</span>
                        <strong style={{ color: 'var(--text-main)' }}>{trackResult.customer}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTop: '1px dashed var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Amount</span>
                        <strong style={{ color: 'var(--accent-primary)', fontSize: 16 }}>{trackResult.amount}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {showSignInModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 400, textAlign: 'center' }}>
            <div className="modal-header">
              <h3>Sign Up</h3>
              <button className="modal-close" onClick={() => setShowSignInModal(false)}>×</button>
            </div>
            <div style={{ padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 style={{ margin: '0 0 10px 0' }}>Coming Soon!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Customer sign up features and personal accounts are currently under development.</p>
              <button className="btn-primary" style={{ width: '100%', padding: 12 }} onClick={() => setShowSignInModal(false)}>Got it</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Header;
