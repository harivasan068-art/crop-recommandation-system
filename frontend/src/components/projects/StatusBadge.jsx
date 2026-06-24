import { getStatusVariant } from '../../utils/helpers';

const StatusBadge = ({ status }) => {
  const variant = getStatusVariant(status);
  const isActive = status === 'In Progress';

  return (
    <span className={`status-badge ${variant}`}>
      <span className={`status-badge-dot ${isActive ? 'pulse' : ''}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
