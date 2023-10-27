import { store } from './store';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n'; // Initialize i18next instance
import './main.scss';

import App from './interface/App';

// React application entrypoint
const render = (Component: React.ComponentType) => {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                <Component />
                </I18nextProvider>
            </Provider>
        </React.StrictMode>,
        document.getElementById('app')
    )
}

render(App)
