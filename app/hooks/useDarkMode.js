import useDarkModeLib from 'use-dark-mode';

const DARK_MODE_CONFIG = {
  classNameDark: 'bootstrap-dark',
  classNameLight: 'bootstrap',
};

const useDarkMode = () => useDarkModeLib(undefined, DARK_MODE_CONFIG);

export default useDarkMode;
