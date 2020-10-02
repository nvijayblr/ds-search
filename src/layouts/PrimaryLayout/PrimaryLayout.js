import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, withRouter, Redirect, Switch } from "react-router-dom";
import { Layout } from "antd";
import classNames from "classnames";

import GlobalHeader from "../../components/Header/Header";
// import DeviceSearchPage from '../../pages/DeviceSearchPage/DeviceSearchPage';
// import DSMEditor from "../../components/DSM/DSMEditor/DSMEditor";
import DSMSearch from "../../components/DSM/DSMSearch/DSMSearch";
// import DSMViewer from "../../components/DSM/DSMViewer/DSMViewer";

import "./PrimaryLayout.scss";

const { Content } = Layout;

class App extends Component {
  // state = {
  //   isRolesLoaded: true,
  // };

  componentWillMount() {
    // if (!localStorage.getItem('roles-initiated')) {
    //   localStorage.removeItem('roles');
    //   this.setState({ isRolesLoaded: false });
    //   this.getRoles();
    // }
  }

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
        {<Route exact path="/" component={DSMSearch} />}
        {/* {<Route path="/dsm-editor" component={DSMEditor} />}
        {<Route path="/dsm-viewer" component={DSMViewer} />} */}
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    );
  };

  render() {
    const { location } = this.props;
    // const { isRolesLoaded } = this.state;
    const globalContentClasses = classNames("global-content", {
      "global-content-search": location.pathname === "/search",
      "global-content-devices": location.pathname === "/devices",
      "global-content-policies": location.pathname === "/policies",
      "global-content-admin": location.pathname.indexOf("/admin/") === 0,
    });

    return (
      <Layout className="global-layout">
        <GlobalHeader />
        <Content className={globalContentClasses}>{this.routes()}</Content>
      </Layout>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(App);
