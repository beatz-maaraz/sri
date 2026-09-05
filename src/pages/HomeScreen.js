import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="home-screen">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Authentic Indian Handmade Artifacts</div>
          <h1 className="hero-title">Handcrafted<br/>Elegance by Master<br/>Artisans</h1>
          <p className="hero-desc">
            Discover time-honored Indian craft traditions. From heritage terracotta pottery to intricate block prints and hand-carved wood accents, every piece preserves cultural ancestry with sustainable beauty.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Collection</button>
            <button className="btn-secondary" onClick={() => navigate('/product')}>View Hand-painted Diya (₹160)</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80" alt="Master Artisans" />
          <div className="hero-featured-card">
            <div className="featured-info">
              <span className="featured-label">Featured Craft of the Week</span>
              <span className="featured-title">Terracotta Sculpted Vessel</span>
            </div>
            <div className="featured-price">₹550</div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Browse by Category</h2>
          <a href="#collections" className="section-link">Curated Collections →</a>
        </div>
        <div className="category-grid">
          {[
            { title: 'Pottery', icon: '🏺' },
            { title: 'Paintings', icon: '🖼️' },
            { title: 'Home Decor', icon: '🏮' },
            { title: 'Woodcraft', icon: '🪵' },
            { title: 'Textiles', icon: '🧵' }
          ].map(cat => (
            <div key={cat.title} className="category-card" onClick={() => navigate('/product')}>
              <div className="category-icon" style={{ fontSize: 24 }}>{cat.icon}</div>
              <span className="category-title">{cat.title}</span>
            </div>
          ))}
          <div className="category-card view-all">
            <div className="category-icon">→</div>
            <span className="category-title">More (View All)</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-header" style={{ marginBottom: 8 }}>
          <h2>Scroll Box Showcase</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</button>
            <button style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</button>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Horizontal curated showcase of authentic hand-made artifacts.</p>
        
        <div className="product-grid hide-scrollbar">
          {[
            { id: 1, label: 'Handmade', cat: 'Metal Craft', title: 'Engraved Brass Diya', desc: 'Forged and polished by traditional artisans using centuries old casting methods.', price: '₹450', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=400&q=80' },
            { id: 2, label: 'Eco-Friendly', cat: 'Pottery', title: 'Terracotta Dining Platter', desc: 'Organic clay kiln-fired to perfection with natural ochre mineral pigments.', price: '₹320', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80' },
            { id: 3, label: 'Featured in Season', cat: 'Artisan Diya', title: 'Traditional Clay Diya Set', desc: 'Featured item connected to detail sheet below. Crafted with purified river clay.', price: '₹160', oldPrice: '₹200', img: 'https://images.unsplash.com/photo-1602498456745-e9503b30470b?auto=format&fit=crop&w=400&q=80', isPrimary: true },
            { id: 4, label: 'Woodcraft', cat: 'Art Piece', title: 'Carved Sheesham Trunk', desc: 'Intricate floral jali lattice carved into seasoned solid timber.', price: '₹900', img: 'https://images.unsplash.com/photo-1611076412140-5e3a89047b74?auto=format&fit=crop&w=400&q=80' }
          ].map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate('/product')}>
              <div className="product-image">
                <img src={product.img} alt={product.title} />
                <div className="product-badge">{product.label}</div>
              </div>
              <div className="product-info">
                <div className="product-cat">{product.cat} {product.isPrimary && <span style={{ color: 'var(--text-muted)', textTransform: 'none' }}>Bestseller</span>}</div>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-desc">{product.desc}</p>
                <div className="product-footer">
                  <div className="product-price">
                    {product.price}
                    {product.oldPrice && <span className="product-price-old">{product.oldPrice}</span>}
                  </div>
                  <button className={`btn-add ${product.isPrimary ? 'btn-add-primary' : ''}`}>
                    {product.isPrimary ? 'Inspect Item ↓' : 'Quick Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 40, borderTop: '1px solid var(--border-color)', paddingTop: 40 }}>
        <div className="section-header" style={{ marginBottom: 24, marginTop: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2>Suggestions:</h2>
            <span style={{ fontSize: 10, backgroundColor: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>RECOMMENDED FOR YOU</span>
          </div>
          <a href="#catalog" className="section-link">View Catalog →</a>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Handmade goods matched to your unique creative tastes.</p>
        
        <div className="suggestions-grid hide-scrollbar">
          {[
            { id: 1, cat: 'Traditional pottery', title: 'Clay Diya Decor', price: '₹100', img: 'https://images.unsplash.com/photo-1602498456745-e9503b30470b?auto=format&fit=crop&w=300&q=80', badge: 'Related Match', active: true },
            { id: 2, cat: 'Stoneware pottery', title: 'Ceramic Dhoop Holder', price: '₹210', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80' },
            { id: 3, cat: 'Natural fiber weave', title: 'Jute Coaster Pack', price: '₹150', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=300&q=80' },
            { id: 4, cat: 'Polished sculpture', title: 'Mini Clay Idol', price: '₹350', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=80' },
            { id: 5, cat: 'Aromatic earthenware', title: 'Soy Wax Clay Pot', price: '₹140', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=300&q=80' },
          ].map(item => (
            <div key={item.id} className="suggestion-card" onClick={() => navigate('/product')} style={item.active ? { border: '1px solid var(--accent-primary)' } : {}}>
              <div className="suggestion-image">
                <img src={item.img} alt={item.title} />
                {item.badge && <div className="product-badge" style={{ backgroundColor: 'var(--accent-primary)' }}>{item.badge}</div>}
              </div>
              <div className="suggestion-info">
                <h4 className="suggestion-title">{item.title}</h4>
                <div className="suggestion-cat">{item.cat}</div>
                <div className="suggestion-footer">
                  <div className="suggestion-price">{item.price}</div>
                  {item.active ? (
                    <span style={{ fontSize: 12, color: 'var(--accent-primary)' }}>Details →</span>
                  ) : (
                    <span className="plus-icon">+</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
