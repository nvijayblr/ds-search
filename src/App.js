import React from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import moment from 'moment';
import { notification } from 'antd';

import { Provider } from './context';

import { getConnectionPolling } from './services/api';

import UnauthorizedLayout from './layouts/UnauthorizedLayout/UnauthorizedLayout';
import PrimaryLayout from './layouts/PrimaryLayout/PrimaryLayout';
import './App.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // connectionTimeout: 20000
    };
    this.webPingTimer = null;
    this.showNotification = true;
  }

  componentDidMount() {
    // this.networkConnectionPolling();
    // this.handleNetworkConnectionChange();
  }

  componentWillUnmount() {
    if (this.webPingTimer) clearInterval(this.webPingTimer);
  }

  handleNetworkConnectionChange = () => {
    const { connectionTimeout } = this.state;
    this.webPingTimer = setInterval(() => {
      this.networkConnectionPolling();
    }, connectionTimeout);
  };

  handleNotificationClose = () => {
    this.showNotification = true;
  };

  networkConnectionPolling = () => {
    // eslint-disable-next-line react/prop-types
    const { history } = this.props;
    const pageName = history.location.pathname.replace('/', '');
    const auth = localStorage.getItem('auth');
    const parsedAuth = auth ? JSON.parse(auth) : { username: '' };
    const { username } = parsedAuth;
    getConnectionPolling(5000, pageName, username)
      .then(response => {
        this.showNotification = true;
        notification.destroy();
      })
      .catch(error => {
        if (!this.showNotification) return;
        this.showNotification = notification.info({
          message: 'Network Error!',
          description: 'Cannot connect to server, please check the vpn.',
          placement: 'topRight',
          duration: 0,
          onClose: this.handleNotificationClose
        });
      });
  };

  render() {
    return (
      <Provider>
        <Switch>
          <Route path="/public" component={UnauthorizedLayout} />
          <PrivateRoute path="/" component={PrimaryLayout} />
          <Redirect to="/dsm-search" />
        </Switch>
      </Provider>
    );
  }
}

const isAuthenticated = () => {
  return true;
  let auth = localStorage.getItem('auth') || '';

  if (!auth) {
    return false;
  }

  auth = JSON.parse(auth);

  if (!auth.logged_in_till) {
    return false;
  }

  const loginExpiryMoment = moment.unix(auth.logged_in_till);

  if (!loginExpiryMoment.isValid()) {
    return false;
  }

  const loginExpired = moment().isAfter(loginExpiryMoment);

  return !loginExpired;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/public',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default withRouter(App);
