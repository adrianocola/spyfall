import _ from 'lodash';
import React from 'react';
import { Col, Row } from 'reactstrap';

import SpyIcon from 'components/SpyIcon/SpyIcon';

const SpyCount = ({ spyCount, spies, allSpies, hideSpyCount, className }) => {
  if (hideSpyCount) return null;

  return (
    <Row className={className}>
      <Col className="text-center">
        {_.times(allSpies ? spyCount : spies.length).map((i) => <SpyIcon key={i} />)}
      </Col>
    </Row>
  );
};

export default React.memo(SpyCount);
