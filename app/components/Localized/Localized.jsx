import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'html-react-parser';

const Localized = (props) => {
  const [t] = useTranslation();
  return (
    <span {...props}>
      {ReactHtmlParser(t(props.name || props.children))}
    </span>
  );
};

export default React.memo(Localized);
