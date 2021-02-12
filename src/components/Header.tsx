/**
 * Header component
 */

export default function Header(): React.ReactElement {
  return (
    <header className="app-header">
      <nav className="navbar">
        <div className="navbar-icon tooltip-target">
          {/* <img
            src="https://app.meettally.com/webapp/img/tally-icon.a54f733a.svg"
            alt="Tally"
            className="nav-brand"
          /> */}
        </div>
        <div className="navbar-title hidden">Mortgage Calculator</div>
        <div>
          <a href="#/support" className="navbar-icon">
            <img
              src="https://app.meettally.com/webapp/img/help.ca8b80ca.svg"
              alt="Support"
              className="nav-help"
            />
          </a>
        </div>
      </nav>
    </header>
  );
}
