import React, { useState } from 'react';
import { css } from 'emotion';
import { Col, Row } from 'reactstrap';
import ButtonWithLoading from 'components/ButtonWithLoading/ButtonWithLoading';
import Localized from 'components/Localized/Localized';
import { useDropzone } from 'react-dropzone';
import { showError, showSuccess } from 'utils/toast';
import { useCustomLocations } from 'selectors/customLocations';
import { useSelectedLocations } from 'selectors/selectedLocations';

export const ExportLocations = () => {
  const { customLocations, setCustomLocations } = useCustomLocations();
  const [selectedLocations, setSelectedLocations] = useSelectedLocations();
  const [loading, setLoading] = useState(false);

  const onDownload = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line camelcase
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ custom_locations: customLocations || {}, selected_locations: selectedLocations || {} }, null, 2))}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'spyfall.json');
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showSuccess();
    } catch (err) {
      showError(null, err);
    }
    setLoading(false);
  };

  const onDrop = async (files) => {
    try {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = JSON.parse(evt.target.result);
        setCustomLocations(data.custom_locations || {});
        setSelectedLocations(data.selected_locations || {});
        showSuccess();
      };
      reader.readAsText(files[0]);
    } catch (err) {
      showError(null, err);
    }
    setLoading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false, accept: ['text/json', 'application/json'] });

  return (
    <Row className={styles.exportContainer}>
      <Col>
        <ButtonWithLoading color="primary" outline block loading={loading} onClick={onDownload}>
          <Localized name="interface.download_locations" />
        </ButtonWithLoading>
      </Col>
      <Col>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <ButtonWithLoading color="primary" outline block loading={loading}>
            <Localized name="interface.upload_locations" />
          </ButtonWithLoading>
        </div>
      </Col>
    </Row>
  );
};

const styles = {
  exportContainer: css({
    marginTop: 40,
    alignItems: 'center',
  }),
};

export default React.memo(ExportLocations);
