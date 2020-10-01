/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Spin } from 'antd';
import DSMTables from '../DSMTables/DSMTables';
import DSMCards from '../DSMCards';
import DSMLists from '../DSMLists';

import './DSMDetailsModel.scss';

const { TabPane } = Tabs;

class DeviceData extends Component {
  state = {
    isLoading: false
  };

  componentDidMount() {}

  tabsOnChange = key => {
    const { selectedDevice, setActiveTabKey } = this.props;
    selectedDevice.filterData = {};
    setActiveTabKey(key);
  };

  render() {
    const { isLoading } = this.state;
    const { activeTabKey, selectedDevice, deviceData } = this.props;
    const tabs = [];

    if (isLoading) {
      return (
        <div className="spin-wrapper">
          <Spin size="large" />
        </div>
      );
    }
    deviceData.categories &&
      deviceData.categories.forEach((category, index) => {
        const tabKey = index + 1;
        // if (category.data && !category.data.length) {
        //   return;
        // }
        // eslint-disable-next-line no-param-reassign
        category.selectedDevice = selectedDevice;
        console.log(category.data.meta.view);
        tabs.push(
          <TabPane tab={category.title} key={tabKey}>
            {(+tabKey === +activeTabKey &&
              (category.data.meta.view === 'table' && (
                <DSMTables
                  ref={this.dataTableRef}
                  columns={category.data.meta.fields}
                  rowData={category.data.data}
                  tableHeight={400}
                  tableResultsAreLoading={isLoading}
                />
              ))) ||
              (category.data.meta.view === 'list' && (
                <DSMLists
                  data={category.data.data}
                  fields={category.data.meta.fields}
                  titleClickHandler={this.titleClick}
                />
              )) ||
              (category.data.meta.view === 'card' && (
                <DSMCards data={category.data.data} fields={category.data.meta.fields} />
              ))}
          </TabPane>
        );
      });

    return (
      <div className="device-data">
        <Tabs
          className="category-tabs"
          defaultActiveKey="1"
          onChange={this.tabsOnChange}
          activeKey={activeTabKey}
          animated={false}
          type="card"
        >
          {tabs}
        </Tabs>
      </div>
    );
  }
}

DeviceData.propTypes = {
  selectedDevice: PropTypes.object.isRequired,
  deviceData: PropTypes.object.isRequired,
  setActiveTabKey: PropTypes.func.isRequired,
  activeTabKey: PropTypes.string.isRequired
};

export default DeviceData;
