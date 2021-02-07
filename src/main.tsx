import React from 'react';
import ReactDOM from 'react-dom';

import MainApp from './components/MainApp';

function onLoad() {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(<MainApp />, root);
  }
}

addEventListener('load', onLoad);
