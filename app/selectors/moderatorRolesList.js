import _ from 'lodash';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { MAX_ROLES } from 'consts';
import i18n from 'i18n';
import { customLocationsSelector } from './customLocations';
import { configModeratorLocationSelector } from './configModeratorLocation';
import { languageSelector } from './language';

export const moderatorRolesListSelector = createSelector(
  [configModeratorLocationSelector, customLocationsSelector, languageSelector],
  (moderatorLocation, customLocations, language) => {
    const fixedT = i18n.getFixedT(language);
    const customLocation = customLocations?.[moderatorLocation];
    if (customLocation?.allSpies) return [];

    const list = [];
    _.times(MAX_ROLES, (roleIndex) => {
      const defaultRoleKey = `location.${moderatorLocation}.role${roleIndex}`;
      const roleValue = customLocation ? customLocation[`role${roleIndex}`] : fixedT(defaultRoleKey);
      if (roleValue && roleValue !== defaultRoleKey) {
        list.push({
          index: roleIndex,
          role: roleValue,
        });
      }
    });
    return list;
  },
);

export const useModeratorRolesList = () =>
  useSelector(moderatorRolesListSelector);
