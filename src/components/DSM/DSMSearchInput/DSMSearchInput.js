/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint no-underscore-dangle: [1, { "allow": ["__env"] }] */
import React, { Component, Fragment } from 'react';
import { Input, Icon, Select, AutoComplete, Button } from 'antd';
import { debounce } from 'lodash';
import axios from 'axios';

import {
  getDSMSearchRequest,
  getDSMTypeaheadRequest,
  getDSMFilterTypeaheadRequest
} from '../../../services/api';
import AntDataTable from '../DSMViewer/DSMTables/AntDataTable';

import './DSMSearchInput.scss';

const { Option } = Select;
const { OptGroup } = AutoComplete;

class SearchComponent extends Component {
  signal = axios.CancelToken.source();

  defaultColumnDefs = {
    suppressMenu: true
  };

  searchFilterOptions = {
    IPv4: `&contains-value_type=ipv4_address`,
    Hostname: `&contains-value_type=hostname`
  };

  state = {
    tableHeight: 500,
    serachOptions: [
      { Title: 'Search', value: 'search' },
      { Title: 'IPv4', value: 'IPv4' },
      { Title: 'Hostname', value: 'Hostname' },
      { Title: 'Regex', value: 'regex' },
      { Title: 'Contains', value: 'contains' },
      { Title: 'Starts with', value: 'startswith' },
      { Title: 'Match', value: 'match' }
    ],
    filterOptions: [
      { Title: 'Contains', value: 'contains' },
      { Title: 'Starts with', value: 'startswith' },
      { Title: 'Match', value: 'match' },
      { Title: 'Not Contains', value: '!contains' },
      { Title: 'Not Starts with', value: '!startswith' },
      { Title: 'Not Match', value: '!match' },
      { Title: 'Any Contains', value: 'any_contains' },
      { Title: 'Any Starts with', value: 'any_startswith' },
      { Title: 'Any Match', value: 'any_match' }
    ],
    serachOption: 'search',
    searchResults: [],
    searchColumns: [],
    searchView: 'table',
    showResultsTable: false,
    isLoading: false,
    searchValue: '',
    autoCompleteDataSource: {
      suggessions: []
    },
    totalItems: 0,
    page: 1,
    pageSize: 20,
    sortingKey: '',
    sortOrder: '',
    filters: {},
    reqTime: 0
  };

  tableWrapperRef = React.createRef();

