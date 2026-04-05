export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dash-shell">
      <div className="dash-bg" aria-hidden="true">
        <div className="dash-orb dash-orb-1" />
        <div className="dash-orb dash-orb-2" />
        <div className="dash-orb dash-orb-3" />
      </div>

      <nav className="dash-nav">
        <div className="dash-nav-inner">
          <div className="dash-brand">
            Auth Ecosystem
          </div>
          <div className="dash-nav-actions">
            <span className="dash-session">Authorized Session Active</span>
            <a href="/api/auth/logout" className="dash-logout">
              Sign Out
            </a>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
