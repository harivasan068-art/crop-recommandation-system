const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonCard = () => (
  <div className="card">
    <div className="card-body">
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-text" style={{ width: '80%' }} />
      <Skeleton className="skeleton-text" style={{ width: '60%' }} />
    </div>
  </div>
);

export const SkeletonStats = ({ count = 5 }) => (
  <div className="grid-stats">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card">
        <Skeleton className="skeleton-card" />
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="card">
    <div className="card-body">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="skeleton-text" style={{ height: '2.5rem', marginBottom: '0.75rem' }} />
      ))}
    </div>
  </div>
);

export default Skeleton;
