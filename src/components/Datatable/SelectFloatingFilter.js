/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Select, AutoComplete } from 'antd';

const { Option } = Select;

class SelectFloatingFilter extends Component {
  state = {
    selectedValue: 'All'
  };

  applyCustomFilter = filterData => {
    const { api, type } = this.props;

    if (api && filterData && filterData.fieldName) {
      const filterColumn = api.getFilterInstance(filterData.fieldName);
      if (filterColumn) {
        filterColumn.setModel({
          type,
          filter: filterData.value === 'All' ? '' : filterData.value
        });
        api.onFilterChanged();
      }
    }
  };

  onSelectChange = value => {
    this.setState(
      {
        selectedValue: value
      },
      () => {
        const { selectedValue } = this.state;
        const { fieldName } = this.props;
        const filterData = {
          fieldName,
          value: selectedValue
        };
        this.applyCustomFilter(filterData);
      }
    );
  };

  render() {
    const { options, showAutoComplete } = this.props;
    const { selectedValue } = this.state;

    const selectOptions = options.map(item => (
      <Option title={item} value={item} key={item}>
        {item}
      </Option>
    ));
    if (showAutoComplete) {
      return (
        <AutoComplete
          dataSource={options}
          style={{ width: '100%' }}
          size="small"
          optionFilterProp="children"
          value={selectedValue === 'All' ? '' : selectedValue}
          filterOption={(inputValue, option) =>
            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          defaultActiveFirstOption={false}
          onChange={this.onSelectChange}
        />
      );
    }
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        size="small"
        optionFilterProp="children"
        value={selectedValue}
        onChange={this.onSelectChange}
        defaultActiveFirstOption={false}
      >
        {selectOptions}
      </Select>
    );
  }
}

export default SelectFloatingFilter;
