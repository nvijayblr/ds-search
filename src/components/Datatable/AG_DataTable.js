/* eslint-disable no-param-reassign */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { AgGridReact } from "ag-grid-react";
import classNames from "classnames";

import "./DataTable.scss";

const COLUMN_WIDTH = 320;

class AG_DataTable extends Component {
  state = {
    gridApi: null,
    gridParams: null,
  };

  gridWrapperRef = React.createRef();

  overlayLoadingTemplate = `<div class="spin-wrapper">
    <div class="ant-spin ant-spin-lg ant-spin-spinning">
    <span class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span>
    </div>
    </div>`;

  overlayNoRowsTemplate = `<div class="no-results-wrapper">
    <div class="message">
    <i class="anticon anticon-exclamation-circle">
    <svg viewBox="64 64 896 896" class="" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zM488 576h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg>
    </i> 
    <span>No rows to show</span>
    </div>
    </div>`;

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    const { gridApi } = this.state;

    if (gridApi && gridApi.destroy) {
      gridApi.destroy();
    }
  }

  onGridReady = (params) => {
    const { autoHeight } = this.props;

    this.setState({
      gridApi: params.api,
      gridParams: params,
      gridColumnApi: params.columnApi,
    });

    if (autoHeight) {
      params.api.resetRowHeights();
    }
  };

  showRequiredOverlay = (tableResultsAreLoading) => {
    const { gridApi } = this.state;
    const { rowData } = this.props;

    if (!gridApi) {
      return;
    }

    if (tableResultsAreLoading) {
      gridApi.showLoadingOverlay();
      return;
    }

    if (!tableResultsAreLoading && !rowData.length) {
      gridApi.showNoRowsOverlay();
      return;
    }

    gridApi.hideOverlay();
  };

  createColumnDefsWithOptions = () => {
    const { rowData, columns } = this.props;

    if (!rowData.length) return [];

    const columnDefs = [];
    for (const field of columns) {
      if (field.isShow) {
        columnDefs.push({
          ...this.defaultColumnDefs,
          headerName: field.label,
          field: field.name,
        });
      }
    }

    return columnDefs.map((columnDef) => {
      const columnDefObj = columnDef;
      return columnDefObj;
    });
  };

  render() {
    const { gridApi } = this.state;
    const {
      tableHeight,
      enableColResize,
      rowData,
      enableSorting,
      enableFilter,
      floatingFilter,
      suppressMenu,
      headerHeight,
      floatingFiltersHeight,
      rowHeight,
      pagination,
      context,
      autoHeight,
      tableResultsAreLoading,
    } = this.props;
    this.showRequiredOverlay(tableResultsAreLoading);
    const columnDefsWithOptions = this.createColumnDefsWithOptions();

    // this.customFilterUniqueData(rowData);

    const wrapperClasses = classNames("ag-theme-balham", {
      "auto-height": autoHeight,
    });

    // If there are too few columns to fill the table horizontally,
    // use `.sizeColumnsToFit()` to fill the table
    if (this.gridWrapperRef.current && gridApi) {
      const gridWidth = this.gridWrapperRef.current.clientWidth;
      const columnCount = columnDefsWithOptions.length;

      if (columnCount * COLUMN_WIDTH <= gridWidth) {
        gridApi.sizeColumnsToFit();
      }
    }

    return (
      <div
        ref={this.gridWrapperRef}
        className={wrapperClasses}
        style={{
          height: `${tableHeight}px`,
          visibility: gridApi ? "visible" : "hidden",
        }}
      >
        <AgGridReact
          enableColResize={enableColResize}
          columnDefs={columnDefsWithOptions}
          rowData={rowData}
          enableSorting={enableSorting}
          enableFilter={enableFilter}
          floatingFilter={floatingFilter}
          suppressMenu={suppressMenu}
          headerHeight={headerHeight}
          floatingFiltersHeight={floatingFiltersHeight}
          rowHeight={rowHeight}
          pagination={pagination}
          suppressRowClickSelection
          suppressCellSelection
          rowSelection="single"
          overlayLoadingTemplate={this.overlayLoadingTemplate}
          overlayNoRowsTemplate={this.overlayNoRowsTemplate}
          getRowHeight={this.getRowHeight}
          onGridReady={this.onGridReady}
          context={context}
          suppressColumnMoveAnimation
          animateRows
          defaultColDef={{
            width: COLUMN_WIDTH,
          }}
        />
      </div>
    );
  }
}

AG_DataTable.defaultProps = {
  pagination: true,
  enableFilter: true,
  enableSorting: true,
  enableColResize: true,
  floatingFilter: true,
  suppressMenu: true,
  autoHeight: false,
  isCmaTable: false,
  isReportsCmaTable: false,
  tableResultsAreLoading: false,
  headerHeight: 40,
  floatingFiltersHeight: 40,
  rowHeight: 38,
  context: {},
  hiddenColumns: [],
  filterData: {},
};

AG_DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rowData: PropTypes.array.isRequired,
  tableHeight: PropTypes.number.isRequired,
  pagination: PropTypes.bool,
  enableFilter: PropTypes.bool,
  enableSorting: PropTypes.bool,
  enableColResize: PropTypes.bool,
  floatingFilter: PropTypes.bool,
  suppressMenu: PropTypes.bool,
  autoHeight: PropTypes.bool,
  isCmaTable: PropTypes.bool,
  isReportsCmaTable: PropTypes.bool,
  tableResultsAreLoading: PropTypes.bool,
  headerHeight: PropTypes.number,
  floatingFiltersHeight: PropTypes.number,
  rowHeight: PropTypes.number,
  context: PropTypes.object,
  hiddenColumns: PropTypes.array,
  filterData: PropTypes.object,
};

export default AG_DataTable;
