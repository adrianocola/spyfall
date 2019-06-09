import { toast } from 'react-toastify';
import i18n from 'i18n';

export const showError = (err) => {
  if(err) console.error(err); // eslint-disable-line no-console
  toast(i18n.t('interface.error'), {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.ERROR,
  });
};

export const showSuccess = () => {
  toast(i18n.t('interface.done'), {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.SUCCESS,
  });
};
