import {observable, action, computed} from 'mobx';
import { persist } from 'mobx-persist';

import { Document } from 'firestorter';

class GameStore {
  @observable room = null;
  @observable state = 'new';
  @observable playersRoles = {};
  @observable location = '';
  @observable previousLocation = '';

  @persist('list') @observable players = ['P1', 'P2', 'P3'];
  @persist @observable time = 480;
  @persist @observable spies = 1;

  @computed get playersCount() {
    return this.players.length;
  }

  @computed get started() {
    return this.state === 'started';
  }

  @action setRoom = (roomId) => {
    this.room = new Document(`rooms/${roomId}`);
  };

  @action setState = (state) => {
    this.state = state;
  };

  @action setPlayersRoles = (playersRoles) => {
    this.playersRoles = playersRoles;
  };

  @action setLocation = (location) => {
    this.location = location;
  };

  @action addPlayer = () => {
    this.players.push(`P${this.playersCount + 1}`);
  };

  @action removePlayer = () => {
    this.players.splice(-1);
  };

  @action updatePlayerName = (playerIndex, playerName) => {
    this.players[playerIndex] = playerName;
  };

  @action setTime = (time) => {
    this.time = time;
  };

  @action setSpies = (spies) => {
    this.spies = spies;
  };
}

export default new GameStore();
