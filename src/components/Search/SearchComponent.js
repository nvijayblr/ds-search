/* eslint-disable no-param-reassign */
/* eslint no-underscore-dangle: [1, { "allow": ["__env"] }] */
import React, { Component, Fragment } from "react";
import { Row, Col, Input, Icon, Select, AutoComplete } from "antd";
import { debounce } from "lodash";
import axios from "axios";

import { getSearchRequest } from "../../services/api";
import DataTable from "../Datatable/DataTable";

import "./SearchComponent.scss";

const { Option } = Select;
const { OptGroup } = AutoComplete;

class SearchComponent extends Component {
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
    searchColumns: [],
    searchView: "table",
    showResultsTable: false,
    isLoading: false,
    searchValue: "",
    context: { componentParent: this },
    autoCompleteDataSource: {
      resentSearch: [],
      suggessions: [],
    },
    totalItems: 0,
    page: 1,
    pageSize: 10,
    sortingKey: "",
    sortOrder: "",
    reqTime: 0,
  };

  tableWrapperRef = React.createRef();

  debouncedOnChange = debounce(() => {
    this.setState({
      page: 1,
      sortingKey: "",
    });

    this.getSearchResults();
  }, 500);

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowResize);
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

  onChange = (e) => {
    // const { value } = e.target;
    const { autoCompleteDataSource } = this.state;
    this.setState({
      autoCompleteDataSource: {
        resentSearch: autoCompleteDataSource.resentSearch,
        suggessions: e.length ? ["loading"] : [],
      },
    });
    this.setState({ searchValue: e }, () => {
      this.debouncedOnChange();
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    // console.log("handleTableChange....", pagination, filters, sorter);
    this.setState(
      {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortingKey: sorter.columnKey,
        sortOrder: sorter.order,
      },
      () => {
        this.getSearchResults();
      }
    );
  };

  getReuestTimer = (reqStartTime) => {
    let now = Date.now();
    let seconds = Math.floor((now - reqStartTime) / 1000);
    let milliseconds = Math.floor((now - reqStartTime) % 1000);
    this.setState({ reqTime: `${seconds}.${milliseconds} seconds` });
  };

  getSearchResults = async () => {
    const {
      searchValue,
      serachOption,
      page,
      pageSize,
      sortingKey,
      sortOrder,
    } = this.state;
    const { autoCompleteDataSource } = this.state;

    this.handleWindowResize();

    const currentSession = {};
    this.lastSession = currentSession;

    if (!searchValue) {
      this.onSearchEmpty();
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
      let sort = "";
      if (sortOrder === "ascend") {
        sort = `&sortby=${sortingKey}`;
      }
      if (sortOrder === "descend") {
        sort = `&sortby=-${sortingKey}`;
      }
      let reqStartTime = Date.now();
      const res = await getSearchRequest(
        searchValue,
        {
          page,
          pageSize,
          sorting: sortingKey ? sort : "",
        },
        {
          cancelToken: this.signal.token,
        }
      );

      if (this.lastSession !== currentSession) return;
      this.getReuestTimer(reqStartTime);
      this.onGetSearchSuccess(res);
    } catch (e) {
      this.onSearchEmpty();
    }
  };

  onGetSearchSuccess = (res) => {
    this.parseTableData(res.data ? res.data : []);
    this.setState({
      isLoading: false,
      totalItems: res.headers["total-items"]
        ? res.headers["total-items"]
        : 1000,
    });
  };

  parseTableData = (data) => {
    const { meta } = data;
    const colDefs = data.meta.fields.map((col) => {
      return {
        title: col.label,
        dataIndex: col.name,
        key: col.name,
        sorter: true,
      };
    });

    const rowData = data.data.map((data, index) => {
      return {
        ...data,
        key: index,
      };
    });

    this.setState({
      searchResults: rowData,
      searchColumns: colDefs,
      searchView: meta.view,
      showResultsTable: true,
    });
  };

  onSearchEmpty = () => {
    // message.error("Unfortunately there was an error getting the results");
    this.setState({
      searchResults: [],
      searchColumns: [],
      searchView: "table",
      showResultsTable: true,
      isLoading: false,
      page: 0,
      totalItems: 0,
    });
  };

  setTableDimensions = () => {
    const marginBottom = 70;
    const offsetTop = this.tableWrapperRef.current.getBoundingClientRect().top;
    const tableHeight = window.innerHeight - offsetTop - marginBottom - 50;
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
    const {
      searchValue,
      isLoading,
      reqTime,
      serachOptions,
      serachOption,
      searchResults,
      searchColumns,
      tableHeight,
      searchView,
      showResultsTable,
      totalItems,
      page,
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
                  onChange={(e) => this.onChange(e)}
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
                {totalItems && searchValue && !isLoading && (
                  <div className="search-info">
                    About {parseInt(totalItems).toLocaleString()} results (
                    {reqTime})
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>

        <div className="search-table-wrapper">
          <div ref={this.tableWrapperRef} className="search-results">
            {searchView === "table" && showResultsTable && (
              <DataTable
                colDefs={searchColumns}
                rowData={searchResults}
                tableHeight={tableHeight}
                totalItems={totalItems}
                page={page}
                isLoading={isLoading}
                onTableChange={this.handleTableChange}
              />
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SearchComponent;
