import Skeleton from '../ui/Skeleton';

const ProjectCardSkeleton = ({ index = 0 }) => (
  <div
    className="project-card-skeleton"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
      <Skeleton style={{ width: '42px', height: '42px', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <Skeleton className="skeleton-title" style={{ width: '70%' }} />
        <Skeleton className="skeleton-text" style={{ width: '40%' }} />
      </div>
      <Skeleton style={{ width: '80px', height: '24px', borderRadius: '999px' }} />
    </div>
    <Skeleton className="skeleton-text" style={{ width: '100%', marginBottom: '0.5rem' }} />
    <Skeleton className="skeleton-text" style={{ width: '85%', marginBottom: '1.25rem' }} />
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
      <Skeleton style={{ width: '120px', height: '28px', borderRadius: '8px' }} />
      <Skeleton style={{ width: '120px', height: '28px', borderRadius: '8px' }} />
    </div>
    <Skeleton style={{ width: '100%', height: '52px', borderRadius: '8px', marginBottom: '1rem' }} />
    <Skeleton style={{ width: '100%', height: '36px', borderRadius: '8px' }} />
  </div>
);

export default ProjectCardSkeleton;
