import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Route, Switch } from 'react-router-dom';
import { css } from 'emotion';
import i18n, { i18nInit } from 'i18n';
import { MEDIA, SHADES } from 'styles/consts';
import { ToastContainer } from 'react-toastify';
import Loadable from 'react-loadable';
import { Col, Container, Input, Row } from 'reactstrap';
import { auth, database } from 'services/firebase';
import { TRANSLATIONS } from 'consts';
import Discord from 'images/discord.png';
import { useLanguage } from 'selectors/language';
import { useTranslations } from 'selectors/translations';
import { useUserId } from 'selectors/userId';
import { useTranslationsImportTime } from 'selectors/translationsImportTime';

import SpinnerModal from 'components/SpinnerModal/SpinnerModal';
import SpyIcon from 'components/SpyIcon/SpyIcon';

const LoadableSettings = Loadable({ loader: () => import('../Settings/Settings'), loading: SpinnerModal });
const LoadableGame = Loadable({ loader: () => import('../Game/Game'), loading: SpinnerModal });
const LoadableJoinRoom = Loadable({ loader: () => import('../JoinRoom/JoinRoom'), loading: SpinnerModal });

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [, setUserId] = useUserId();
  const [language, setLanguage] = useLanguage();
  const [translations, setTranslations] = useTranslations();
  const translationsImportTime = useTranslationsImportTime();

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const importTranslations = async () => {
    // imported less than 24 hours ago
    if (translationsImportTime && Date.now() - translationsImportTime < 24 * 60 * 60 * 1000) return null;

    const translationsSnapshot = await database.ref('translations').once('value');
    setTranslations(translationsSnapshot.val() || {});
  };

  useEffect(() => {
    i18nInit.then(() => {
      if (!language) {
        changeLanguage(i18n.language);
      }
      setLoading(false);
    });
    auth.signInAnonymously().then((authUser) => {
      setUserId(authUser.user.uid);
      importTranslations();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return null;

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
              <Input type="select" name="languages" id="languages" value={language} onChange={(evt) => changeLanguage(evt.target.value)}>
                {TRANSLATIONS.map((translation) =>
                  <option key={translation.id} value={translation.id}>{translation.name} - {translations[translation.id] || 0}%</option>
                )}
              </Input>
            </Col>
          </Row>
          <Switch>
            <Route exact path="/settings" component={LoadableSettings} />
            <Route exact path="/join" component={LoadableJoinRoom} />
            <Route exact path="/join/:roomId" component={LoadableJoinRoom} />
            <Route exact path="/" component={LoadableGame} />
          </Switch>
          <Row className={styles.localizationContainer}>
            <Col className="text-center">
              <a title="Crowdin" target="_blank" href="https://crowdin.com/project/adrianocola-spyfall" rel="noreferrer">
                <img alt="localization status" src="https://d322cqt584bo4o.cloudfront.net/adrianocola-spyfall/localized.svg" />
              </a>
              <a className={styles.localizationLink} target="_blank" href="https://crowdin.com/project/adrianocola-spyfall" rel="noreferrer">Help us with translations!</a>
            </Col>
          </Row>
          <Row className={styles.localizationContainer}>
            <Col className="text-center">
              <a title="Discord Server" target="_blank" href="https://discord.io/spyfall" rel="noreferrer">
                <img alt="discord server" src={Discord} className={styles.discordImage} />
                <span className={styles.discordLink}>Join Spyfall Discord server</span>
              </a>
            </Col>
          </Row>
          <Row className={styles.footer}>
            <Col className="text-center">
              <Row>
                <Col>
                  <a target="_blank" href="https://hwint.ru/portfolio-item/spyfall/" rel="noreferrer">Spyfall</a> is designed by Alexandr Ushan and published by <a target="_blank" href="http://international.hobbyworld.ru/" rel="noreferrer">Hobby World</a>
                </Col>
              </Row>
              <Row>
                <Col>
                  Spy icon created by Dan Hetteix (<a target="_blank" href="http://thenounproject.com/" rel="noreferrer">TheNounProject</a>)
                </Col>
              </Row>
              <Row>
                <Col>
                  <a target="_blank" href="https://github.com/adrianocola/spyfall" rel="noreferrer">https://github.com/adrianocola/spyfall</a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

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

export default App;
