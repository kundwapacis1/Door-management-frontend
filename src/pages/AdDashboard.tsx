import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(to bottom, #181e2a, #181e2a 100%)', color: '#fff' }}>
      <aside style={{ width: 260, background: '#181e2a', padding: 24, borderRight: '1px solid #222' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Smart Door Admin</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 18 }}>Dashboard</li>
            <li style={{ marginBottom: 18 }}>Manage Users</li>
            <li style={{ marginBottom: 18 }}>Doors</li>
            <li style={{ marginBottom: 18 }}>Door Control</li>
            <li style={{ marginBottom: 18 }}>View Logs</li>
            <hr style={{ margin: '18px 0', borderColor: '#222' }} />
            <li>Logout</li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 40 }}>
        <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 32 }}>Dashboard</h2>
        <div style={{ display: 'flex', gap: 60, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Total Users</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>-</div>
          </div>
          <div>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Total Doors</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>-</div>
          </div>
          <div>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Total Devices</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>-</div>
          </div>
          <div>
            <div style={{ fontSize: 22, marginBottom: 8 }}>Recent Logs</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>-</div>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default DashboardPage;
