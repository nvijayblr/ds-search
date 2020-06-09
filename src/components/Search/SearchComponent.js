/* eslint-disable no-param-reassign */
/* eslint no-underscore-dangle: [1, { "allow": ["__env"] }] */
import React, { Component, Fragment } from "react";
import { Row, Col, Input, Icon, message, Select, AutoComplete } from "antd";
import { debounce } from "lodash";
import axios from "axios";

import { Context } from "../../context";
import { getSearchRequest } from "../../services/api";
import DataTable from "../Datatable/DataTable";

import "./SearchComponent.scss";

const { Option } = Select;
const { OptGroup } = AutoComplete;

class SearchComponent extends Component {
  static contextType = Context;

  signal = axios.CancelToken.source();

  defaultColumnDefs = {
    suppressMenu: true,
  };

  state = {
    tableHeight: 500,
    hiddenColumns: [],
    serachOptions: [{ Title: "Default", value: "default" }],
    serachOption: "default",
    searchResults: [],
    searchFields: [],
    searchView: "table",
    showResultsTable: false,
    isLoading: false,
    searchValue: "",
    context: { componentParent: this },
    autoCompleteDataSource: {
      resentSearch: [],
      suggessions: [],
    },
  };

  tableWrapperRef = React.createRef();

  debouncedOnChange = debounce((dispatch) => {
    this.getSearchResults(dispatch);
  }, 500);

  componentWillMount() {
    const { dispatch } = this.context;
    window.addEventListener("resize", this.handleWindowResize);
    dispatch({ type: "SHOW_TABLE_LOADING_OVERLAY", payload: false });
    dispatch({ type: "SHOW_RESULTS_TABLE", payload: false });
    this.setState({
      autoCompleteDataSource: {
        resentSearch: [],
        suggessions: [],
      },
    });
  }

  componentWillUnmount() {
    this.signal.cancel("Canceled");
    window.removeEventListener("resize", this.handleWindowResize);
  }

  onChange = (dispatch, e) => {
    // const { value } = e.target;
    const { autoCompleteDataSource } = this.state;
    this.setState({
      autoCompleteDataSource: {
        resentSearch: autoCompleteDataSource.resentSearch,
        suggessions: e.length ? ["loading"] : [],
      },
    });
    this.setState({ searchValue: e }, () => {
      this.debouncedOnChange(dispatch);
    });
  };

  getSearchResults = async (dispatch) => {
    const { searchValue, serachOption } = this.state;
    const { autoCompleteDataSource } = this.state;

    this.handleWindowResize();

    const currentSession = {};
    this.lastSession = currentSession;
    dispatch({ type: "SHOW_TABLE_LOADING_OVERLAY", payload: true });

    if (!searchValue) {
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      dispatch({ type: "SHOW_TABLE_LOADING_OVERLAY", payload: false });
      return;
    }
    this.setState({
      autoCompleteDataSource: {
        resentSearch: autoCompleteDataSource.resentSearch,
        suggessions: [],
      },
    });
    this.setState({
      showResultsTable: true,
      isLoading: true,
    });
    try {
      const res = await getSearchRequest(searchValue, serachOption, {
        cancelToken: this.signal.token,
      });

      if (this.lastSession !== currentSession) return;

      this.onGetSearchSuccess(dispatch, res);
    } catch (e) {
      console.log(e);
      this.onGetSearchError(dispatch);
    }
  };

  onGetSearchSuccess = (dispatch, res) => {
    this.parseTableData(res.data ? res.data : []);
    this.setState({ isLoading: false });
    dispatch({ type: "SHOW_TABLE_LOADING_OVERLAY", payload: false });
  };

  parseTableData = (data) => {
    const { meta } = data;
    this.setState({
      searchResults: data.data,
      searchFields: data.meta.fields,
      searchView: meta.view,
      showResultsTable: true,
    });
  };

  onGetSearchError = (dispatch) => {
    message.error("Unfortunately there was an error getting the results");
    this.setState({ isLoading: false });
    dispatch({ type: "SHOW_TABLE_LOADING_OVERLAY", payload: false });
  };

  setTableDimensions = () => {
    const marginBottom = 24;
    const offsetTop = this.tableWrapperRef.current.getBoundingClientRect().top;
    const tableHeight = window.innerHeight - offsetTop - marginBottom;

    this.setState({ tableHeight });
  };

  handleWindowResize = () => {
    this.setTableDimensions();
  };

  searchOptionChange = (serachOption) => {
    this.setState({ serachOption });
  };

  renderOption = () => {
    const { autoCompleteDataSource } = this.state;
    const options = Object.keys(autoCompleteDataSource).map((group) => {
      return (
        <OptGroup
          key={group}
          label={group === "suggessions" ? "Suggestions" : "Recent Searches"}
        >
          {autoCompleteDataSource[group].map((item) => (
            <Option key={item} text={item}>
              {item === "loading" ? (
                <Icon type="loading" />
              ) : (
                <div className="global-search-item">
                  <span className="global-search-item-desc">{item}</span>
                  {group === "resentSearch" ? (
                    <span className="search-history-remove">Remove</span>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </Option>
          ))}
        </OptGroup>
      );
    });

    return options;
  };

  render() {
    const { dispatch } = this.context;
    const {
      serachOptions,
      serachOption,
      searchResults,
      searchFields,
      tableHeight,
      hiddenColumns,
      searchView,
      showResultsTable,
      context,
      isLoading,
    } = this.state;

    return (
      <Fragment>
        <div className="search-input-wrapper initial-search-done">
          <Row gutter={12}>
            <Col span={6}>
              <Select
                placeholder="Select Option"
                className="search-select-options"
                onSelect={this.searchOptionChange}
                value={serachOption}
              >
                {serachOptions.map((option) => (
                  <Option value={option.value} key={option.value}>
                    {option.Title}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={18}>
              <div className="global-search-wrapper">
                <AutoComplete
                  className="search-input"
                  size="large"
                  style={{ width: "100%" }}
                  dropdownStyle={{ width: "500px" }}
                  onSearch={this.handleSearch}
                  optionLabelProp="text"
                  onChange={(e) => this.onChange(dispatch, e)}
                  ref={(node) => {
                    this.searchInput = node;
                  }}
                >
                  <Input
                    className="search-input"
                    placeholder="Search..."
                    prefix={
                      <Icon
                        type="search"
                        style={{ color: "rgba(0,0,0,.25)" }}
                      />
                    }
                    size="large"
                  />
                </AutoComplete>
              </div>
            </Col>
          </Row>
        </div>

        <div className="search-table-wrapper">
          <div ref={this.tableWrapperRef} className="search-results">
            {searchView === "table" && showResultsTable && (
              <DataTable
                ref={this.dataTableRef}
                columns={searchFields}
                rowData={searchResults}
                tableHeight={tableHeight}
                hiddenColumns={hiddenColumns}
                context={context}
                tableResultsAreLoading={isLoading}
                enableFilter={false}
                enableSorting={false}
                floatingFilter={false}
                suppressMenu={false}
              />
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SearchComponent;
