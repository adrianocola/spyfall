import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

export const useDispatcher = (fn) => {
  const dispatch = useDispatch();
  const dispatcher = useCallback((...newValues) => {
    dispatch(fn(...newValues));
  }, [dispatch, fn]);
  return dispatcher;
};
