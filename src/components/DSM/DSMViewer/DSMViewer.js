/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Select, Modal } from 'antd';

import DSMCards from './DSMCards';
import DSMLists from './DSMLists';
import DataTable from '../../DataTable/DataTable';
import DSMTab from './DSMTab/DSMTab';

import './DSMViewer.scss';

const { Option } = Select;

class DSMViewer extends Component {
  defaultColumnDefs = {
    suppressMenu: true
  };

  state = {
    tableHeight: 600,
    modalBodyHeight: 0,
    hiddenColumns: [],
    columnDefs: [],
    viewSelection: 'card',
    showDetailsModal: false,
    dsmModel: {
      inventory: {
        find: 'domain.inventory',
        view: 'list', //card, list, table
        fields: [
          {
            label: 'Hostname',
            name: 'hostname',
            isShow: true
          },
          {
            label: 'IP',
            name: 'ip',
            isShow: false
          },
          {
            label: 'Node',
            name: 'node',
            isShow: false
          },
          {
            label: 'Port',
            name: 'port',
            isShow: true
          },
          {
            label: 'Profile',
            name: 'profile',
            isShow: true
          },
          {
            label: 'Transport',
            name: 'transport',
            isShow: true
          },
          {
            label: 'Country',
            name: 'country',
            isShow: true
          }
        ]
      },
      domain: {
        inventory: [
          {
            hostname: 'cma_LibertyGlobal-Corp-p',
            ip: '172.24.17.41',
            node: 'MTI',
            profile: 'CMA, Checkpoint, R80',
            transport: 'checkpoint_cma_r80',
            port: '80',
            country: 'Netherlands'
          },
          {
            hostname: 'nlamska-lb07',
            ip: '10.64.97.32',
            node: 'MTI',
            profile: 'LB, F5, 2',
            transport: 'f5',
            port: '81',
            country: 'Netherlands'
          },
          {
            hostname: 'CH xbeam CPM02',
            ip: '172.27.175.62',
            node: 'MTI',
            profile: 'FW, Crossbeam-CPM, 1',
            transport: 'crossbeam_cpm',
            port: '33',
            country: 'Netherlands'
          },
          {
            hostname: 'cma-VOIP3-p',
            ip: '34.344.234.123',
            node: 'CNO',
            profile: 'FW, Crossbeam-APM, 1',
            transport: 'autodetect',
            port: '34',
            country: 'Liberty Global'
          },
          {
            hostname: 'cma_LibertyGlobal-Corp-p',
            ip: '172.24.17.41',
            node: 'MTI',
            profile: 'CMA, Checkpoint, R80',
            transport: 'checkpoint_cma_r80',
            port: '80',
            country: 'Netherlands'
          },
          {
            hostname: 'nlamska-lb07',
            ip: '10.64.97.32',
            node: 'MTI',
            profile: 'LB, F5, 2',
            transport: 'f5',
            port: '81',
            country: 'Netherlands'
          },
          {
            hostname: 'CH xbeam CPM02',
            ip: '172.27.175.62',
            node: 'MTI',
            profile: 'FW, Crossbeam-CPM, 1',
            transport: 'crossbeam_cpm',
            port: '33',
            country: 'Netherlands'
          },
          {
            hostname: 'cma-VOIP3-p',
            ip: '34.344.234.123',
            node: 'CNO',
            profile: 'FW, Crossbeam-APM, 1',
            transport: 'autodetect',
            port: '34',
            country: 'Liberty Global'
          },
          {
            hostname: 'cma_LibertyGlobal-Corp-p',
            ip: '172.24.17.41',
            node: 'MTI',
            profile: 'CMA, Checkpoint, R80',
            transport: 'checkpoint_cma_r80',
            port: '80',
            country: 'Netherlands'
          }
        ],
        subdomain: []
      }
    }
  };

  componentDidMount() {
    const { dsmModel } = this.state;
    const columnDefs = [];
    for (const field of dsmModel.inventory.fields) {
      if (field.isShow) {
        columnDefs.push({
          ...this.defaultColumnDefs,
          headerName: field.label,
          field: field.name
        });
      }
    }
    this.setState({ columnDefs, viewSelection: dsmModel.inventory.view });
  }

  changeView = e => {
    this.setState({ viewSelection: e });
  };

  handleModelCancel = () => {
    this.setState({ showDetailsModal: false });
  };

  titleClick = () => {
    this.setState({ showDetailsModal: true });
  };

  render() {
    const {
      dsmModel,
      columnDefs,
      tableHeight,
      hiddenColumns,
      viewSelection,
      showDetailsModal
    } = this.state;
    const deviceMetaData = {
      categories: [
        {
          title: 'Invntory',
          isShow: true,
          data: [
            {
              hostname: 'cma_LibertyGlobal-Corp-p',
              ip: '172.24.17.41',
              node: 'MTI'
            },
            {
              hostname: 'cma_LibertyGlobal-Corp-p',
              ip: '172.24.17.41',
              node: 'MTI'
            },
            {
              hostname: 'cma_LibertyGlobal-Corp-p',
              ip: '172.24.17.41',
              node: 'MTI'
            }
          ]
        },
        {
          title: 'Arp',
          isShow: true,
          data: []
        },
        {
          title: 'VLAN',
          isShow: true,
          data: []
        },
        {
          title: 'VLAN 1',
          isShow: true,
          data: []
        }
      ]
    };
    return (
      <div className="dsm-viewer">
        <div className="selects">
          <div className="form-control">
            <label className="select-label">Component</label>
            <Select
              showSearch
              placeholder="Select Component..."
              value={viewSelection}
              onChange={this.changeView}
            >
              <Option value="card" key="card">
                Card View
              </Option>
              <Option value="list" key="list">
                List View
              </Option>
              <Option value="table" key="table">
                Table View
              </Option>
            </Select>
          </div>
        </div>
        <div className="dsm-viewer-body">
          {viewSelection === 'card' && (
            <DSMCards data={dsmModel.domain.inventory} fields={dsmModel.inventory.fields} />
          )}
          {viewSelection === 'list' && (
            <DSMLists
              data={dsmModel.domain.inventory}
              fields={dsmModel.inventory.fields}
              titleClickHandler={this.titleClick}
            />
          )}
          {viewSelection === 'table' && (
            <DataTable
              ref={this.dataTableRef}
              columnDefs={columnDefs}
              rowData={dsmModel.domain.inventory}
              tableHeight={tableHeight}
              hiddenColumns={hiddenColumns}
            />
          )}
        </div>
        {showDetailsModal && (
          <Modal
            title="Title"
            visible={showDetailsModal}
            onCancel={this.handleModelCancel}
            width="960px"
            footer={null}
            style={{ top: '40px' }}
            bodyStyle={{ height: '500px' }}
            destroyOnClose
          >
            {/* {isMetaDataLoading && (
              <div className="spin-wrapper">
                <Spin size="default" />
              </div>
            )} */}
            <DSMTab categoryData={deviceMetaData} />
          </Modal>
        )}
      </div>
    );
  }
}

export default DSMViewer;
