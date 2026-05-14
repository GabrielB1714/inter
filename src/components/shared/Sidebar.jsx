function Sidebar({ role, userName, onLogout, items }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-mark">IR</span>
        <div>
          <strong>InterRisk</strong>
          <small>Alertas académicas tempranas</small>
        </div>
      </div>

      <div className="profile-card compact">
        <span className="avatar">{userName.charAt(0)}</span>
        <div>
          <strong>{userName}</strong>
          <small>{role}</small>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        {items.map((item) => (
          <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>
            {item}
          </a>
        ))}
      </nav>

      <button className="ghost-button" type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;
