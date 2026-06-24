import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  const infoItems = [
    { icon: User, label: 'Full Name', value: user?.fullName },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Shield, label: 'Account Status', value: 'Active' },
    { icon: Calendar, label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      <div className="card" style={{ maxWidth: '640px' }}>
        <div className="card-header">
          <h2 className="card-title">Profile Information</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.25rem' }}>
              {user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>{user?.fullName}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.125rem' }}>
                    {label}
                  </p>
                  <p style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
