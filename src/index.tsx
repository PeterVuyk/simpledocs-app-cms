import React from 'react';
import ReactDOM from 'react-dom';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import App from './App';
import reportWebVitals from './reportWebVitals';

Bugsnag.start({
  apiKey: process.env.REACT_APP_BUGSNAG_API_KEY ?? '',
  plugins: [new BugsnagPluginReact()],
  metadata: { company: process.env.REACT_APP_PROJECT_ID ?? 'unknown-cms' },
});

// @ts-ignore
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);

reportWebVitals();
