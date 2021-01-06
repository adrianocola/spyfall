import React from 'react';
import {Helmet} from 'react-helmet';
import {connect} from 'react-redux';
import {Link, Route, Switch} from 'react-router-dom';
import {css} from 'emotion';
import i18n, { i18nInit } from 'i18n';
import {MEDIA, SHADES} from 'styles/consts';
import {ToastContainer} from 'react-toastify';
import Loadable from 'react-loadable';
import {Col, Container, Input, Row} from 'reactstrap';
import {auth, database} from 'services/firebase';
import {setLanguageAction, setTranslations, setUserIdAction} from 'actions/root';
import {setCustomLocations, setSelectedLocations} from 'actions/config';
import {TRANSLATIONS} from 'consts';
import Discord from 'images/discord.png';

import SpinnerModal from 'components/SpinnerModal/SpinnerModal';
import SpyIcon from 'components/SpyIcon/SpyIcon';

const LoadableSettings = Loadable({loader: () => import('../Settings/Settings'), loading: SpinnerModal});
const LoadableGame = Loadable({loader: () => import('../Game/Game'), loading: SpinnerModal});
const LoadableJoinRoom = Loadable({loader: () => import('../JoinRoom/JoinRoom'), loading: SpinnerModal});

export class App extends React.Component{
  state = { loading: true };

  componentDidMount() {
    const { setUserId } = this.props;
    i18nInit.then(() => {
      if (!this.props.language) {
        this.setLanguage(i18n.language);
      }
      this.setState({ loading: false });
    });
    auth.signInAnonymously().then((authUser) => {
      setUserId(authUser.user.uid);
      this.importTranslations();
    });
  }

  importTranslations = async () => {
    // imported less than 24 hours ago
    if(this.props.translationsImportTime && Date.now() - this.props.translationsImportTime < 24 * 60 * 60 * 1000) return null;

    const translationsSnapshot = await database.ref('translations').once('value');
    this.props.setTranslations(translationsSnapshot.val() || {});
  };

  setLanguage = (language) => {
    const { setLanguage } = this.props;
    i18n.changeLanguage(language);
    setLanguage(language);
  };

  render() {
    const { language, translations = {} } = this.props;

    if (this.state.loading) return null;

    return (
      <Container className={styles.container}>
        <Helmet
          defaultTitle="Spyfall"
        >
          <meta name="description" content="Free online spyfall game" />
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
                  {TRANSLATIONS.map((translation) =>
                    <option key={translation.id} value={translation.id}>{translation.name} - {translations[translation.id] || 0}%</option>
                  )}
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
            <Row className={styles.localizationContainer}>
              <Col className="text-center">
                <a title="Discord Server" target="_blank" href="https://discord.io/spyfall">
                  <img alt="discord server" src={Discord} className={styles.discordImage} />
                  <span className={styles.discordLink}>Join Spyfall Discord server</span>
                </a>
              </Col>
            </Row>
            <Row className={styles.footer}>
              <Col className="text-center">
                <Row>
                  <Col>
                    <a target="_blank" href="https://hwint.ru/portfolio-item/spyfall/">Spyfall</a> is designed by Alexandr Ushan and published by <a target="_blank" href="http://international.hobbyworld.ru/">Hobby World</a>
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
  discordImage: css({
    height: 32,
  }),
  discordLink: css({
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
  translations: state.root.translations,
  translationsImportTime: state.root.translationsImportTime,
});

const mapDispatchToProps = (dispatch) => ({
  setUserId: (userId) => dispatch(setUserIdAction(userId)),
  setLanguage: (language) => dispatch(setLanguageAction(language)),
  setSelectedLocations: (selectedLocations) => dispatch(setSelectedLocations(selectedLocations)),
  setCustomLocations: (customLocations) => dispatch(setCustomLocations(customLocations)),
  setTranslations: (translations) => dispatch(setTranslations(translations)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
