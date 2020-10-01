/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  message,
  Modal,
  Form,
  Select,
  Checkbox,
  Input,
  Button,
  Icon,
  Spin,
  Switch,
  Dropdown,
  Menu
} from 'antd';
import JSONTree from 'react-json-tree';
import * as d3 from 'd3';

import {
  getDSMWorkspacesRequest,
  getDSMD3ObjectRequest,
  runDSMAction
} from '../../../services/api';

import './DSMEditor.scss';

const { Option } = Select;

const theme = {
  scheme: 'railscasts',
  author: 'ryan bates (http://railscasts.com)',
  base00: '#2b2b2b',
  base01: '#272935',
  base02: '#3a4055',
  base03: '#5a647e',
  base04: '#d4cfc9',
  base05: '#e6e1dc',
  base06: '#f4f1ed',
  base07: '#f9f7f3',
  base08: '#da4939',
  base09: '#cc7833',
  base0A: '#ffc66d',
  base0B: '#a5c261',
  base0C: '#519f50',
  base0D: '#6d9cbe',
  base0E: '#b6b3eb',
  base0F: '#bc9458'
};

const svgWidth = window.innerWidth - 40;
const svgHeight = window.innerHeight - 120;
const nodeWidth = 170;
const nodeHeight = 40;
const nodeCharactersCount = 22;
let dx = nodeWidth + 10; // X disantce between nodes. (Gap). Updated in updates method based on the orientation
let dy = nodeHeight + 30; // Y disantce between nodes. (Gap). Updated in updates method based on the orientation
const collapseCircleRadius = 10;
const EXPAND_SYMBOL = '+';
const COLLAPSE_SYMBOL = '-';
const metaAttr = '___meta___';
let svg;
let svgG;
let root;
let gNode;
let gLink;
let selectedNode = null;
let selectedTarget = null;
let tooltip = null;
let zoom;

class DSMEditor extends Component {
  state = {
    showModal: false,
    selectedNodeData: {},
    nodeDataList: [],
    dsmSelectData: [],
    workspaces: [],
    dsmDomains: [],
    dsmModels: [],
    groups: ['dds-admin', 'dds-user', 'dsm-admin'],
    operations: ['create', 'read', 'update', 'delete'],
    rolesList: [],
    dsmFilter: {
      workspace: undefined,
      domain: undefined,
      model: undefined,
      group: undefined,
      operation: undefined
    },
    showJSONModal: false,
    isLoading: false,
    isHorizontal: true,
    dsmDataD3Model: {},
    jsonModalData: {}
  };

  componentDidMount() {
    this.loadSelectBoxData();
  }

  loadSelectBoxData = () => {
    try {
      getDSMWorkspacesRequest().then(res => {
        this.setState({
          workspaces: res.data && res.data.workspaces ? res.data.workspaces : [],
          dsmSelectData: res.data ? res.data : []
        });
      });
    } catch (error) {
      message.error('Unfortunately there was an error getting the DSM Workspaces.');
    }
  };

  loadDSMD3Object = async (workspace, domain, model) => {
    try {
      this.setState({ isLoading: true });
      // d3.select('#tree-chart')
      //   .selectAll('*')
      //   .remove();
      // d3.select('.node-tooltip').remove();
      const res = await getDSMD3ObjectRequest(workspace, domain, model);
      this.setState({ isLoading: false, dsmDataD3Model: res.data }, () => {
        this.initChart(res.data);
      });
    } catch (error) {
      console.log(error);
      message.error('Unfortunately there was an error getting the DSM model.');
    }
  };

  zoomed = () => {
    svgG.attr('transform', d3.event.transform);
  };

  resetZoom = () => {
    zoom.scaleTo(svg, 1);
    zoom.translateTo(svg, svgHeight, 0);
  };

