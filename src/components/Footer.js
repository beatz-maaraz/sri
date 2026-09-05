import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="footer-logo">
            <div className="logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>SA</div>
            <h1 style={{ fontSize: 20, fontFamily: 'Playfair Display, serif' }}>Sri Art</h1>
          </div>
          <p className="footer-desc">
            Preserving indigenous handicrafts, terracotta crafts, and fluid artistry with direct artisan-to-client e-commerce.
          </p>
        </div>
        
        <div className="footer-col">
          <h3>Shop Categories</h3>
          <ul>
            <li><a href="#pottery">Terracotta & Ceramics</a></li>
            <li><a href="#woodcraft">Sheesham Woodcraft</a></li>
            <li><a href="#brass">Brass & Metal Sculptures</a></li>
            <li><a href="#gifts">Handmade Gifts under ₹500</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Customer Support</h3>
          <ul>
            <li><a href="#track">Track Your Parcel</a></li>
            <li><a href="#guarantee">Artisan Authenticity Guarantee</a></li>
            <li><a href="#corporate">Bulk & Custom Corporate Orders</a></li>
            <li><a href="#shipping">Shipping Policy (All India)</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Artisan Journal</h3>
          <p className="newsletter-desc">Receive stories of craftsmen, newly curated batches, and exclusive access.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="your email address" />
            <button>Join</button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div>© 2026 Sri Art Studio. Inspired directly by artisan design concept.</div>
        <div className="footer-links">
          <a href="#about">About Sri Art</a>
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
