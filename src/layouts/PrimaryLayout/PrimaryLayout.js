import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import { Layout, message } from 'antd';
import classNames from 'classnames';

import GlobalHeader from '../../components/Header/Header';
// import DeviceSearchPage from '../../pages/DeviceSearchPage/DeviceSearchPage';
import DSMEditor from '../../components/DSM/DSMEditor/DSMEditor';
import DSMSearch from '../../components/DSM/DSMSearch/DSMSearch';
import DSMViewer from '../../components/DSM/DSMViewer/DSMViewer';
import { getRolesRequest } from '../../services/api';

import './PrimaryLayout.scss';

const { Content } = Layout;

class App extends Component {
  state = {
    isRolesLoaded: true
  };

  componentWillMount() {
    // if (!localStorage.getItem('roles-initiated')) {
    //   localStorage.removeItem('roles');
    //   this.setState({ isRolesLoaded: false });
    //   this.getRoles();
    // }
  }

  getRoles = () => {
    getRolesRequest()
      .then(response => this.handleGetRolesSuccess(response))
      .catch(error => this.handleGetRolesError());
  };

  handleGetRolesSuccess = response => {
    localStorage.setItem('roles', JSON.stringify(response.data));
    this.setState({ isRolesLoaded: true });
  };

  handleGetRolesError = () => {
    message.error('Unfortunately there was an error, please try again');
  };

  routes = () => {
    // let roles = [];

    // if (localStorage.getItem('roles')) {
    //   roles = JSON.parse(localStorage.getItem('roles'));
    // }

    // localStorage.removeItem('roles-initiated');

    // if (!roles.length) {
    //   message.warning('You have no user roles assigned.');
    // }

    return (
      <Switch>
        {/* {<Route path="/search" component={DeviceSearchPage} />} */}
        {<Route path="/dsm-search" component={DSMSearch} />}
        {<Route path="/dsm-editor" component={DSMEditor} />}
        {<Route path="/dsm-viewer" component={DSMViewer} />}
        {<Redirect to="/dsm-search" />}
      </Switch>
    );
  };

  render() {
    const { location } = this.props;
    const { isRolesLoaded } = this.state;
    const globalContentClasses = classNames('global-content', {
      'global-content-search': location.pathname === '/dsm-search',
      'global-content-devices': location.pathname === '/devices',
      'global-content-policies': location.pathname === '/policies',
      'global-content-admin': location.pathname.indexOf('/admin/') === 0
    });

    return (
      <Layout className="global-layout">
        <GlobalHeader />
        <Content className={globalContentClasses}>
          <Switch>{isRolesLoaded ? this.routes() : ''}</Switch>
        </Content>
      </Layout>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired
};

export default withRouter(App);
