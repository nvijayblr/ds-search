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
import { Row, Col, message, Modal, Form, Select, Checkbox, Input, Button, Icon, Spin } from 'antd';
import * as d3 from 'd3';

const svgWidth = window.innerWidth - 40;
const svgHeight = window.innerHeight - 120;
const nodeWidth = 170;
const nodeHeight = 40;
const dx = nodeHeight + 10; // X disantce between nodes. (Gap)
const dy = nodeWidth + 30; // Y disantce between nodes. (Gap)
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

const diagonal = d3
  .linkHorizontal()
  .source(d => ({
    x: d.source.x,
    y: d.source.y + nodeWidth
  }))
  .x(d => d.y)
  .y(d => d.x);

const tree = d3.tree().nodeSize([dx, dy]);

class DSMD3Chart extends Component {
  state = {
    isLoading: false,
    selectedNodeData: {}
  };

  componentDidMount() {
    console.log(this.props.chartData);
  }

  componentWillReceiveProps() {
    console.log(this.props.chartData);
    this.initChart(this.props.chartData);
  }

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

  // nodeClickHandler = d => {
  //   this.hideContextMenu();
  //   selectedNode = d;
  //   const selectedNodeData = d.data;
  //   const list = Object.keys(selectedNodeData)
  //     .filter(key => key !== 'children' && key !== metaAttr)
  //     .map(key => {
  //       const str =
  //         typeof selectedNodeData[key] === 'object'
  //           ? JSON.stringify(selectedNodeData[key])
  //           : selectedNodeData[key];
  //       return {
  //         key,
  //         value: str,
  //         type:
  //           typeof selectedNodeData[key] === 'object'
  //             ? Array.isArray(selectedNodeData[key])
  //               ? 'array'
  //               : 'object'
  //             : typeof selectedNodeData[key]
  //       };
  //     });
  //   this.props.form.resetFields();
  //   this.setState({
  //     selectedNodeData: d.data,
  //     nodeDataList: list,
  //     showModal: true,
  //     rolesList: selectedNodeData.rbac ? selectedNodeData.rbac : []
  //   });
  // };

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
    zoom.scaleTo(svg, 1);
    zoom.translateTo(svg, svgHeight, 0);

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
      .attr('transform', d => `translate(${source.y0},${source.x0})`);

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
      .text(d => d.data.name)
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
      .attr('cx', nodeWidth)
      .attr('r', d => {
        if (d.children || d._children) return collapseCircleRadius;
        return 0;
      })
      .attr('', this.setCollapsibleSymbolProperty);

    collapsiblesWrapper
      .append('text')
      .attr('class', 'text-collapse')
      .attr('x', nodeWidth)
      .attr('y', collapseCircleRadius / 2)
      .attr('text-anchor', 'middle')
      .text(d => d.collapseText);

    collapsiblesWrapper.on('click', this.toggleChildrenClick);

    // Transition nodes to their new position.
    node
      .merge(nodeEnter)
      .transition(transition)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    node
      .exit()
      .transition(transition)
      .remove()
      .attr('transform', d => `translate(${source.y},${source.x})`)
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

  render() {
    const { isLoading } = this.state;

    return (
      <Fragment>
        {isLoading && (
          <div className="loader">
            <Spin />
          </div>
        )}
        <div id="tree-chart-wrapper">
          <svg id="tree-chart" />
        </div>
      </Fragment>
    );
  }
}

export default DSMD3Chart;
