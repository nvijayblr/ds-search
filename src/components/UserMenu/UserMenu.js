/* eslint jsx-a11y/anchor-is-valid: [0] */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, message, Switch } from 'antd';
import Script from 'react-load-script';

import './UserMenu.scss';

class UserMenu extends Component {
  state = {
    isDarkMode: false
  };

  componentWillMount = () => {
    const isDarkMode = JSON.parse(localStorage.getItem('dsm-dark-mode'));
    if (isDarkMode) {
      document.querySelector('body').className = `${isDarkMode ? 'dark-theme' : 'light-theme'}`;
      this.setState({ isDarkMode });
    }
  };

  signout = e => {
    const { history } = this.props;

    e.preventDefault();
    localStorage.removeItem('auth');
    localStorage.removeItem('roles');
    history.push('/public/login');
  };

  handleJiraScriptError = () => {
    message.error(
      'Unfortunately there was an error related to the JIRA issue collector - you will not be able to report any issues.'
    );
  };

  handleJiraScriptLoad = () => {
    window.ATL_JQ_PAGE_PROPS = {
      triggerFunction: showCollectorDialog => {
        document.querySelectorAll('.reportBugLink').forEach(item => {
          item.addEventListener('click', e => {
            window.ATL_JQ_PAGE_PROPS.fieldValues.summary = '[Bug]: ';
            e.preventDefault();
            showCollectorDialog();
          });
        });
        document.querySelectorAll('.reportNewFeatureLink').forEach(item => {
          item.addEventListener('click', e => {
            window.ATL_JQ_PAGE_PROPS.fieldValues.summary = '[NewFeature]: ';
            e.preventDefault();
            showCollectorDialog();
          });
        });
      },
      fieldValues: {
        summary: '[Bug]: '
      }
    };
  };

  changeTheme = e => {
    const { isDarkMode } = this.state;
    this.setState({ isDarkMode: !isDarkMode }, () => {
      // eslint-disable-next-line no-shadow
      const { isDarkMode } = this.state;
      document.querySelector('body').className = `${isDarkMode ? 'dark-theme' : 'light-theme'}`;
      localStorage.setItem('dsm-dark-mode', JSON.stringify(isDarkMode));
    });
  };

  render() {
    const jiraScriptUrl =
      'https://jira.lgi.io/s/d2f11eb2426a5845d2ad6d6592ab1479-T/k0n5ws/76002/23aeed5035eb07e911417ba4d45ad09e/2.0.24/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=23a3f869';
    const { isDarkMode } = this.state;

    return (
      <>
        <div className="user-menu">
          <div className="theme-switch">
            <label>Dark</label>
            <Switch checked={isDarkMode} onChange={this.changeTheme} />
          </div>
          {/* <div className="dropdown-menu">
            <div className="submenu-title">
              <Icon type="edit" />
              <span className="text">Report Issue</span>
              <div className="ant-menu-submenu-popup">
                <ul className="ant-menu ant-menu-sub">
                  <li className="ant-menu-item">
                    <a className="reportBugLink sub-menu-link" href="#">
                      <span className="text">Bug</span>
                    </a>
                  </li>
                  <li className="ant-menu-item">
                    <a className="reportNewFeatureLink sub-menu-link" href="#">
                      <span className="text">New Feature</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
          {/* <a className="user-menu-item" href="#" onClick={e => this.signout(e)}>
            <Icon type="lock" />
            <span className="text">Sign Out</span>
          </a> */}
        </div>
        {/* <Script
          url={jiraScriptUrl}
          onError={this.handleJiraScriptError}
          onLoad={this.handleJiraScriptLoad}
        /> */}
      </>
    );
  }
}

UserMenu.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(UserMenu);
