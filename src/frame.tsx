import React from 'react';
import ReactDOM from 'react-dom';

import FrameApp from './components/FrameApp';

function onLoad() {
  const root = document.getElementById('root');
  if (root) {
    const frameNumber = root.dataset.frameNumber;
    ReactDOM.render(<FrameApp frameNumber={frameNumber} />, root);
  }
}

addEventListener('load', onLoad);
