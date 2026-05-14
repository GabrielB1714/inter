import Sidebar from '../shared/Sidebar.jsx';

function DashboardShell({ role, userName, onLogout, items, title, subtitle, children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} userName={userName} onLogout={onLogout} items={items} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Detección temprana</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="header-status">
            <span className="pulse" />
            Modelo ML futuro: Scikit-learn
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default DashboardShell;
