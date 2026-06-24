import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  tasks: 'Tasks',
  analytics: 'Analytics',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
};

const Breadcrumb = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment;
    const isLast = index === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/dashboard">
        <Home size={14} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChevronRight size={14} className="breadcrumb-separator" />
          {crumb.isLast ? (
            <span className="breadcrumb-current">{crumb.label}</span>
          ) : (
            <Link to={crumb.path}>{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