  createNode = () => {
    let newNode = {
      [metaAttr]: {
        key: 'new_node1',
        enabled: true
      },
      name: 'New Node1'
    };

    // Creates a Node from newNode object using d3.hierarchy(.)
    newNode = d3.hierarchy(newNode);

    // later added some properties to Node like child,parent,depth
    newNode.depth = selectedNode.depth + 1;
    newNode.parent = selectedNode;
    newNode.id = Date.now();

    const node = d3.select(selectedTarget).node().parentNode;
    const collapsiblesWrapper = d3.select(node).selectAll('.collapsibles-wrapper');
    collapsiblesWrapper.select('.text-collapse').text(COLLAPSE_SYMBOL);
    collapsiblesWrapper.select('.node-collapse').attr('r', collapseCircleRadius);

    // Selected is a node, to which we are adding the new node as a child
    // If no child array, create an empty array
    if (!selectedNode.children) {
      selectedNode.children = [];
      selectedNode.data.children = [];
    }

    // Push it to parent.children array
    selectedNode.children.push(newNode);
    selectedNode._children = selectedNode.children;
    selectedNode.data.children.push(newNode.data);

    // Update tree
    this.update(selectedNode);
  };

  removeNode = () => {
    if (selectedNode.parent) {
      const children = selectedNode.parent.children.filter(child => child.id !== selectedNode.id);
      selectedNode.parent.children = children.length ? children : null;
      selectedNode.parent._children = children.length ? children : null;

      if (!children.length) {
        const node = d3.selectAll(`#node-group-${selectedNode.parent.id}`).node().parentNode;
        const collapsiblesWrapper = d3.select(node).selectAll('.collapsibles-wrapper');
        collapsiblesWrapper.select('.text-collapse').text('');
        collapsiblesWrapper.select('.node-collapse').attr('r', 0);
      }
      this.update(selectedNode.parent);
    } else {
      // eslint-disable-next-line no-alert
      alert('root node should not be deleted.');
    }
  };

  editNode = () => {
    this.nodeClickHandler(selectedNode);
  };

  contextMenu = (data, index) => {
    selectedNode = data;
    selectedTarget = d3.event.currentTarget;
    this.setState({ selectedNodeData: data.data });
    let x;
    let y;
    if (d3.event.pageX || d3.event.pageY) {
      x = d3.event.pageX;
      y = d3.event.pageY;
    } else if (d3.event.clientX || d3.event.clientY) {
      x = d3.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = d3.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    y -= 40;

    d3.select('#context_menu')
      .style('left', `${x}px`)
      .style('top', `${y}px`)
      .classed('show', true);
    d3.event.preventDefault();
  };

  hideContextMenu = () => {
    d3.select('#context_menu')
      .style('left', '-1000px')
      .style('top', '-1000px')
      .classed('show', false);
  };

  toggleChildrenClick = d => {
    const target = d3.event.currentTarget;
    const node = d3.select(target).node().parentNode;
    d3.select(node)
      .select('text.text-collapse')
      .text(dv => {
        dv.collapseText =
          dv.collapseText === EXPAND_SYMBOL ? COLLAPSE_SYMBOL : dv.children ? EXPAND_SYMBOL : null;
        return dv.collapseText;
      });
    d.children = d.children ? null : d._children;
    this.update(d);
  };

  nodeClickHandler = d => {
    this.hideContextMenu();
    selectedNode = d;
    const selectedNodeData = d.data;
    const list = Object.keys(selectedNodeData)
      .filter(key => key !== 'children' && key !== metaAttr)
      .map(key => {
        const str =
          typeof selectedNodeData[key] === 'object'
            ? JSON.stringify(selectedNodeData[key])
            : selectedNodeData[key];
        return {
          key,
          value: str,
          type:
            typeof selectedNodeData[key] === 'object'
              ? Array.isArray(selectedNodeData[key])
                ? 'array'
                : 'object'
              : typeof selectedNodeData[key]
        };
      });
    this.props.form.resetFields();
    this.setState({
      selectedNodeData: d.data,
      nodeDataList: list,
      showModal: true,
      rolesList: selectedNodeData.rbac ? selectedNodeData.rbac : []
    });
  };

  equalToEventTarget = () => this === d3.event.target;

  setCollapsibleSymbolProperty = d => {
    d.collapseText =
      d.children && d._children ? COLLAPSE_SYMBOL : d._children ? EXPAND_SYMBOL : null;
  };

  nodeMouseover = () => {
    selectedTarget = d3.event.currentTarget;
    tooltip.classed('show', true).classed('hide', false);
  };

  nodeMousemove = d => {
    const x = d3.event.clientX;
    const y = d3.event.clientY - nodeHeight * 2 - 20;
    const { data } = d;
    tooltip
      .html(
        `<span class="title">${data.name}</span><hr/><span class="desc">${
          data.description ? data.description : ''
        }</span>`
      )
      .style('left', `${x}px`)
      .style('top', `${y}px`);
  };

  nodeMouseout = () => {
    tooltip.classed('show', false).classed('hide', true);
  };

  initChart = DSMData => {
    const { isHorizontal } = this.state;
    d3.select('#tree-chart')
      .selectAll('*')
      .remove();
    d3.select('.node-tooltip').remove();

    const data = DSMData;

    root = d3.hierarchy(data);
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });

