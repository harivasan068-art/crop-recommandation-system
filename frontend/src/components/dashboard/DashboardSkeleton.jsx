import Skeleton from '../ui/Skeleton';

const DashboardSkeleton = () => (
  <div className="dashboard-page">
    <Skeleton className="dashboard-skeleton-hero" />
    <div className="dashboard-skeleton-stats">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="dashboard-skeleton-stat" />
      ))}
    </div>
    <div className="dashboard-main-grid">
      <div className="dashboard-charts-left">
        <Skeleton style={{ height: '320px', borderRadius: '12px' }} />
        <Skeleton style={{ height: '280px', borderRadius: '12px' }} />
      </div>
      <Skeleton style={{ height: '400px', borderRadius: '12px' }} />
    </div>
    <div className="dashboard-bottom-grid" style={{ marginTop: '1.25rem' }}>
      <Skeleton style={{ height: '300px', borderRadius: '12px' }} />
      <Skeleton style={{ height: '300px', borderRadius: '12px' }} />
    </div>
  </div>
);

export default DashboardSkeleton;
