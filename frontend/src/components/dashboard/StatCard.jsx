import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, variant, trend, link, index = 0 }) => (
  <Link
    to={link}
    className="dashboard-stat-card"
    data-variant={variant}
    style={{ animationDelay: `${index * 70}ms` }}
  >
    <div className="dashboard-stat-top">
      <div>
        <p className="dashboard-stat-label">{title}</p>
        <p className="dashboard-stat-value">{value}</p>
      </div>
      <div className={`dashboard-stat-icon ${variant}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="dashboard-stat-footer">
      <span className={`dashboard-stat-trend ${trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'}`}>
        {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : null}
        {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : '—'}
      </span>
      <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>vs last month</span>
    </div>
  </Link>
);

export default StatCard;
