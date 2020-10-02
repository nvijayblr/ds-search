import React from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
// import moment from "moment";

import { Provider } from "./context";
import UnauthorizedLayout from "./layouts/UnauthorizedLayout/UnauthorizedLayout";
import PrimaryLayout from "./layouts/PrimaryLayout/PrimaryLayout";
import "./App.scss";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // connectionTimeout: 20000
    };
    this.webPingTimer = null;
    this.showNotification = true;
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Provider>
        <Switch>
          <Route path="/public" component={UnauthorizedLayout} />
          <PrivateRoute path="/" component={PrimaryLayout} />
          <Redirect to="/search" />
        </Switch>
      </Provider>
    );
  }
}

const isAuthenticated = () => {
  return true;
  // let auth = localStorage.getItem("auth") || "";

  // if (!auth) {
  //   return false;
  // }

  // auth = JSON.parse(auth);

  // if (!auth.logged_in_till) {
  //   return false;
  // }

  // const loginExpiryMoment = moment.unix(auth.logged_in_till);

  // if (!loginExpiryMoment.isValid()) {
  //   return false;
  // }

  // const loginExpired = moment().isAfter(loginExpiryMoment);

  // return !loginExpired;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/public",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default withRouter(App);
