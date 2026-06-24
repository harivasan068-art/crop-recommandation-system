const Badge = ({ children, variant = 'secondary' }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

export default Badge;
