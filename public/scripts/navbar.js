var Navbar = React.createClass({
  render: function () {
    return (
      <div className="b-navbar">
        <span className="b-navbar__logo">rija</span>
        <ul className="b-navbar__menu b-navbar__menu-right">
          <li className="b-navbar__menu__element">
            <a className="b-navbar__menu__element__link" href="/logout/">Logout</a>
          </li>
        </ul>
        <ul className="b-navbar__menu">
          <li className="b-navbar__menu__element b-navbar__menu__element_active">
            <a className="b-navbar__menu__element__link" href="/projects/">Projects</a>
          </li>
        </ul>
      </div>
    );
  }
});

React.render(
  <Navbar/>,
  document.getElementById('navbar')
);
