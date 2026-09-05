import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  useEffect(() => {
    document.title = "Sri Art - Admin";
    return () => {
      document.title = "Sri Art";
    };
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">Control Panel</div>
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <span>Admin User</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
