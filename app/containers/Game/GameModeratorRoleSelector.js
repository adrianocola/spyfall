import _ from 'lodash';
import React, { useMemo } from 'react';
import { Input } from 'reactstrap';
import { useCustomLocations } from 'selectors/customLocations';
import { useConfigModeratorLocation } from 'selectors/configModeratorLocation';
import { useTranslation } from 'react-i18next';
import { MAX_ROLES, RANDOM, SPY_ROLE } from 'consts';

export const GameModeratorRoleSelector = ({ moderatorRole, onModeratorRoleChange }) => {
  const [t] = useTranslation();
  const { customLocations } = useCustomLocations();
  const [moderatorLocation] = useConfigModeratorLocation();

  const moderatorRolesList = useMemo(() => {
    const customLocation = customLocations?.[moderatorLocation];
    if (customLocation?.allSpies) return [];

    const list = [];
    _.times(MAX_ROLES, (roleIndex) => {
      const defaultRoleKey = `location.${moderatorLocation}.role${roleIndex}`;
      const roleValue = customLocation ? customLocation[`role${roleIndex}`] : t(defaultRoleKey);
      if (roleValue && roleValue !== defaultRoleKey) {
        list.push({
          index: roleIndex,
          role: roleValue,
        });
      }
    });
    return list;
  }, [moderatorLocation, customLocations, t]);

  const onSetPlayerModeratorRole = (evt) => {
    onModeratorRoleChange(evt.target.value);
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
