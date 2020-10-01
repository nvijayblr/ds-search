/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint jsx-a11y/anchor-is-valid: [0] */
import React, { Component } from 'react';
import { withRouter, matchPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

import './Nav.scss';

class Nav extends Component {
  state = { selectedMenuItem: '', isMobileNavExapnded: false };

  componentDidMount() {
    const { history } = this.props;

    this.setActiveMenuItem();

    this.historyUnlisten = history.listen((location, action) => {
      this.setActiveMenuItem();
    });
  }

  componentWillUnmount() {
    this.historyUnlisten();
  }

  setActiveMenuItem() {
    const match = matchPath(window.location.pathname, {
      path: '/:section',
      strict: false
    });

    if (match) {
      this.setState({ selectedMenuItem: match.params.section });
    }
  }

  getSelectedClass = menu => {
    const { selectedMenuItem } = this.state;
    return selectedMenuItem === menu ? 'selected' : '';
  };

  expandCollapseNav = e => {
    e.preventDefault();
    const { isMobileNavExapnded } = this.state;
    this.setState({ isMobileNavExapnded: !isMobileNavExapnded });
  };

  signout = e => {
    const { history } = this.props;

    e.preventDefault();
    localStorage.removeItem('auth');
    localStorage.removeItem('roles');
    history.push('/public/login');
  };

  render() {
    const { selectedMenuItem, isMobileNavExapnded } = this.state;
    let roles = [];

    if (localStorage.getItem('roles')) {
      roles = JSON.parse(localStorage.getItem('roles'));
    }

    return (
      <>
        <div className="mobile-nav">
          <div
            className={`nav-toggle ${isMobileNavExapnded ? 'expanded' : ''}`}
            onClick={e => {
              this.expandCollapseNav(e);
            }}
          >
            <span className="nav-toggle-bar" />
          </div>
          <nav
            className={`nav ${isMobileNavExapnded ? 'expanded' : ''}`}
            onClick={e => {
              this.expandCollapseNav(e);
            }}
          >
            <ul>
              {roles.includes('search') && (
                <li className={this.getSelectedClass('search')}>
                  <Link to="/dsm-search">Search</Link>
                </li>
              )}
              <li className="seperator">
                <a href="#" className="reportBugLink">
                  Report Bug
                </a>
              </li>
              <li>
                <a href="#" className="reportNewFeatureLink">
                  Report New Feature
                </a>
              </li>
              <li>
                <a href="#" onClick={e => this.signout(e)}>
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <Menu selectedKeys={[selectedMenuItem]} mode="horizontal" theme="dark">
          {/* {roles.includes('search') && (
            <Menu.Item key="search">
              <Link to="/search">Search</Link>
            </Menu.Item>
          )} */}
          <Menu.Item key="dsm-search">
            <Link to="/dsm-search">DSM Search</Link>
          </Menu.Item>
          <Menu.Item key="dsm-editor">
            <Link to="/dsm-editor">DSM Editor</Link>
          </Menu.Item>
          <Menu.Item key="dsm-viewer">
            <Link to="/dsm-viewer">DSM Viewer</Link>
          </Menu.Item>
        </Menu>
      </>
    );
  }
}

Nav.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Nav);
