import { useSelectorAndDispatcher } from 'hooks/useSelectorAndDispatcher';
import { setUserIdAction } from 'actions/root';

export const userIdSelector = (state) => state.root.userId;

export const useUserId = () =>
  useSelectorAndDispatcher(userIdSelector, setUserIdAction);
