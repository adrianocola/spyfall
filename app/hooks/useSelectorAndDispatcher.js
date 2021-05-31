import { useSelector } from 'react-redux';
import { useDispatcher } from './useDispatcher';

export const useSelectorAndDispatcher = (selector, fn) => {
  const value = useSelector(selector);
  const dispatcher = useDispatcher(fn);
  return [value, dispatcher];
};
