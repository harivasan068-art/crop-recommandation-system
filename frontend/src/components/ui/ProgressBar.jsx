const ProgressBar = ({ value = 0, variant = 'primary' }) => (
  <div className="progress-bar">
    <div
      className={`progress-bar-fill ${variant !== 'primary' ? variant : ''}`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export default ProgressBar;
