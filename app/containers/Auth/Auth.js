import React from 'react';
import { css } from 'emotion';
import { Container, Row, Col, Form, FormGroup, Button, Input } from 'reactstrap';
import {inject, observer} from 'mobx-react';
import {observable} from 'mobx';

import { SHADES } from 'styles/consts';

import Logo from 'images/logo.png';

@inject(['rootStore'])
@observer
export default class Auth extends React.Component{
  @observable email = '';
  @observable password = '';

  onLogin = async () => {
    this.props.rootStore.setUser({
      email: this.email,
    });
    this.props.history.replace('/');
  };

  render() {
    return (
      <Container fluid>
        <Row className={`${containerStyle} align-items-center justify-content-center`}>
          <Col className={`${windowStyle} justify-content-center`}>
            <Row>
              <Col className={logoContainerStyle}>
                <img src={Logo} alt="logo" className={logoStyle} />
              </Col>
            </Row>
            <Row>
              <Col className={headerStyle}>
                ENSEMBLE
              </Col>
            </Row>
            <Form>
              <FormGroup>
                <Input type="email" name="email" placeholder="Email" onChange={(evt) => {this.email = evt.target.value}} value={this.email} />
              </FormGroup>
              <FormGroup>
                <Input type="password" name="password" placeholder="Senha" onChange={(evt) => {this.password = evt.target.value}} value={this.password} />
              </FormGroup>
            </Form>
            <Row>
              <Col className={buttonContainerStyle}>
                <Button color="primary" onClick={this.onLogin}>ENTRAR</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

const containerStyle = css({
  minHeight: 500,
  height: '100vh',
  backgroundColor: SHADES.lighter,
});

const windowStyle = css({
  padding: 50,
  backgroundColor: SHADES.white,
  maxWidth: '350px !important',
  borderRadius: '5px',
  boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.3)',
});

const logoContainerStyle = css({
  textAlign: 'center',
});

const logoStyle = css({
  width: 100,
});

const headerStyle = css({
  textAlign: 'center',
  padding: '10px 0 20px 0',
});

const buttonContainerStyle = css({
  marginTop: 20,
  textAlign: 'center',
});
