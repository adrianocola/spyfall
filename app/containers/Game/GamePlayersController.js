import _ from 'lodash';
import React, { useMemo } from 'react';
import { css } from 'emotion';
import { Button, Col, Row } from 'reactstrap';
import Localized from 'components/Localized/Localized';
import { MAX_PLAYERS } from 'consts';
import { logEvent } from 'utils/analytics';
import { useConfigPlayersCount } from 'selectors/configPlayersCount';
import { useConfigPlayers } from 'selectors/configPlayers';

export const GamePlayersController = ({ remotePlayers }) => {
  const playersCount = useConfigPlayersCount();
  const { addPlayer, remPlayer } = useConfigPlayers();
  const totalNumberOfPlayers = useMemo(() => playersCount + _.size(remotePlayers), [playersCount, remotePlayers]);
  const canAddPlayers = useMemo(() => totalNumberOfPlayers < MAX_PLAYERS, [totalNumberOfPlayers]);
  const canRemovePlayers = useMemo(() => totalNumberOfPlayers > 0 && playersCount > 0, [playersCount, totalNumberOfPlayers]);

  const onAddPlayer = () => {
    logEvent('GAME_PLAYER_ADD');
    addPlayer();
  };

  const onRemPlayer = () => {
    logEvent('GAME_PLAYER_REM');
    remPlayer();
  };

  return (
    <Row className={styles.container}>
      <Col>
        <Button color={canAddPlayers ? 'primary' : 'secondary'} block onClick={onAddPlayer} disabled={!canAddPlayers} outline={!canAddPlayers}>
          <Localized name="interface.add_player" />
        </Button>
      </Col>
      <Col>
        <Button color={canRemovePlayers ? 'danger' : 'secondary'} block onClick={onRemPlayer} disabled={!canRemovePlayers} outline={!canRemovePlayers}>
          <Localized name="interface.rem_player" />
        </Button>
      </Col>
    </Row>
  );
};

const styles = {
  container: css({
    marginTop: 20,
  }),
};

export default React.memo(GamePlayersController);
