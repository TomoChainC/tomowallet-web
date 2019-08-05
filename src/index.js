/**
 *
 * TomoWallet - Root Component
 *
 * This component is where we provide our web app as DOM elements into "root" section in index.html.
 * We also setups Redux store & pre-initiation configurations here
 */
// ===== IMPORTS =====
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Custom Component
import App from './containers/App';
// Utilities & Constants
import configureStore from './configurations/configureStore';
import { history } from './utils';
import { addLocaleData } from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
// ===================

// ===== PRE-INITIATION CONFIGURATION =====
library.add(fas, far);
addLocaleData([...locale_en, ...locale_fr]);
// ========================================

ReactDOM.render(
  <Provider store={configureStore({}, history)}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
