import React from 'react';
import { withNamespaces } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';

const Localized = (props) => (
  <span>
    {ReactHtmlParser(props.t(props.name || props.children))}
  </span>
);

export default withNamespaces()(Localized);
