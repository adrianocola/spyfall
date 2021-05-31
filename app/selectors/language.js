import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setLanguageAction } from 'actions/root';

export const languageSelector = (state) => state.root.language;

export const useLanguage = () =>
  useSelectorAndDispatcher(languageSelector, setLanguageAction);
