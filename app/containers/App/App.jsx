import {lazy, Suspense, useEffect, useMemo, useState} from 'react';
import {Helmet} from 'react-helmet';
import {Link, Route, Switch} from 'react-router-dom';
import {css} from 'emotion';
import i18n, {i18nInit} from '@app/i18n';
import {ToastContainer} from 'react-toastify';
import {DarkModeSwitch} from 'react-toggle-dark-mode';
import {Col, Container, Input, Row} from 'reactstrap';
import {auth, database} from '@services/firebase';
import {DARK, LIGHT} from '@app/consts';
import Discord from '@images/discord.png';
import {useLanguage} from '@selectors/language';
import {useTranslations} from '@selectors/translations';
import {useUserId} from '@selectors/userId';
import {useTranslationsImportTime} from '@selectors/translationsImportTime';
import useDarkMode from '@hooks/useDarkMode';
import {logEvent} from '@utils/analytics';

import SpinnerModal from '@components/SpinnerModal/SpinnerModal';
import SpyIcon from '@components/SpyIcon/SpyIcon';
import {AdBanner} from '@components/AdBanner/AdBanner';

const LoadableSettings = lazy(() => import('@containers/Settings/Settings'));
const LoadableGame = lazy(() => import('@containers/Game/Game'));
const LoadableJoinRoom = lazy(() => import('@containers/JoinRoom/JoinRoom'));

const capitalize = (s, locale) =>
  s.replace(/^./u, c => c.toLocaleUpperCase(locale));

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [, setUserId] = useUserId();
  const [language, setLanguage] = useLanguage();
  const [translations, setTranslations] = useTranslations();
  const translationsImportTime = useTranslationsImportTime();
  const darkMode = useDarkMode();

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const importTranslations = async () => {
    // imported less than 6 hours ago
    if (translationsImportTime && Date.now() - translationsImportTime < 6 * 60 * 60 * 1000) return null;

    const translationsSnapshot = await database.ref('translations').once('value');
    setTranslations(translationsSnapshot.val() || {});
  };

  const translationLanguagesCount = useMemo(() => {
    return Object.keys(translations).reduce((acc, lang) => {
      const [id] = lang.split('-');
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  }, [translations]);

  const getLanguageName = (langId) => {
    const [id] = langId.split('-');
    const finalId = translationLanguagesCount[id] === 1 ? id : langId;
    try {
      const formatter = new Intl.DisplayNames([id], { type: 'language' });
      return capitalize(formatter.of(finalId));
    } catch (e) {
      return finalId;
    }
  }

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

  useEffect(() => {
    logEvent('THEME', darkMode.isDarkMode ? 'dark' : 'light');
    if (darkMode.isDarkMode) {
      document.body.classList.add('bootstrap-dark');
    } else {
      document.body.classList.remove('bootstrap-dark');
    }
  }, [darkMode.isDarkMode]);

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
            <Col xs="8" sm="3" className={`${styles.topItems} text-left`}>
              <Link to="/">
                <SpyIcon />
                Spyfall
              </Link>
            </Col>
            <Col xs="4" sm="2" className={`${styles.topItems} text-right`}>
              <DarkModeSwitch
                onChange={darkMode.toggle}
                checked={darkMode.isDarkMode}
                sunColor={DARK}
                moonColor={LIGHT}
                size={24}
              />
            </Col>
            <Col xs="12" sm="7" className={`${styles.topItems} text-center`}>
              <Input type="select" name="languages" id="languages" value={language} onChange={(evt) => changeLanguage(evt.target.value)}>
                {Object.entries(translations).map(([id, progress]) =>
                  <option key={id} value={id}>{getLanguageName(id)} ({progress || 0}%)</option>
                )}
              </Input>
            </Col>
          </Row>
          <AdBanner />
          <Suspense fallback={<SpinnerModal />}>
            <Switch>
              <Route exact path="/settings" component={LoadableSettings} />
              <Route exact path="/join" component={LoadableJoinRoom} />
              <Route exact path="/join/:roomId" component={LoadableJoinRoom} />
              <Route exact path="/" component={LoadableGame} />
            </Switch>
          </Suspense>
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
          <Row className={`${styles.footer} text-secondary`}>
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
  topItems: css({
    marginTop: 10,
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
  }),
};

export default App;
