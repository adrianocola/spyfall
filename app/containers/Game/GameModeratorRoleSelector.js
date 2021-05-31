import React from 'react';
import { Input } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { RANDOM, SPY_ROLE } from 'consts';
import { useModeratorRolesList } from 'selectors/moderatorRolesList';
import { logEvent } from 'utils/analytics';

export const GameModeratorRoleSelector = ({ moderatorRole, onModeratorRoleChange }) => {
  const [t] = useTranslation();

  const moderatorRolesList = useModeratorRolesList();

  const onSetPlayerModeratorRole = (evt) => {
    const newModeratorRole = evt.target.value;
    logEvent('GAME_SET_MODERATOR_ROLE', newModeratorRole);
    onModeratorRoleChange(newModeratorRole);
  };

  return (
    <Input type="select" name="select" id="timer" value={moderatorRole} onChange={onSetPlayerModeratorRole}>
      <option value={RANDOM}>🎲</option>
      <option value={SPY_ROLE}>{t('interface.spy')}</option>
      {moderatorRolesList.map((roleItem) => (
        <option key={roleItem.index} value={roleItem.index}>{roleItem.index} - {roleItem.role}</option>
      ))}
    </Input>
  );
};

export default React.memo(GameModeratorRoleSelector);