    // Redraw for zoom
    zoom = d3
      .zoom()
      .scaleExtent([0.05, 5])
      .on('zoom', this.zoomed);

    tooltip = d3
      .select('#tree-chart-wrapper')
      .append('div')
      .attr('class', 'node-tooltip')
      .classed('hide', true);

    svg = d3
      .select('#tree-chart')
      .attr('viewBox', [0, 0, svgWidth, svgHeight])
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .call(zoom);
    svgG = svg.append('g');
    zoom.translateTo(svg, isHorizontal ? svgHeight : 0, 0);

    gLink = svgG.append('g').classed('link', true);

    gNode = svgG
      .append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

    // eslint-disable-next-line func-names
    d3.select('body').on('click', () => {
      this.hideContextMenu();
    });

    this.update(root);
  };

  update = source => {
    const { isHorizontal } = this.state;
    let diagonal = null;
    if (isHorizontal) {
      diagonal = d3
        .linkHorizontal()
        .source(d => ({
          x: d.source.x,
          y: d.source.y + nodeWidth
        }))
        .x(d => d.y)
        .y(d => d.x);
    } else {
      diagonal = d3
        .linkVertical()
        .source(d => ({
          x: d.source.x,
          y: d.source.y + nodeHeight / 2
        }))
        .x(d => d.x + nodeWidth / 2)
        .y(d => d.y);
    }

    dx = nodeWidth + 10; // X disantce between nodes. (Gap)
    dy = nodeHeight + 30; // Y disantce between nodes. (Gap)
    if (isHorizontal) {
      dx = nodeHeight + 10;
      dy = nodeWidth + 30;
    }
    const tree = d3.tree().nodeSize([dx, dy]);

    const duration = d3.event && d3.event.altKey ? 1000 : 500;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const transition = svgG
      .transition()
      .duration(duration)
      .tween('resize', window.ResizeObserver ? null : () => () => svgG.dispatch('toggle'));

    // Update the nodes…
    const node = gNode.selectAll('g.node').data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    let nodeTransform = `translate(${source.x0},${source.x0})`;
    if (isHorizontal) {
      nodeTransform = `translate(${source.y0},${source.x0})`;
    }
    const nodeEnter = node
      .enter()
      .append('g')
      .classed('node', true)
      .classed('disabled', d => {
        const meta = d.data.___meta___;
        if (typeof meta.enabled === 'boolean') {
          return !meta.enabled;
        }
        return false;
      })
      // .attr('style', d => {
      //   const meta = d.data.___meta___;
      //   return `
      //     fill: ${meta.bgColor ? meta.bgColor : ''}
      //   `;
      // })
      .attr('transform', d => nodeTransform);

    const nodeGroup = nodeEnter
      .append('g')
      .attr('class', 'node-group')
      .attr('id', d => `node-group-${d.id}`);

    nodeGroup
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 3)
      .attr('y', -(nodeHeight / 2));

    nodeGroup
      .append('text')
      .text(d => {
        if (d.data.name.length >= nodeCharactersCount) {
          return `${d.data.name.substr(0, nodeCharactersCount - 1)}...`;
        }
        return d.data.name;
      })
      .attr('x', 10)
      .attr('y', 3);

    nodeGroup.on('mouseover', this.nodeMouseover);
    nodeGroup.on('mousemove', this.nodeMousemove);
    nodeGroup.on('mouseout', this.nodeMouseout);
    nodeGroup.on('click', this.nodeClickHandler);
    nodeGroup.on('contextmenu', this.contextMenu);

    const collapsiblesWrapper = nodeEnter.append('g').attr('class', 'collapsibles-wrapper');

    collapsiblesWrapper
      .append('circle')
      .attr('class', 'node-collapse')
      .attr('cx', isHorizontal ? nodeWidth : nodeWidth / 2)
      .attr('cy', isHorizontal ? 0 : nodeHeight / 2)
      .attr('r', d => {
        if (d.children || d._children) return collapseCircleRadius;
        return 0;
      })
      .attr('', this.setCollapsibleSymbolProperty);
    const textC = collapseCircleRadius / 2;
    collapsiblesWrapper
      .append('text')
      .attr('class', 'text-collapse')
      .attr('x', isHorizontal ? nodeWidth : nodeWidth / 2)
      .attr('y', isHorizontal ? textC : nodeHeight / 2 + textC)
      .attr('text-anchor', 'middle')
      .text(d => d.collapseText);

    collapsiblesWrapper.on('click', this.toggleChildrenClick);

    // Transition nodes to their new position.
    node
      .merge(nodeEnter)
      .transition(transition)
      .attr('transform', d => `translate(${isHorizontal ? d.y : d.x},${isHorizontal ? d.x : d.y})`)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    node
      .exit()
      .transition(transition)
      .remove()
      .attr(
        'transform',
        d =>
          `translate(${isHorizontal ? source.y : source.x},${isHorizontal ? source.x : source.y})`
      )
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0);

    // Update the links…
    const link = gLink.selectAll('path').data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .append('path')
      .attr('d', d => {
        const o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link
      .merge(linkEnter)
      .transition(transition)
      .attr('d', diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition(transition)
      .remove()
      .attr('d', d => {
        const o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  handleCancelModal = () => {
    this.setState({ showModal: false });
  };

  isValidJSON = text => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        try {
          const newData = {
            [metaAttr]: selectedNode.data[metaAttr] ? selectedNode.data[metaAttr] : { key: '' }
          };
          let isError = false;
          values.nodeDataList.forEach(data => {
            if (data.type === 'array' || data.type === 'object') {
              if (!this.isValidJSON(data.value)) {
                message.error(`Invalid object/array at '${data.key}' field`);
                isError = true;
                return;
              }
              newData[data.key] = JSON.parse(data.value);
            } else {
              newData[data.key] = data.value;
            }
          });
          newData[metaAttr].key = newData.name.toLowerCase().replace(/ /g, '_');
          if (values.rolesList) {
            newData.rbac = values.rolesList;
          }
          if (isError) return;
          selectedNode.data = { ...selectedNode.data, ...newData };
          const nodeGroupd = d3.select(`#node-group-${selectedNode.id}`);
          nodeGroupd.select('text').text(newData.name);
          message.info('Node updated successfully.');
          this.setState({ showModal: false });
        } catch (error) {
          message.error(error.message);
        }
      } else {
        message.error(err);
      }
    });
  };

  addKey = (nodeDataList, index) => {
    nodeDataList.push({
      key: '',
      value: '',
      type: 'string'
    });
    this.setState({ nodeDataList });
  };

  deleteKey = (nodeDataList, index) => {
    nodeDataList.splice(index, 1);
    this.setState({ nodeDataList });
  };

  addRole = rolesList => {
    rolesList.push({
      group: undefined,
      create: false,
      read: false,
      update: false,
      delete: false
    });
    this.setState({ rolesList });
  };

  deleteRole = (rolesList, index) => {
    rolesList.splice(index, 1);
    this.setState({ rolesList });
  };

  generateDataModel = () => {
    this.setState({ showJSONModal: true, jsonModalData: root.data });
  };

  handleCancelJsonModal = () => {
    this.setState({ showJSONModal: false });
  };

  onDsmWorkspaceChange = workspace => {
    const { dsmSelectData, dsmFilter } = this.state;
    this.setState({
      dsmDomains: dsmSelectData.domains[workspace],
      dsmModels: [],
      dsmFilter: {
        ...dsmFilter,
        workspace,
        domain: undefined,
        model: undefined
      }
    });
  };

  onDsmDomainChange = domain => {
    const { dsmSelectData, dsmFilter } = this.state;
    this.setState({
      dsmModels: dsmSelectData.models[dsmFilter.workspace][domain],
      dsmFilter: {
        ...dsmFilter,
        domain,
        model: undefined
      }
    });
  };

  onDsmModelChange = () => {
    const dsmFilter = this.props.form.getFieldValue('dsmFilter');
    this.setState({ dsmFilter });
    if (dsmFilter.workspace && dsmFilter.domain && dsmFilter.model) {
      this.loadDSMD3Object(dsmFilter.workspace, dsmFilter.domain, dsmFilter.model);
    } else {
      message.error('Worspace / Domain / Model should not be empty.');
    }
  };

  onChangeOrientation = e => {
    const { isHorizontal, dsmDataD3Model } = this.state;
    this.setState({ isHorizontal: !isHorizontal }, () => {
      this.initChart(dsmDataD3Model);
    });
  };

  handleActionMenuClick = async e => {
    const { workspace, domain, model } = this.state.dsmFilter;
    if (!workspace || !domain || !model) {
      message.info('Please choose the DSM model to run the action.');
      return;
    }
    try {
      this.setState({ isLoading: true });
      const res = await runDSMAction(workspace, domain, model, e.key);
      message.success('Action completed successfully.');
    } catch (error) {
      this.setState({ isLoading: false });
      message.error('Unfortunately there was an error running the action.');
    }
  };

  handleDownloadClick = async e => {
    const { workspace, domain, model } = this.state.dsmFilter;
    if (!workspace || !domain || !model) {
      message.info('Please choose the DSM model to download the model.');
      return;
    }
    try {
      this.setState({ isLoading: true });
      const res = await runDSMAction(workspace, domain, model, 'download');
      message.success('DSM model downloaded successfully.');
    } catch (error) {
      this.setState({ isLoading: false });
      message.error('Unfortunately there was an error downloading the model.');
    }
  };

  render() {
    const {
      showModal,
      selectedNodeData,
      nodeDataList,
      showJSONModal,
      rolesList,
      jsonModalData,
      dsmModels,
      dsmDomains,
      workspaces,
      groups,
      operations,
      dsmFilter,
      isLoading,
      isHorizontal
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const actionMenu = (
      <Menu onClick={this.handleActionMenuClick}>
        <Menu.Item key="run-detail">Run Details</Menu.Item>
        <Menu.Item key="run-list">Run List</Menu.Item>
        <Menu.Item key="run-node">Run Node</Menu.Item>
      </Menu>
    );

    return (
      <Fragment>
        {isLoading && (
          <div className="loader">
            <Spin />
          </div>
        )}
        <Form onSubmit={this.handleSubmit} className="dms-filter-form">
          <Row gutter={12}>
            <Col span={4}>
              <h4 className="select-label">Wrokspace</h4>
              <Form.Item>
                {getFieldDecorator(`dsmFilter.workspace`, {
                  initialValue: dsmFilter.workspace
                })(
                  <Select
                    placeholder="Select Workspace"
                    className="data-model-select"
                    onSelect={this.onDsmWorkspaceChange}
                  >
                    {workspaces.map(ws => (
                      <Option value={ws} key={ws}>
                        {ws}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <h4 className="select-label">Domain</h4>
              <Form.Item>
                {getFieldDecorator(`dsmFilter.domain`, {
                  initialValue: dsmFilter.domain
                })(
                  <Select
                    placeholder="Select Domain"
                    className="data-model-select"
                    onSelect={this.onDsmDomainChange}
                  >
                    {dsmDomains.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <h4 className="select-label">DSM Model</h4>
              <Form.Item>
                {getFieldDecorator(`dsmFilter.model`, {
                  initialValue: dsmFilter.model
                })(
                  <Select
                    showSearch
                    placeholder="Select DSM Model"
                    className="data-model-select"
                    onSelect={this.onDsmModelChange}
                  >
                    {dsmModels.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={2} className="btn-wrapper">
              <Button
                type="primary"
                size="default"
                onClick={this.onDsmModelChange}
                disabled={!dsmFilter.model}
              >
                Load
              </Button>
            </Col>
            <Col span={4} className="btn-wrapper">
              <Dropdown overlay={actionMenu} disabled={!dsmFilter.model}>
                <Button type="primary" size="default">
                  Actions
                  <Icon type="down" />
                </Button>
              </Dropdown>
              <Button
                type="primary"
                size="default"
                disabled={!dsmFilter.model}
                onClick={this.handleDownloadClick}
              >
                Download
              </Button>
            </Col>
          </Row>
        </Form>
        <Row gutter={12} className="selected-wrapper">
          <Col span={4}>
            <h5>Selected Workspace</h5>
            <h3>{dsmFilter.workspace}</h3>
          </Col>
          <Col span={4}>
            <h5>Selected Domain</h5>
            <h3>{dsmFilter.domain}</h3>
          </Col>
          <Col span={6}>
            <h5>Selected DSM Model</h5>
            <h3>{dsmFilter.model}</h3>
          </Col>

          <Col span={4} className="legend">
            <div className="allowed">
              <span className="icon" />
              Allowed
            </div>
            <div className="not-allowed">
              <span className="icon" />
              Not Allowed
            </div>
          </Col>
          <Col span={4} className="legend">
            <h5>Horizontal Orientation</h5>
            <Switch checked={isHorizontal} onChange={this.onChangeOrientation} />
          </Col>
        </Row>
        <div id="context_menu" className="d3-context-menu">
          <ul>
            <li onClick={this.createNode}>Create Child</li>
            <li onClick={this.removeNode}>Delete</li>
            <li onClick={this.editNode}>Edit</li>
          </ul>
        </div>
        <Modal
          visible={showModal}
          title={selectedNodeData.name}
          onCancel={this.handleCancelModal}
          maskClosable={false}
          keyboard={false}
          className="json-modal dsm-edit-modal"
          footer={[
            <Button key="back" type="primary" onClick={this.handleCancelModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleSubmit}>
              Update
            </Button>
          ]}
        >
          <Form onSubmit={this.handleSubmit}>
            <h3>Attributes/Fields</h3>
            {nodeDataList.map((data, index) => (
              <Row gutter={12} key={`${data.key}-${index}`}>
                <Col span={6}>
                  <Form.Item>
                    {getFieldDecorator(`nodeDataList[${index}].key`, {
                      initialValue: data.key
                    })(
                      <Input
                        placeholder="Key"
                        maxLength={512}
                        disabled={data.key === 'name' || data.key === metaAttr}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item>
                    {getFieldDecorator(`nodeDataList[${index}].type`, {
                      initialValue: data.type
                    })(
                      <Select placeholder="Type" disabled={data.key === metaAttr}>
                        <Option value="string" key="string">
                          String
                        </Option>
                        <Option value="array" key="array">
                          Array
                        </Option>
                        <Option value="object" key="object">
                          Object
                        </Option>
                        <Option value="boolean" key="boolean">
                          Boolean
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item>
                    {getFieldDecorator(`nodeDataList[${index}].value`, {
                      initialValue: data.value
                    })(<Input placeholder="Value" disabled={data.key === metaAttr} />)}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    {data.key !== 'name' && data.key !== metaAttr && (
                      <Button
                        className="add-delete-btn"
                        onClick={() => {
                          this.deleteKey(nodeDataList, index);
                        }}
                      >
                        <Icon type="delete" />
                      </Button>
                    )}
                    {nodeDataList.length === index + 1 && (
                      <Button
                        className="add-delete-btn"
                        onClick={() => {
                          this.addKey(nodeDataList, index);
                        }}
                      >
                        <Icon type="plus" />
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ))}
            <h3>Role based access control (RBAC)</h3>
            {rolesList.map((roles, index) => (
              <Row gutter={10} key={`${roles.group}-${index}`}>
                <Col span={6}>
                  <Form.Item>
                    {getFieldDecorator(`rolesList[${index}].group`, {
                      initialValue: roles.group,
                      rules: [{ required: true, message: 'Please choose the UIM group!' }]
                    })(
                      <Select placeholder="UIM Group">
                        {groups.map((group, i) => (
                          <Option value={group} key={`${i} - ${Date.now()}`}>
                            {group}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item colon={false}>
                    {getFieldDecorator(`rolesList[${index}].create`, {
                      valuePropName: 'checked',
                      initialValue: roles.create
                    })(<Checkbox>Create</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item colon={false}>
                    {getFieldDecorator(`rolesList[${index}].read`, {
                      valuePropName: 'checked',
                      initialValue: roles.read
                    })(<Checkbox>Read</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item colon={false}>
                    {getFieldDecorator(`rolesList[${index}].update`, {
                      valuePropName: 'checked',
                      initialValue: roles.update
                    })(<Checkbox>Update</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item colon={false}>
                    {getFieldDecorator(`rolesList[${index}].delete`, {
                      valuePropName: 'checked',
                      initialValue: roles.delete
                    })(<Checkbox>Delete</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    {index > 0 && (
                      <Button
                        className="add-delete-btn"
                        onClick={() => {
                          this.deleteRole(rolesList, index);
                        }}
                      >
                        <Icon type="delete" />
                      </Button>
                    )}
                    {index + 1 === rolesList.length && (
                      <Button
                        className="add-delete-btn"
                        onClick={() => {
                          this.addRole(rolesList);
                        }}
                      >
                        <Icon type="plus" />
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ))}
            {rolesList.length === 0 && (
              <Button
                className="add-delete-btn"
                onClick={() => {
                  this.addRole(rolesList);
                }}
              >
                <Icon type="plus" />
                Add UIM Group
              </Button>
            )}
          </Form>
        </Modal>
        <Modal
          visible={showJSONModal}
          onCancel={this.handleCancelJsonModal}
          maskClosable={false}
          keyboard={false}
          className="json-modal json-preview-modal"
        >
          <JSONTree data={jsonModalData} theme={theme} invertTheme hideRoot />
        </Modal>
        <div id="tree-chart-wrapper">
          <svg id="tree-chart" />
        </div>
      </Fragment>
    );
  }
}

const WrappedDSMEditor = Form.create({ name: 'DSMEditor' })(DSMEditor);

export default WrappedDSMEditor;
