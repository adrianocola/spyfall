import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import roomIdGenerator from 'services/roomIdGenerator';
import i18n from 'i18n';

class RootStore {
  @persist @observable language = 'en-US';
  @persist @observable roomId = roomIdGenerator();
  @persist @observable joinRoomId = '';
  @persist @observable joinRoomPlayer = '';
  @observable userUID = '';

  @action setLanguage = (language) => {
    i18n.changeLanguage(language);
    this.language = language;
  };

  @action setUserUID = (userUID) => {
    this.userUID = userUID;
  };

  @action setJoinRoomId = (joinRoomId) => {
    this.joinRoomId = joinRoomId.toUpperCase();
  };

  @action setJoinRoomPlayer = (joinRoomPlayer) => {
    this.joinRoomPlayer = joinRoomPlayer;
  };
}

export default new RootStore();
