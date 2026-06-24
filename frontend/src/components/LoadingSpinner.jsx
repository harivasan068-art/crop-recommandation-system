const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="spinner-container">
    <div className="spinner" />
    <p>{text}</p>
  </div>
);

export default LoadingSpinner;
