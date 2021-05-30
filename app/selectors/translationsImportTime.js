import { useSelector } from 'react-redux';

export const translationsImportTimeSelector = (state) => state.root.translationsImportTime;

export const useTranslationsImportTime = () =>
  useSelector(translationsImportTimeSelector);
