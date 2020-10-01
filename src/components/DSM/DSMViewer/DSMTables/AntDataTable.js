/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { Table } from 'antd';
// import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';

import './AntDataTable.scss';

class AntDataTable extends Component {
  // ResizeableTitle = (props) => {
  //   const { onResize, width, ...restProps } = props;
  //   if (!width) {
  //     return <th {...restProps} />;
  //   }

  //   return (
  //     <Resizable
  //       width={width}
  //       height={0}
  //       handle={
  //         <span
  //           className="react-resizable-handle"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //           }}
  //         />
  //       }
  //       onResize={onResize}
  //       draggableOpts={{ enableUserSelectHack: false }}
  //     >
  //       <th {...restProps} />
  //     </Resizable>
  //   );
  // };

  // components = {
  //   header: {
  //     cell: this.ResizeableTitle,
  //   },
  // };

  componentDidMount = () => {};

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      };
      return { columns: nextColumns };
    });
  };

  hostNameClick = () => {
    console.log('hostNameClick...');
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onTableChange } = this.props;
    onTableChange(pagination, filters, sorter);
  };

  render() {
    const { rowData, colDefs, totalItems, tableHeight, page, isLoading } = this.props;

    return (
      <div className="data-table-wrapper">
        <Table
          className="data-table"
          components={this.components}
          dataSource={rowData}
          columns={colDefs}
          loading={isLoading}
          onChange={this.handleTableChange}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 20,
            pageSizeOptions: ['10', '20', '50', '100'],
            total: totalItems,
            current: page,
            showSizeChanger: true
          }}
          scroll={{
            x: false, // If specify the width, the header and body will be scrollable
            y: tableHeight,
            scrollToFirstRowOnChange: true
          }}
        />
      </div>
    );
  }
}

AntDataTable.defaultProps = {
  isLoading: true,
  totalItems: 0,
  page: 1,
  tableHeight: 500
};

AntDataTable.propTypes = {
  colDefs: PropTypes.array.isRequired,
  rowData: PropTypes.array.isRequired,
  totalItems: PropTypes.number,
  page: PropTypes.number,
  tableHeight: PropTypes.number,
  isLoading: PropTypes.bool,
  onTableChange: PropTypes.func.isRequired
};

export default AntDataTable;
