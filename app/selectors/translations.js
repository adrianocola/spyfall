import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setTranslationsAction } from 'actions/root';

export const translationsSelector = (state) => state.root.translations;

export const useTranslations = () =>
  useSelectorAndDispatcher(translationsSelector, setTranslationsAction);
