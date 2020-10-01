/* eslint-disable react/no-array-index-key */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';

import './DSMViewer.scss';

class DSMCards extends Component {
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
    return (
      <Fragment>
        <Row gutter={16}>
          {items.map((item, index) => (
            <Col span={8} key={`${item.hostname}-${index}`}>
              <Card size="small rounded-card" title={item.hostname}>
                {fields.map((field, ind) =>
                  field.isShow && ind > 0 ? (
                    <Row gutter={16} key={`${item.hostname}-${field.name}-${index}-${ind}`}>
                      <Col span={11} className="label">
                        {field.label}
                      </Col>
                      <Col span={11}>{item[field.name]}</Col>
                    </Row>
                  ) : (
                    ''
                  )
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Fragment>
    );
  }
}

DSMCards.defaultProps = {
  data: [],
  fields: []
};

DSMCards.propTypes = {
  data: PropTypes.array,
  fields: PropTypes.array
};

export default DSMCards;
