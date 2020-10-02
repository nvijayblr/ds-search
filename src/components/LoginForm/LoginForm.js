/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button } from "antd";

import "./LoginForm.scss";

const FormItem = Form.Item;

class LoginForm extends React.Component {
  state = {
    isLoggingIn: false,
    isShowPassword: false,
  };

  usernameInput = React.createRef();

  passwordInput = React.createRef();

  componentWillMount = () => {
    const { history } = this.props;
    const isDarkMode = JSON.parse(localStorage.getItem("dsm-dark-mode"));
    if (isDarkMode) {
      document.querySelector("body").className = `${
        isDarkMode ? "dark-theme" : "light-theme"
      }`;
    }
    history.push("/dds-search");
  };

  handleSubmit = (e) => {
    const { form } = this.props;

    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        this.login(values);
        this.setState({
          isLoggingIn: true,
        });
      }
    });
  };

  showHidePassword = () => {
    const { isShowPassword } = this.state;
    this.setState({ isShowPassword: !isShowPassword });
    this.passwordInput.current.focus();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { isLoggingIn, isShowPassword } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please enter your username!" }],
          })(
            <Input
              ref={this.usernameInput}
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              autoFocus
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please enter your password!" }],
          })(
            <Input
              ref={this.passwordInput}
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              suffix={
                <Icon
                  type={isShowPassword ? "eye" : "eye-invisible"}
                  title={isShowPassword ? "Hide Password" : "Show Password"}
                  className="sh-password"
                  onClick={this.showHidePassword}
                />
              }
              type={isShowPassword ? "text" : "password"}
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {isLoggingIn && (
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled
            >
              <Icon type="sync" className="login-spinner-icon" spin />
            </Button>
          )}
          {!isLoggingIn && (
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Login
            </Button>
          )}
        </FormItem>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  form: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Form.create()(LoginForm));
