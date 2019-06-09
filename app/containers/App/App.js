import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import {Switch, Route, Link} from 'react-router-dom';
import {css} from 'emotion';
import i18n from 'i18n';
import {MEDIA, SHADES} from 'styles/consts';
import { ToastContainer } from 'react-toastify';
import Loadable from 'react-loadable';
import { Container, Row, Col, Input } from 'reactstrap';
import { auth } from 'services/firebase';
import { setUserIdAction, setLanguageAction, setImportedLegacy } from 'actions/root';
import { setSelectedLocations, setCustomLocations } from 'actions/config';

import SpinnerModal from 'components/SpinnerModal/SpinnerModal';
import SpyIcon from 'components/SpyIcon/SpyIcon';

const LoadableSettings = Loadable({loader: () => import('../Settings/Settings'), loading: SpinnerModal});
const LoadableGame = Loadable({loader: () => import('../Game/Game'), loading: SpinnerModal});
const LoadableJoinRoom = Loadable({loader: () => import('../JoinRoom/JoinRoom'), loading: SpinnerModal});

export class App extends React.Component{
  componentDidMount() {
    const { setUserId, importedLegacy } = this.props;
    auth.signInAnonymously().then((authUser) => {
      setUserId(authUser.user.uid);
    });
    if(!importedLegacy) this.importLegacy();
  }

  importLegacy = () => {
    try{
      const customLocations = window.store.get('custom_locations');
      const selectedLocations = window.store.get('selected_locations');
      if(customLocations){
        this.props.setCustomLocations(customLocations);
      }
      if(selectedLocations){
        const selectedLocationsMap = {};
        selectedLocations.forEach((location) => {
          selectedLocationsMap[location] = true;
        });
        this.props.setSelectedLocations(selectedLocationsMap);
      }
    }catch(err){
      console.error(err); // eslint-disable-line no-console
    }

    this.props.setImportedLegacy(true);
  };

  setLanguage = (language) => {
    const { setLanguage } = this.props;
    i18n.changeLanguage(language);
    setLanguage(language);
  };

  render() {
    const { language } = this.props;
    return (
      <Container className={styles.container}>
        <Helmet
          defaultTitle="Spyfall"
        >
          <meta name="description" content="Ensemble React Web Template" />
        </Helmet>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Row className="align-items-center justify-content-center">
              <Col xs="12" sm="4" className="text-center">
                <Link to="/">
                  <SpyIcon />
                  Spyfall
                </Link>
              </Col>
              <Col xs="12" sm="8" className={`${styles.languageSelector} text-center`}>
                <Input type="select" name="languages" id="languages" value={language} onChange={(evt) => this.setLanguage(evt.target.value)}>
                  <option value="af-ZA">Afrikaans</option>
                  <option value="ar-SA">العربية</option>
                  <option value="bg-BG">Български</option>
                  <option value="ca-ES">Català</option>
                  <option value="cs-CZ">Čeština</option>
                  <option value="da-DK">Dansk</option>
                  <option value="de-DE">Deutsch</option>
                  <option value="el-GR">ελληνικά</option>
                  <option value="en-GB">English - United Kingdom</option>
                  <option value="en-US">English - United States</option>
                  <option value="es-ES">Español</option>
                  <option value="fa-IR">فارسی</option>
                  <option value="fi-FI">Suomi</option>
                  <option value="fr-FR">Fran&ccedil;ais</option>
                  <option value="he-IL">עברית</option>
                  <option value="hu-HU">Magyar</option>
                  <option value="id-ID">Indonesian</option>
                  <option value="it-IT">Italiano</option>
                  <option value="ja-JP">日本語</option>
                  <option value="ko-KR">한국어</option>
                  <option value="nl-NL">Nederlands</option>
                  <option value="no-NO">Norsk</option>
                  <option value="pl-PL">Język Polski</option>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="pt-PT">Português (Portugal)</option>
                  <option value="ro-RO">Română</option>
                  <option value="ru-RU">Pусский</option>
                  <option value="sr-CS">Srpski (Latinica)</option>
                  <option value="sr-SP">Српски (Ћирилица)</option>
                  <option value="sv-SE">Svenska</option>
                  <option value="th-TH">ภาษาไทย</option>
                  <option value="tr-TR">Türkçe</option>
                  <option value="uk-UA">Українська</option>
                  <option value="vi-VN">Tiếng Việt</option>
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁體中文</option>
                </Input>
              </Col>
            </Row>
            <Switch>
              <Route exact path="/settings" component={LoadableSettings} />
              <Route exact path="/join" component={LoadableJoinRoom} />
              <Route exact path="/" component={LoadableGame} />
            </Switch>
            <Row className={styles.localizationContainer}>
              <Col className="text-center">
                <a title="Crowdin" target="_blank" href="https://crowdin.com/project/adrianocola-spyfall">
                  <img alt="localization status" src="https://d322cqt584bo4o.cloudfront.net/adrianocola-spyfall/localized.svg" />
                </a>
                <a className={styles.localizationLink} target="_blank" href="https://crowdin.com/project/adrianocola-spyfall">Help us with translations!</a>
              </Col>
            </Row>
            <Row className={styles.footer}>
              <Col className="text-center">
                <Row>
                  <Col>
                    <a target="_blank" href="http://international.hobbyworld.ru/catalog/25-spyfall/">Spyfall</a> is designed by Alexandr Ushan and published by <a target="_blank" href="http://international.hobbyworld.ru/">Hobby World</a>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Spy icon created by Dan Hetteix (<a target="_blank" href="http://thenounproject.com/">TheNounProject</a>)
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <a target="_blank" href="https://github.com/adrianocola/spyfall">https://github.com/adrianocola/spyfall</a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    );
  }
}

const styles = {
  container: css({
    paddingTop: 50,
  }),
  languageSelector: css({
    [MEDIA.xsOnly]: {
      marginTop: 10,
    },
  }),
  localizationContainer: css({
    marginTop: 40,
    fontSize: '0.8rem',
  }),
  localizationLink: css({
    marginLeft: 10,
  }),
  footer: css({
    marginTop: 20,
    marginBottom: 30,
    fontSize: '0.8rem',
    color: SHADES.light,
  }),
};

const mapStateToProps = (state) => ({
  language: state.root.language,
  importedLegacy: state.root.importedLegacy,
});

const mapDispatchToProps = (dispatch) => ({
  setUserId: (userId) => dispatch(setUserIdAction(userId)),
  setLanguage: (language) => dispatch(setLanguageAction(language)),
  setImportedLegacy: (importedLegacy) => dispatch(setImportedLegacy(importedLegacy)),
  setSelectedLocations: (selectedLocations) => dispatch(setSelectedLocations(selectedLocations)),
  setCustomLocations: (customLocations) => dispatch(setCustomLocations(customLocations)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
