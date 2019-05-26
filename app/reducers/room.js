import roomIdGenerator from 'services/roomIdGenerator';

const initialState = {
  id: roomIdGenerator(),
};

export default (state = initialState) => state;
