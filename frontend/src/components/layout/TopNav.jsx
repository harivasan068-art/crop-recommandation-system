import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopNav = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
      </div>

      <div className="topnav-right">
        <div className="topnav-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.fullName || 'User'}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
