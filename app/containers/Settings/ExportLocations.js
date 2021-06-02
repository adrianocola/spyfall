import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { css } from 'emotion';
import { Button, Col, Input, Row } from 'reactstrap';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Localized from 'components/Localized/Localized';
import { database, databaseServerTimestamp } from 'services/firebase';
import roomIdGenerator from 'services/roomIdGenerator';
import { GoClippy } from 'react-icons/go';
import { useTranslation } from 'react-i18next';
import copyToClipboard from 'utils/copyToClipboard';
import { showError, showSuccess } from 'utils/toast';
import { ID_LENGTH } from 'consts';
import { useCustomLocations } from 'selectors/customLocations';
import { useSelectedLocations } from 'selectors/selectedLocations';
import { useUserId } from 'selectors/userId';

export const ExportLocations = () => {
  const [userId] = useUserId();
  const { customLocations, setCustomLocations } = useCustomLocations();
  const [selectedLocations, setSelectedLocations] = useSelectedLocations();
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importId, setImportId] = useState('');
  const exportId = useMemo(() => roomIdGenerator(), []);

  const [t] = useTranslation();

  const onExport = async () => {
    setLoading(true);
    try {
      await database.ref(`exports/${exportId}`).set({
        customLocations,
        selectedLocations,
        owner: userId,
        createdAt: databaseServerTimestamp,
      });
      setExported(true);
      showSuccess();
    } catch (err) {
      showError(null, err);
    }
    setLoading(false);
  };

  const onImport = async () => {
    if (!importId) return null;

    setLoading(true);
    try {
      const snapshot = await database.ref(`exports/${importId}`).once('value');
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCustomLocations(data.customLocations || {});
        setSelectedLocations(data.selectedLocations || {});
        showSuccess();
      } else {
        showError();
      }
    } catch (err) {
      showError(err);
    }
    setLoading(false);
  };

  const onCloseExported = () => {
    setExported(false);
  };

  const onCloseImporting = () => {
    setImporting(false);
  };

  if (exported) {
    return (
      <Row className={styles.exportContainer}>
        <Col xs={12} sm={6}>
          <Button outline color="secondary" block className={styles.exportId} onClick={() => copyToClipboard(exportId)}>
            {'ID: '}
            <span>{exportId}</span>
            {'   '}
            <GoClippy className={styles.copy} />
          </Button>
        </Col>
        <Col xs={12} sm={6} className={`${styles.exportHelp} text-secondary`}>
          <Localized name="interface.export_help" />
          <div className={styles.close} onClick={onCloseExported}>✘</div>
        </Col>
      </Row>
    );
  }

  if (importing) {
    return (
      <Row className={styles.exportContainer}>
        <Col xs={12} md={6}>
          <Row noGutters className="align-items-center justify-content-center text-center">
            <Col xs={10}>
              <Input type="text" placeholder={t('interface.export_id')} value={importId} maxLength={ID_LENGTH} onChange={(evt) => setImportId(_.toUpper(evt.target.value))} />
            </Col>
            <Col xs={2}>
              <span className={`${styles.close} text-secondary`} onClick={onCloseImporting}>✘</span>
            </Col>
          </Row>

        </Col>
        <Col xs={12} sm={6}>
          <ButtonWithLoading color="primary" block loading={loading} onClick={onImport}>
            <Localized name="interface.import" />
          </ButtonWithLoading>
        </Col>
      </Row>
    );
  }

  return (
    <Row className={styles.exportContainer}>
      <Col>
        <ButtonWithLoading color="primary" block loading={loading} onClick={onExport}>
          <Localized name="interface.export_locations" />
        </ButtonWithLoading>
      </Col>
      <Col>
        <Button color="primary" block onClick={() => setImporting(true)}>
          <Localized name="interface.import_locations" />
        </Button>
      </Col>
    </Row>
  );
};

const styles = {
  exportContainer: css({
    marginTop: 40,
    alignItems: 'center',
  }),
  exportId: css({
    letterSpacing: 2,
    fontWeight: 700,
    fontFamily: 'Inconsolata, Consolas, monaco, monospace',
    textTransform: 'uppercase',
    wordBreak: 'break-all',
  }),
  exportHelp: css({
    fontSize: '0.7rem',
    textAlign: 'center',
  }),
  copy: css({
    fontSize: '1rem',
    marginBottom: 5,
  }),
  close: css({
    display: 'inline-block',
    marginLeft: 10,
    cursor: 'pointer',
  }),
};

export default React.memo(ExportLocations);
