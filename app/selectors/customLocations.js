import { useSelector } from 'react-redux';
import { useDispatcher } from 'hooks/useDispatcher';
import { store } from 'store';
import {
  createCustomLocationAction,
  remCustomLocationAction,
  saveCustomLocationAction,
  setCustomLocationsAction,
} from 'actions/config';

export const customLocationsSelector = (state) => state.config.customLocations;

export const getCustomLocations = () => customLocationsSelector(store.getState());

export const useCustomLocations = () => {
  const customLocations = useSelector(customLocationsSelector);
  const createCustomLocation = useDispatcher(createCustomLocationAction);
  const setCustomLocations = useDispatcher(setCustomLocationsAction);
  const saveCustomLocation = useDispatcher(saveCustomLocationAction);
  const remCustomLocation = useDispatcher(remCustomLocationAction);
  return { customLocations, createCustomLocation, setCustomLocations, saveCustomLocation, remCustomLocation };
};
