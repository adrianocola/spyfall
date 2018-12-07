import React from 'react';
import { observer } from 'mobx-react';
import { SHADES } from 'styles/consts';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import {css} from 'emotion';

@observer
export default class RolePopup extends React.Component{
  render() {
    const { isOpen, toggle, player, role } = this.props;
    return (
      <Modal centered isOpen={isOpen} toggle={toggle}>
        <ModalHeader tag="h3" toggle={toggle} className={`${styles.header} justify-content-center`} close={<button type="button" className="close" onClick={toggle}>&times;</button>}>
          {player}
        </ModalHeader>
        <ModalBody className={styles.body}>
          {role}
        </ModalBody>
      </Modal>
    );
  }
}

const styles = {
  location: css({
    borderBottom: `1px solid ${SHADES.lighter}`,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  }),
};
