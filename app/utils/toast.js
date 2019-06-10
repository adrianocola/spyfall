import { toast } from 'react-toastify';
import { css } from 'emotion';
import i18n from 'i18n';
import {COLORS} from 'styles/consts';

export const showError = (msg, err) => {
  if(err) console.error(err); // eslint-disable-line no-console
  toast(i18n.t(msg || 'interface.error'), {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.ERROR,
    className: styles.error,
  });
};

export const showSuccess = () => {
  toast(i18n.t('interface.done'), {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.SUCCESS,
    className: styles.success,
  });
};

const styles = {
  error: css({
    backgroundColor: COLORS.red,
  }),
  success: css({
    backgroundColor: COLORS.green,
  }),
};
