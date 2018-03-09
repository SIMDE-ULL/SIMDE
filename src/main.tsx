import { store } from './store';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import i18n from './i18n'; // initialized i18next instance
import { I18nextProvider } from 'react-i18next'; // as we build ourself via webpack

import App from './interface/App';

const styles = require('./main.scss');

/*
 * Here is where the react endpoint appears
 *
 */
ReactDOM.render(
      <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                  <App />
            </Provider>
      </I18nextProvider>,
      document.getElementById('app')
);
