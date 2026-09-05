import React, { useState } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Engraved Brass Diya',
      category: 'Metal Craft',
      price: '₹450',
      stock: 24,
      img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'Terracotta Dining Platter',
      category: 'Pottery',
      price: '₹320',
      stock: 15,
      img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Traditional Clay Diya Set',
      category: 'Artisan Diya',
      price: '₹160',
      stock: 120,
      img: 'https://images.unsplash.com/photo-1602498456745-e9503b30470b?auto=format&fit=crop&w=100&q=80'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Pottery',
    price: '',
    stock: '',
    img: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // Default image if none provided
    const imgUrl = newProduct.img || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100&q=80';
    
    // Add Rupee symbol if omitted
    const priceFormatted = newProduct.price.startsWith('₹') ? newProduct.price : `₹${newProduct.price}`;

    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: priceFormatted,
      stock: parseInt(newProduct.stock) || 0,
      img: imgUrl
    };

    setProducts([productToAdd, ...products]);
    setIsModalOpen(false);
    
    // Reset form
    setNewProduct({
      name: '',
      category: 'Pottery',
      price: '',
      stock: '',
      img: ''
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Products</h2>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add New Product
        </button>
      </div>
      
      <div className="admin-section">
        <div className="admin-table-controls">
          <input type="text" placeholder="Search products..." className="admin-search" />
          <select className="admin-select">
            <option>All Categories</option>
            <option>Pottery</option>
            <option>Woodcraft</option>
            <option>Metal Craft</option>
            <option>Artisan Diya</option>
          </select>
          
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button 
              className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              style={{ backgroundColor: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'inherit' }}
              title="List View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            <button 
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              style={{ backgroundColor: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'inherit' }}
              title="Grid View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button 
              className={`btn-icon ${viewMode === 'masonry' ? 'active' : ''}`}
              onClick={() => setViewMode('masonry')}
              style={{ backgroundColor: viewMode === 'masonry' ? 'var(--accent-primary)' : 'transparent', color: viewMode === 'masonry' ? 'white' : 'inherit' }}
              title="Masonry View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            </button>
          </div>
        </div>
        
        {viewMode === 'list' ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-table-img">
                        <img src={product.img} alt={product.name} />
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>
                      <span style={{ color: product.stock < 20 ? 'var(--accent-primary)' : 'inherit', fontWeight: product.stock < 20 ? 600 : 'normal' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Edit">✏️</button>
                      <button className="btn-icon" title="Delete" onClick={() => handleDelete(product.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
            gap: '24px', 
            alignItems: viewMode === 'masonry' ? 'start' : 'stretch',
            marginTop: '20px'
          }}>
            {products.map((product, index) => (
              <div key={product.id} style={{ 
                backgroundColor: 'var(--bg-surface)', 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                height: viewMode === 'masonry' ? (index % 2 === 0 ? 'auto' : '100%') : '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ height: viewMode === 'masonry' ? (index % 2 === 0 ? '160px' : '220px') : '180px', width: '100%', backgroundColor: '#eee', position: 'relative' }}>
                  <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {product.stock < 20 && (
                    <div style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Low Stock
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>{product.category}</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)', lineHeight: '1.3' }}>{product.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>{product.price}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{product.stock} in stock</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '6px' }}>Edit</button>
                    <button className="btn-secondary" style={{ padding: '6px', color: '#d32f2f', borderColor: '#ffcdd2' }} onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={newProduct.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={newProduct.category} onChange={handleInputChange}>
                    <option>Pottery</option>
                    <option>Woodcraft</option>
                    <option>Metal Craft</option>
                    <option>Artisan Diya</option>
                    <option>Textiles</option>
                    <option>Paintings</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={newProduct.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Initial Stock</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={newProduct.stock} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input 
                  type="url" 
                  name="img"
                  value={newProduct.img} 
                  onChange={handleInputChange} 
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
