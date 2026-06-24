const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="empty-state">
    {Icon && (
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
    )}
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

export default EmptyState;
