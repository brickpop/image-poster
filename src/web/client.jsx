import React from 'react';
import { render as domRender } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { rehydrate } from './store/client';
import config from '../../config/client';

import App from './app';

// STYLES

import './styles/index.css';

// CONTENT

function initialRender() {
	const store = rehydrate(window.__INITIAL_STATE__);
	const rootNode = document.getElementById('root');

	const renderApp = AppComponent => {
		var app;
		if (config.DEBUG) {
			app = <AppContainer>
				<Provider store={store}>
					<BrowserRouter>
						<AppComponent />
					</BrowserRouter>
				</Provider>
			</AppContainer>
		}
		else {
			app = <Provider store={store}>
				<BrowserRouter>
					<AppComponent />
				</BrowserRouter>
			</Provider>
		}
		domRender(app, rootNode);
	};

	renderApp(App);

	// Hot Module Replacement API
	if (module.hot) {
		module.hot.accept('./app', () => {
			renderApp(App)
		});
	}

	// Dispatch *after* the server generated state has been consumed
	store.dispatch({ type: 'RESTORE' });
}


// INIT
initialRender();
