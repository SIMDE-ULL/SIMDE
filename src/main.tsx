import { store } from './store';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n'; // initialized i18next instance
import './main.scss';

import App from './interface/App';

/*
 * Here is where the react endpoint appears
 *
 */
ReactDOM.render(
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
        <App />
        </I18nextProvider>
    </Provider>,
    document.getElementById('app')
);
