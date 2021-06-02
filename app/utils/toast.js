import { toast } from 'react-toastify';
import i18n from 'i18n';

export const showError = (msg, err) => {
  if (err) console.error(err); // eslint-disable-line no-console
  toast(i18n.t(msg ?? 'interface.error'), {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.ERROR,
    className: 'bg-danger',
  });
};

export const showSuccess = (msg) => {
  toast(msg ?? i18n.t('interface.done'), {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.SUCCESS,
    className: 'bg-success',
  });
};
