/* eslint-disable react/no-array-index-key */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

import './DSMViewer.scss';

class DSMLists extends Component {
  state = {
    items: [],
    fields: []
  };

  componentDidMount() {
    const { data, fields } = this.props;
    this.setState({ items: data, fields });
  }

  componentWillReceiveProps() {}

  render() {
    const { items, fields } = this.state;
    const { titleClickHandler } = this.props;
    return (
      <Fragment>
        {items.map((item, index) => (
          <div className="list-items" key={`${item.hostname}-${index}`}>
            <Card size="small" title={item.hostname} onClick={titleClickHandler}>
              {fields.map((field, ind) =>
                field.isShow && ind > 0 ? (
                  <p key={`${item.hostname}-${field.name}-${index}-${ind}`}>
                    <span className="label">{field.label}</span>
                    <span>{item[field.name] ? item[field.name] : '-'}</span>
                  </p>
                ) : (
                  ''
                )
              )}
            </Card>
          </div>
        ))}
      </Fragment>
    );
  }
}

DSMLists.defaultProps = {
  data: [],
  fields: []
};

DSMLists.propTypes = {
  data: PropTypes.array,
  fields: PropTypes.array
};

export default DSMLists;