  debouncedOnChange = debounce(() => {
    this.setState({
      page: 1,
      sortingKey: '',
      sortOrder: ''
      // filters: {}
    });

    this.getSearchResults();
  }, 100);

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.setState({
      // searchColumns: this.createColDefs(),
      autoCompleteDataSource: {
        suggessions: []
      }
    });
  }

  componentWillUnmount() {
    this.signal.cancel('Canceled');
    window.removeEventListener('resize', this.handleWindowResize);
  }

  onAutoCompleteChange = e => {
    // this.setState({
    //   autoCompleteDataSource: {
    //     suggessions: e.length ? ['loading'] : []
    //   }
    // });
    this.setState({ searchValue: e || '' }, () => {
      this.debouncedOnChange();
    });

    if (!e) {
      this.setState({
        autoCompleteDataSource: {
          suggessions: []
        }
      });
      return;
    }
    getDSMTypeaheadRequest(e || '', 'value', 1)
      .then(response => {
        this.setState({
          autoCompleteDataSource: {
            suggessions: response.data ? response.data : []
          }
        });
      })
      .catch(error => {
        this.setState({
          autoCompleteDataSource: {
            suggessions: []
          }
        });
      });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortingKey: sorter.columnKey,
        sortOrder: sorter.order,
        filters
      },
      () => {
        this.getSearchResults();
      }
    );
  };

  getSearchResults = async () => {
    const { searchValue, page, pageSize, sortingKey, sortOrder, filters } = this.state;
    let { serachOption } = this.state;
    this.handleWindowResize();

    const currentSession = {};
    this.lastSession = currentSession;
    // if (!searchValue) {
    //   this.onSearchEmpty();
    //   return;
    // }
    this.setState({
      showResultsTable: true,
      isLoading: true
    });
    try {
      // Parse sorting string.
      let sort = '';
      if (sortOrder === 'ascend') {
        sort = `&sortby=${sortingKey}`;
      }
      if (sortOrder === 'descend') {
        sort = `&sortby=-${sortingKey}`;
      }

      // Parse Filter string
      let filterStr = [];
      if (filters) {
        filterStr = Object.keys(filters).map(key => {
          const value = filters[key].value ? filters[key].value : '';
          const option = filters[key].option ? filters[key].option : 'contains';
          return `&${option}-${key}=${value}`;
        });
      }

      if (serachOption === 'IPv4' || serachOption === 'Hostname') {
        filterStr.unshift(this.searchFilterOptions[serachOption]);
        serachOption = 'search';
      }

      const filter = filterStr.join('');
      const res = await getDSMSearchRequest(
        searchValue,
        serachOption,
        {
          page,
          pageSize,
          sorting: sortingKey ? sort : '',
          filtering: filter
        },
        {
          cancelToken: this.signal.token
        }
      );

      if (this.lastSession !== currentSession) return;
      this.onGetSearchSuccess(res);
    } catch (e) {
      this.onSearchEmpty();
    }
  };

  onGetSearchSuccess = res => {
    this.parseTableData(res.data ? res.data : []);
    this.setState({
      isLoading: false,
      totalItems: res.headers['total-items'] ? res.headers['total-items'] : 100,
      reqTime: res.headers['query-duration'] ? res.headers['query-duration'] : '50ms'
    });
  };

  clickApplyFilters = () => {
    this.getSearchResults();
  };

  clickResetFilters = () => {
    const { filters } = this.state;
    const filterClear = {};
    Object.keys(filters).map(key => {
      filterClear[key] = {
        ...filters[key],
        value: ''
      };
      return key;
    });
    this.setState({ filters: filterClear }, () => {
      this.getSearchResults();
    });
  };

  onColumnFilterKeyUpFocus = (e, key, isBlured) => {
    let value = '';
    if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }
    const { filters } = this.state;
    if ((e && e.keyCode === 13) || isBlured) {
      filters[key].value = value;
      this.setState({ filters }, () => {
        this.getSearchResults();
      });
    } else {
      filters[key].value = value;
      filters[key].autoCompleteOptions = [];
      this.setState({ filters }, () => {
        this.onColumnFilterAutocomplete(e, key);
      });
    }
  };

  onColumnFilterAutocomplete = (e, key) => {
    const { filters, serachOption, searchValue } = this.state;
    const value = e;
    // Parse Filter string
    let filterStr = [];
    if (filters) {
      filterStr = Object.keys(filters).map(filterKey => {
        const filterVal = filters[filterKey].value ? filters[filterKey].value : '';
        const filterOption = filters[filterKey].option ? filters[filterKey].option : 'contains';
        return `&${filterOption}-${filterKey}=${filterVal}`;
      });
    }
    const filter = filterStr.join('');

    getDSMFilterTypeaheadRequest(serachOption, searchValue, filter, value, key)
      .then(response => {
        filters[key].autoCompleteOptions = response.data ? response.data : [];
        this.setState({ filters });
      })
      .catch(error => {
        filters[key].autoCompleteOptions = [];
        this.setState({ filters });
      });
  };

  onColumnFilterOptionChange = (value, key) => {
    const { filters } = this.state;
    if (filters[key].option !== value) {
      filters[key].option = value;
      this.setState({ filters });
      if (filters[key].value) {
        this.getSearchResults();
      }
    }
  };

  renderTitleWithFilter = (key, title) => {
    const { filterOptions, filters } = this.state;
    if (!filters[key]) {
      return '';
    }
    return (
      <div className="custom-hd-wrp">
        <div className="hd-label">{title}</div>
        <div
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Select
            placeholder="Select Option"
            dropdownClassName="table-filter-dropdown"
            defaultValue="contains"
            onSelect={value => {
              this.onColumnFilterOptionChange(value, key);
            }}
          >
            {filterOptions.map(option => (
              <Option value={option.value} key={option.value}>
                {option.Title}
              </Option>
            ))}
          </Select>
          <AutoComplete
            dataSource={filters[key].autoCompleteOptions}
            style={{ width: 200 }}
            defaultActiveFirstOption={false}
            dropdownClassName="column-filter-dropdown"
            value={filters[key].value}
            onSelect={e => {
              this.onColumnFilterKeyUpFocus(e, key, true);
            }}
            onSearch={e => {
              this.onColumnFilterKeyUpFocus(e, key);
            }}
            // onFocus={e => {
            //   this.onColumnFilterKeyUpFocus(e, key);
            // }}
            // onSearch={e => {
            //   this.onColumnFilterKeyUpFocus(e, key);
            // }}
            placeholder={title}
          >
            <Input
              onKeyUp={e => {
                this.onColumnFilterKeyUpFocus(e, key);
              }}
              onFocus={e => {
                this.onColumnFilterKeyUpFocus(e, key);
              }}
            />
          </AutoComplete>
        </div>
      </div>
    );
  };

  createColDefs = () => {
    const colDefs = [
      {
        title: this.renderTitleWithFilter('name', 'Hostname'),
        dataIndex: 'name',
        key: 'name',
        className: 'name',
        sorter: true,
        width: 130
      },
      {
        title: this.renderTitleWithFilter('ip', 'IP'),
        dataIndex: 'ip',
        key: 'ip',
        className: 'ip',
        sorter: true,
        width: 130
      },
      {
        title: this.renderTitleWithFilter('type', 'Type'),
        dataIndex: 'type',
        key: 'type',
        className: 'type',
        sorter: true,
        width: 100
      },
      {
        title: this.renderTitleWithFilter('vendor', 'Vendor'),
        dataIndex: 'vendor',
        key: 'vendor',
        className: 'vendor',
        sorter: true,
        width: 100
      },
      {
        title: this.renderTitleWithFilter('value', 'Value'),
        dataIndex: 'value',
        key: 'value',
        className: 'value',
        sorter: true,
        render: value => <div className="wrap-single-line">{value}</div>
      },
      {
        title: this.renderTitleWithFilter('value_type', 'Value Type'),
        dataIndex: 'value_type',
        key: 'value_type',
        className: 'value_type',
        sorter: true,
        width: 140
      },
      {
        title: this.renderTitleWithFilter('dn', 'DN'),
        dataIndex: 'dn',
        key: 'dn',
        className: 'dn',
        width: 240,
        render: dn => {
          if (dn && dn.length) {
            return dn.join(', ');
          }
          return dn;
        }
      },
      {
        title: this.renderTitleWithFilter('country', 'Country'),
        dataIndex: 'country',
        key: 'country',
        className: 'country',
        sorter: true,
        width: 120
      }
    ];
    return colDefs;
  };

  parseTableData = data => {
    const { meta } = data;
    const { filters } = this.state;
    data.meta.fields.forEach((col, index) => {
      if (!filters[col.name]) {
        filters[col.name] = { option: 'contains', value: '', autoCompleteOptions: [] };
      }
    });

    this.setState({ filters }, () => {
      const rowData = data.data.map((d, index) => {
        return {
          ...d,
          key: index
        };
      });

      this.setState({
        searchResults: rowData,
        // searchColumns: this.createColDefs(),
        searchView: meta.view,
        showResultsTable: true
      });
    });
  };

  onSearchEmpty = () => {
    // message.error("Unfortunately there was an error getting the results");
    this.setState({
      searchResults: [],
      searchView: 'table',
      showResultsTable: true,
      isLoading: false,
      page: 0,
      totalItems: 0
    });
  };

  setTableDimensions = () => {
    const marginBottom = 70;
    const offsetTop = this.tableWrapperRef.current.getBoundingClientRect().top;
    const tableHeight = window.innerHeight - offsetTop - marginBottom - 105;
    this.setState({ tableHeight });
  };

  handleWindowResize = () => {
    this.setTableDimensions();
  };

  searchOptionChange = serachOption => {
    this.setState({ serachOption }, () => {
      this.debouncedOnChange();
    });
  };

  renderOption = () => {
    const { autoCompleteDataSource } = this.state;
    const options = Object.keys(autoCompleteDataSource).map(group => {
      return (
        <OptGroup key={group} label={group === 'suggessions' ? 'Suggestions' : 'Recent Searches'}>
          {autoCompleteDataSource[group].map(item => (
            <Option key={item} text={item}>
              {item === 'loading' ? (
                <Icon type="loading" />
              ) : (
                <div className="global-search-item">
                  <span className="global-search-item-desc">{item}</span>
                  {group === 'resentSearch' ? (
                    <span className="search-history-remove">Remove</span>
                  ) : (
                    ''
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
      isLoading,
      reqTime,
      serachOptions,
      serachOption,
      searchResults,
      autoCompleteDataSource,
      tableHeight,
      searchView,
      showResultsTable,
      totalItems,
      page
    } = this.state;

    const searchColumnsUpdate = this.createColDefs();
    return (
      <Fragment>
        <div className="search-input-wrapper initial-search-done clearfix">
          <div className="top-option-box">
            <Select
              placeholder="Select Option"
              className="search-select-options"
              onSelect={this.searchOptionChange}
              value={serachOption}
            >
              {serachOptions.map(option => (
                <Option value={option.value} key={option.value}>
                  {option.Title}
                </Option>
              ))}
            </Select>
            {totalItems !== 0 && (
              <div className={`search-info ${isLoading ? 'loading' : ''}`}>
                {isLoading && (
                  <span className="loading">
                    <Icon type="loading" />
                  </span>
                )}
                <span>About </span>
                {parseInt(totalItems, 0).toLocaleString()}
                <span> results (</span>
                {reqTime}
                <span>)</span>
              </div>
            )}
          </div>
          <div className="top-search-box">
            <div className="global-search-wrapper">
              <AutoComplete
                className="search-input"
                size="large"
                dataSource={autoCompleteDataSource.suggessions}
                style={{ width: '100%' }}
                dropdownClassName="column-filter-dropdown"
                defaultActiveFirstOption={false}
                allowClear
                // onFocus={e => {
                //   this.onAutoCompleteChange(e);
                // }}
                onSelect={e => this.onAutoCompleteChange(e)}
                onSearch={e => this.onAutoCompleteChange(e)}
                autoFocus
              >
                <Input
                  className="search-input"
                  placeholder="Search..."
                  prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                />
              </AutoComplete>
            </div>
          </div>
        </div>
        <div className="search-filter-wrapper">
          <Button className="ant-btn-primary" onClick={this.clickResetFilters}>
            <Icon type="filter" />
            Reset
          </Button>
          <Button className="ant-btn-primary" onClick={this.clickApplyFilters}>
            Apply
          </Button>
        </div>
        <div className="search-table-wrapper">
          <div ref={this.tableWrapperRef} className="search-results">
            {searchView === 'table' && showResultsTable && (
              <AntDataTable
                colDefs={searchColumnsUpdate}
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
