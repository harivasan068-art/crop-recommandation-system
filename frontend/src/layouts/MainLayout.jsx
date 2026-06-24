import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import Breadcrumb from '../components/layout/Breadcrumb';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <TopNav onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="main-content">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
