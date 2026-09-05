import React, { useState, useEffect } from 'react';

const initialSettings = {
  // General
  storeName: 'Sri Art',
  contactEmail: 'contact@sriart.com',
  phoneNumber: '+91 9876543210',
  instagramUrl: 'https://instagram.com/sriart',
  facebookUrl: 'https://facebook.com/sriart',
  currency: 'INR',
  maintenanceMode: false,
  
  // Payments & Shipping
  enableStripe: true,
  enablePayPal: false,
  enableUPI: true,
  shippingMode: 'flat', // flat, weight, free
  flatShippingRate: 50,
  
  // Theme & UI
  primaryColor: '#c45b36',
  enableAnimations: true,
  cardLayout: 'grid', // grid, list, masonry
  
  // Promotions
  activeBannerText: 'Welcome to Sri Art! Free shipping on orders over ₹1000.',
  enableDiscounts: true
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState('');
  
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [cloudFiles, setCloudFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      try {
        const parsed = { ...initialSettings, ...JSON.parse(saved) };
        setSettings(parsed);
        setSavedSettings(parsed);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleCloudUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files).map(f => {
      const isImage = f.type.startsWith('image/');
      return {
        name: f.name,
        size: (f.size / 1024).toFixed(2) + ' KB',
        date: new Date().toLocaleDateString(),
        id: Date.now() + Math.random(),
        type: f.type || 'Unknown File',
        preview: isImage ? URL.createObjectURL(f) : null
      };
    });
    
    setCloudFiles(prev => [...prev, ...newFiles]);
    event.target.value = null; // reset input
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSavedSettings(settings);
    
    // Apply dynamic theme changes if any
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--accent-primary', settings.primaryColor);
    }
    
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleExportData = (format) => {
    const ordersData = localStorage.getItem('adminOrders') || '[]';
    const orders = JSON.parse(ordersData);
    
    if (orders.length === 0) {
      alert("No data available to export.");
      return;
    }

    let content = '';
    let mimeType = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify({ exportedAt: new Date().toISOString(), orders }, null, 2);
      mimeType = 'application/json';
      filename = `sri-art-export-${new Date().toISOString().split('T')[0]}.json`;
    } else if (format === 'csv') {
      const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Amount', 'Status', 'Payment Method'];
      const rows = orders.map(o => [
        o.id, 
        o.date, 
        `"${o.customer}"`, 
        `"${o.email || 'N/A'}"`,
        o.amount.replace('₹', ''), 
        o.status,
        o.paymentMethod || 'Credit Card'
      ]);
      
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      mimeType = 'text/csv';
      filename = `sri-art-export-${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          if (data.orders) {
            localStorage.setItem('adminOrders', JSON.stringify(data.orders));
            alert("Data imported successfully!");
          } else {
            alert("Invalid JSON format. Make sure it contains an 'orders' array.");
          }
        } else {
          alert("Only JSON files are supported for import at this time.");
        }
      } catch (err) {
        console.error("Failed to parse imported file", err);
        alert("Failed to read the file. Please ensure it's a valid JSON export.");
      }
    };
    reader.readAsText(file);
    
    event.target.value = null;
  };

  const handleWipeData = () => {
    if (window.confirm("WARNING: This will delete all orders and customer data. Are you sure?")) {
      localStorage.removeItem('adminOrders');
      alert("All data has been wiped.");
    }
  };

  const tabs = [
    { 
      id: 'general', 
      label: 'General Configuration',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    },
    { 
      id: 'payments', 
      label: 'Payments & Shipping',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
    },
    { 
      id: 'theme', 
      label: 'Theme & UI Experience',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
    },
    { 
      id: 'promotions', 
      label: 'Promotional Offers',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
    },
    { 
      id: 'data', 
      label: 'Data Management',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
    },
    {
      id: 'cloud',
      label: 'Cloud Sync',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
    }
  ];

  return (
    <div className="admin-page" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            Store Settings
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Configure your storefront experience and integrations.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saveStatus && <span style={{ color: 'var(--success-color, #2e7d32)', fontSize: '14px', fontWeight: 500, backgroundColor: 'rgba(46,125,50,0.1)', padding: '6px 12px', borderRadius: '20px' }}>{saveStatus}</span>}
          {hasChanges && (
            <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flex: 1, overflow: 'hidden' }} className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar" style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '40px', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>{tabs.find(t => t.id === 'general').icon}</span>
                  General Configuration
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Basic details about your artisan studio.</p>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Store Name</label>
                <input type="text" value={settings.storeName} onChange={(e) => handleChange('storeName', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Contact Email</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Phone Number</label>
                <input type="tel" value={settings.phoneNumber || ''} onChange={(e) => handleChange('phoneNumber', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} placeholder="+91 98765 43210" />
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>
              
              <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)' }}>Social Media Profiles</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Instagram URL</label>
                    <input type="url" value={settings.instagramUrl || ''} onChange={(e) => handleChange('instagramUrl', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} placeholder="https://instagram.com/yourstore" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Facebook URL</label>
                    <input type="url" value={settings.facebookUrl || ''} onChange={(e) => handleChange('facebookUrl', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} placeholder="https://facebook.com/yourstore" />
                  </div>
                </div>
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Default Currency</label>
                <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px', cursor: 'pointer' }}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" id="maintenance" checked={settings.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', flexShrink: 0 }} />
                <label htmlFor="maintenance" style={{ fontWeight: 600, cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                  Enable Maintenance Mode
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Hide the storefront from customers while making updates.</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '600px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>{tabs.find(t => t.id === 'payments').icon}</span>
                  Payments & Shipping
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Select which payment methods are available to customers at checkout.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { id: 'enableStripe', label: 'Stripe', sub: 'Credit & Debit Cards' },
                    { id: 'enableUPI', label: 'UPI Payments', sub: 'Google Pay, PhonePe, Paytm (India)' },
                    { id: 'enablePayPal', label: 'PayPal', sub: 'International Wallets' }
                  ].map(gate => (
                    <label key={gate.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', border: `2px solid ${settings[gate.id] ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '12px', cursor: 'pointer', backgroundColor: settings[gate.id] ? 'rgba(196, 91, 54, 0.03)' : 'var(--bg-body)', transition: 'all 0.2s' }}>
                      <input type="checkbox" checked={settings[gate.id]} onChange={(e) => handleChange(gate.id, e.target.checked)} style={{ width: '22px', height: '22px', accentColor: 'var(--accent-primary)' }} />
                      <div>
                        <span style={{ fontWeight: 600, display: 'block', fontSize: '16px' }}>{gate.label}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{gate.sub}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Shipping Rules</h3>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Calculation Method</label>
                  <select value={settings.shippingMode} onChange={(e) => handleChange('shippingMode', e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }}>
                    <option value="flat">Flat Rate</option>
                    <option value="weight">Weight Based</option>
                    <option value="free">Free Shipping (Global)</option>
                  </select>
                </div>
                {settings.shippingMode === 'flat' && (
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Flat Rate Amount (₹)</label>
                    <input type="number" value={settings.flatShippingRate} onChange={(e) => handleChange('flatShippingRate', parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>{tabs.find(t => t.id === 'theme').icon}</span>
                  Theme & UI Experience
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Changes made here will instantly reflect across the storefront.</p>
              </div>
              
              <div className="form-group" style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', marginBottom: '16px', fontWeight: 600, fontSize: '16px' }}>Primary Brand Color</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', padding: '4px', border: '2px solid var(--border-color)', backgroundColor: 'white' }}>
                    <input type="color" value={settings.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} style={{ width: '100%', height: '100%', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                  </div>
                  <input type="text" value={settings.primaryColor} onChange={(e) => handleChange('primaryColor', e.target.value)} style={{ width: '140px', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '16px', fontWeight: 500, fontFamily: 'monospace' }} />
                </div>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '16px', fontWeight: 600, fontSize: '16px' }}>Product Card Layout</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['grid', 'list', 'masonry'].map(layout => (
                    <label key={layout} style={{ flex: 1, padding: '20px', border: `2px solid ${settings.cardLayout === layout ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: settings.cardLayout === layout ? 'rgba(196, 91, 54, 0.03)' : 'var(--bg-body)', transition: 'all 0.2s', boxShadow: settings.cardLayout === layout ? '0 4px 12px rgba(196, 91, 54, 0.1)' : 'none' }}>
                      <input type="radio" name="layout" value={layout} checked={settings.cardLayout === layout} onChange={(e) => handleChange('cardLayout', e.target.value)} style={{ display: 'none' }} />
                      
                      {layout === 'grid' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={settings.cardLayout === layout ? "var(--accent-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
                      {layout === 'list' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={settings.cardLayout === layout ? "var(--accent-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>}
                      {layout === 'masonry' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={settings.cardLayout === layout ? "var(--accent-primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>}
                      
                      <div style={{ textTransform: 'capitalize', fontWeight: settings.cardLayout === layout ? 700 : 500, color: settings.cardLayout === layout ? 'var(--text-main)' : 'var(--text-muted)' }}>{layout}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" id="animations" checked={settings.enableAnimations} onChange={(e) => handleChange('enableAnimations', e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }} />
                <label htmlFor="animations" style={{ fontWeight: 600, cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                  Enable Micro-animations
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Turns on hover transitions and entrance animations globally.</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>{tabs.find(t => t.id === 'promotions').icon}</span>
                  Promotional Offers & Banners
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure sales, global banners, and discount rules.</p>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>Global Announcement Banner</label>
                <textarea 
                  value={settings.activeBannerText} 
                  onChange={(e) => handleChange('activeBannerText', e.target.value)} 
                  placeholder="Enter text to display at the top of the storefront (leave empty to hide)"
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '100px', fontFamily: 'inherit', resize: 'vertical', backgroundColor: 'var(--bg-body)', fontSize: '15px' }} 
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <input type="checkbox" id="discounts" checked={settings.enableDiscounts} onChange={(e) => handleChange('enableDiscounts', e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }} />
                <label htmlFor="discounts" style={{ fontWeight: 600, cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                  Enable Discount Codes
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Allow customers to apply coupon codes at checkout.</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>{tabs.find(t => t.id === 'data').icon}</span>
                  Data Management
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage local data, export records, or factory reset the application.</p>
              </div>
              
              <div style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Export Store Data</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Download all customer orders, payment methods, and tracking details to your device.</p>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => handleExportData('csv')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export as CSV
                  </button>
                  <button onClick={() => handleExportData('json')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Export as JSON
                  </button>
                </div>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Import Store Data</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Upload a JSON export file to restore orders data.</p>
                
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    style={{ display: 'none' }}
                    id="import-data-input"
                  />
                  <label htmlFor="import-data-input" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'white', fontWeight: 500 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Import JSON File
                  </label>
                </div>
              </div>

              <div style={{ padding: '32px', border: '1px solid #ffcdd2', backgroundColor: '#fff5f5', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  <h4 style={{ color: '#d32f2f', margin: 0, fontSize: '18px' }}>Danger Zone</h4>
                </div>
                <p style={{ color: '#b71c1c', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>Wiping data will permanently delete all orders, customer records, and reset tracking history. This action cannot be undone.</p>
                <button onClick={handleWipeData} style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  Wipe All Store Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>{tabs.find(t => t.id === 'cloud').icon}</span>
                  Cloud Sync & Integrations
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your cloud connectivity and data synchronization.</p>
              </div>
              
              <div style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                      Cloud Connectivity
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Connect your account to enable automatic backups and file uploads.</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(46,125,50,0.1)', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>Connected</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                  <button className="btn-primary" onClick={() => alert('Syncing data... All data is up to date.')} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    Force Sync Now
                  </button>
                </div>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    Cloud Files
                  </h4>
                  
                  <label htmlFor="cloud-upload-btn" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', margin: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Upload File
                  </label>
                  <input type="file" id="cloud-upload-btn" multiple onChange={handleCloudUpload} style={{ display: 'none' }} />
                </div>
                
                {cloudFiles.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: '12px' }}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                    <p style={{ margin: 0, fontSize: '14px' }}>No files uploaded to the cloud yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cloudFiles.map(file => (
                      <div key={file.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', transition: 'transform 0.2s ease', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }}
                          onClick={() => setSelectedFile(file)}
                        >
                          <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(196, 91, 54, 0.1)', color: 'var(--accent-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {file.preview ? (
                              <img src={file.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                            )}
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{file.name}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{file.size} • Uploaded on {file.date}</p>
                          </div>
                        </div>
                        <button 
                          style={{ color: '#d32f2f', padding: '8px', borderRadius: '4px', display: 'flex', opacity: 0.8, transition: 'opacity 0.2s', marginLeft: '12px', flexShrink: 0 }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
                          onClick={() => setCloudFiles(cloudFiles.filter(f => f.id !== file.id))}
                          title="Delete File"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* File Details Modal */}
      {selectedFile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedFile(null)}>
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>File Details</h3>
              <button onClick={() => setSelectedFile(null)} style={{ color: 'var(--text-muted)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3' }}>
              {selectedFile.preview ? (
                <img src={selectedFile.preview} alt={selectedFile.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Name:</span>
                <span style={{ fontWeight: 600, fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={selectedFile.name}>{selectedFile.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Type:</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{selectedFile.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Size:</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{selectedFile.size}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Uploaded:</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{selectedFile.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
