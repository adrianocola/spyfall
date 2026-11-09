import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { useTranslation } from 'react-i18next';
import { database } from '@services/firebase';
import { logEvent } from '@utils/analytics';

const GALERA_URL =
  'https://galeragames.com/?utm_source=spyfall&utm_medium=banner&utm_campaign=cross_promo';

// White "PlayCircle" dots (center disc ringed by 8) at 45deg steps: the GaleraGames mark.
const RING = [
  [50, 17], [73.3, 26.7], [83, 50], [73.3, 73.3],
  [50, 83], [26.7, 73.3], [17, 50], [26.7, 26.7],
];

const LogoMark = ({ size, radius, dots }) => (
  <span className={styles.mark} style={{ width: size, height: size, borderRadius: radius }}>
    <svg width={dots} height={dots} viewBox="0 0 100 100" fill="#fff" aria-hidden="true">
      <circle cx="50" cy="50" r="15" />
      {RING.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8.5" />)}
    </svg>
  </span>
);

const onClick = () => logEvent('GALERA_BANNER_CLICK');

export const GaleraBanner = ({ className }) => {
  const [t] = useTranslation();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Remote kill-switch: show only when `config/galeraBanner` is true in the RTDB.
    const ref = database.ref('config/galeraBanner');
    ref.on('value', (snapshot) => setEnabled(snapshot.val() === true));

    return () => ref.off();
  }, []);

  if (!enabled) return null;

  return (
    <a
      className={`${styles.strip} ${className || ''}`}
      href={GALERA_URL}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
    >
      <LogoMark size={34} radius={11} dots={23} />
      <span className={styles.content}>
        <span className={styles.word}>GaleraGames</span>
        <span className={styles.tagline}>{t('interface.galeragames_tagline')}</span>
      </span>
      <span className={styles.cta}>
        {t('interface.galeragames_cta')} <span className={styles.arrow}>&rarr;</span>
      </span>
    </a>
  );
};

const PRIMARY = '#5b5bd6';
const PRIMARY_DARK = '#8a8af0';

const styles = {
  strip: css({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    padding: '7px 14px',
    borderRadius: 12,
    // !important: the app's dark theme underlines & recolors <a> on hover; keep it a card, not a link.
    textDecoration: 'none !important',
    color: 'inherit',
    fontFamily: "'Fredoka', 'Open Sans', system-ui, sans-serif",
    background: `linear-gradient(90deg, color-mix(in srgb, ${PRIMARY} 16%, transparent), color-mix(in srgb, #A66BFF 10%, transparent))`,
    border: `1px solid color-mix(in srgb, ${PRIMARY} 35%, transparent)`,
    transition: 'filter .15s ease, box-shadow .15s ease',
    '&:hover, &:focus': {
      color: 'inherit',
      filter: 'brightness(1.04)',
      boxShadow: `0 4px 14px color-mix(in srgb, ${PRIMARY} 22%, transparent)`,
    },
  }),
  mark: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: PRIMARY,
    flex: '0 0 auto',
    boxShadow: `0 4px 12px color-mix(in srgb, ${PRIMARY} 40%, transparent)`,
  }),
  content: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
    minWidth: 0,
  }),
  word: css({
    fontWeight: 700,
    fontSize: 14.5,
    whiteSpace: 'nowrap',
    color: PRIMARY,
    '.bootstrap-dark &': { color: PRIMARY_DARK },
  }),
  cta: css({
    flex: '0 0 auto',
    fontWeight: 700,
    fontSize: 12.5,
    whiteSpace: 'nowrap',
    color: PRIMARY,
    '.bootstrap-dark &': { color: PRIMARY_DARK },
  }),
  tagline: css({
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 12.5,
    color: '#6a6a75',
    '.bootstrap-dark &': { color: '#a7a7b0' },
  }),
  arrow: css({ fontSize: '1.05em' }),
};

export default React.memo(GaleraBanner);
