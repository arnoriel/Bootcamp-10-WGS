import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Import Provider
import store from './store'; // Import store
import App from './app';

ReactDOM.render(
  <Provider store={store}>  {/* Bungkus App dengan Provider */}
    <App />
  </Provider>,
  document.getElementById('root')
);
