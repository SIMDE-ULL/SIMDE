import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import App from './interface/App.tsx';
import { store } from './store.ts';
import i18n from './i18n.ts'; // Initialize i18next instance
import './main.scss';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
            <App />
            </I18nextProvider>
        </Provider>
    </React.StrictMode>,
);
