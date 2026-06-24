import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-semibold' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Project Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/projects" className={navLinkClass}>
                Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tasks" className={navLinkClass}>
                Tasks
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white-50 small d-none d-md-inline">
              {user?.fullName}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
