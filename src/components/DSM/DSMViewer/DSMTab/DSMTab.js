import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
// import DataTable from '../../../DataTable/DataTable';

const { TabPane } = Tabs;

class DSMTab extends Component {
  state = {
    activeTabKey: '1'
  };

  componentDidMount() {
    const { categoryData } = this.props;
    window.addEventListener('resize', this.handleWindowResize);

    if (categoryData.metadata) {
      window.requestAnimationFrame(this.setMetaDataVerticalHeight);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  tabsOnChange = key => {
    this.setState({ activeTabKey: key });
  };

  handleWindowResize = () => {
    const { categoryData } = this.props;

    if (categoryData.metadata) {
      this.setMetaDataVerticalHeight();
    }
  };

  render() {
    const { categoryData } = this.props;
    const { activeTabKey } = this.state;

    if (categoryData.categories) {
      // eslint-disable-next-line array-callback-return
      const tabs = categoryData.categories.map((category, index) => {
        if (category.isShow) {
          const tabKey = index + 1;
          return (
            <TabPane tab={category.title} key={tabKey}>
              {+tabKey === +activeTabKey && <h3>Tab Content</h3>}
            </TabPane>
          );
        }
      });

      return (
        <div className="device-data-tab">
          {!!categoryData.categories.length && (
            <Tabs
              defaultActiveKey="1"
              onChange={this.tabsOnChange}
              activeKey={activeTabKey}
              animated={false}
            >
              {tabs}
            </Tabs>
          )}
        </div>
      );
    }
    return <h3>No Data</h3>;
  }
}

DSMTab.defaultProps = {
  categoryData: []
};

DSMTab.propTypes = {
  categoryData: PropTypes.object
};

export default DSMTab;
