import React, { Component } from "react";
import PropTypes from "prop-types";

export const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        results: action.payload,
      };
    case "SHOW_TABLE_LOADING_OVERLAY":
      return {
        ...state,
        tableResultsAreLoading: action.payload,
      };
    case "SHOW_RESULTS_TABLE":
      return {
        ...state,
        showResultsTable: action.payload,
      };
    default:
      return state;
  }
};

export class Provider extends Component {
  state = {
    results: [],
    tableResultsAreLoading: false,
    showResultsTable: false,
    dispatch: (action) => this.setState((state) => reducer(state, action)),
  };

  render() {
    const state = { ...this.state };
    const { children } = this.props;

    return <Context.Provider value={state}>{children}</Context.Provider>;
  }
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Consumer = Context.Consumer; // eslint-disable-line prefer-destructuring
