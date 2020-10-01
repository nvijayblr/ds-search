import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import DeviceDataTabTable from '../DeviceDataTabTable/DeviceDataTabTable';
import MetaDataTableVertical from '../MetaDataTable/MetaDataTableVertical';
import './DeviceDataTab.scss';

const { TabPane } = Tabs;

class DeviceDataTab extends Component {
  state = {
    activeTabKey: '1',
    metaDataVerticalHeight: 0
  };

  deviceDataTabRef = React.createRef();

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

  setMetaDataVerticalHeight = () => {
    this.setState({ metaDataVerticalHeight: this.deviceDataTabRef.current.clientHeight });
  };

  handleWindowResize = () => {
    const { categoryData } = this.props;

    if (categoryData.metadata) {
      this.setMetaDataVerticalHeight();
    }
  };

  render() {
    const { categoryData, selectedDeviceId, selectedIngestionItemId } = this.props;
    const { activeTabKey, metaDataVerticalHeight } = this.state;
    const deviceDataTabTableHeight = metaDataVerticalHeight - 30;

    return (
      <DeviceDataTabTable
        categoryData={categoryData}
        selectedDeviceId={selectedDeviceId}
        selectedIngestionItemId={selectedIngestionItemId}
      />
    );
  }
}

DeviceDataTab.defaultProps = {
  selectedDeviceId: '',
  selectedIngestionItemId: ''
};

DeviceDataTab.propTypes = {
  categoryData: PropTypes.object.isRequired,
  selectedDeviceId: PropTypes.string,
  selectedIngestionItemId: PropTypes.string
};

export default DeviceDataTab;
