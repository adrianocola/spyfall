import { useDarkMode as useDarkModeLib } from 'usehooks-ts'

const useDarkMode = () => useDarkModeLib({ localStorageKey: 'darkMode' });

export default useDarkMode;
