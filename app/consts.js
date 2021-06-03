/* eslint-disable camelcase */
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;
export const MAX_ROLES = MAX_PLAYERS - 2;
export const MAX_ROLES_ARRAY = new Array(MAX_ROLES).fill('');
export const SPY_ROLE = 'spy';
export const SPY_LOCATION = '?????';
export const RANDOM = '__random__';
export const ID_LENGTH = 5;

export const GAME_STATES = {
  STARTED: 'STARTED',
  STOPPED: 'STOPPED',
};

export const LIGHT = '#DDDDDD';
export const DARK = '#333333';

export const DEFAULT_LOCATIONS = {
  // spyfall 1
  airplane: 1,
  bank: 1,
  beach: 1,
  broadway_theater: 1,
  casino: 1,
  cathedral: 1,
  circus_tent: 1,
  corporate_party: 1,
  crusader_army: 1,
  day_spa: 1,
  embassy: 1,
  hospital: 1,
  hotel: 1,
  military_base: 1,
  movie_studio: 1,
  ocean_liner: 1,
  passenger_train: 1,
  pirate_ship: 1,
  polar_station: 1,
  police_station: 1,
  restaurant: 1,
  school: 1,
  service_station: 1,
  space_station: 1,
  submarine: 1,
  supermarket: 1,
  university: 1,
  // spyfall 2
  amusement_park: 2,
  art_museum: 2,
  candy_factory: 2,
  cat_show: 2,
  cemetery: 2,
  coal_mine: 2,
  construction_site: 2,
  gaming_convention: 2,
  gas_station: 2,
  harbor_docks: 2,
  ice_hockey_stadium: 2,
  jail: 2,
  jazz_club: 2,
  library: 2,
  night_club: 2,
  race_track: 2,
  retirement_home: 2,
  rock_concert: 2,
  sightseeing_bus: 2,
  stadium: 2,
  subway: 2,
  the_un: 2,
  vineyard: 2,
  wedding: 2,
  zoo: 2,
};

export const TRANSLATIONS = require('./translations'); // eslint-disable-line global-require

export const DEFAULT_LOCATIONS_LENGTH = Object.keys(DEFAULT_LOCATIONS).length;
