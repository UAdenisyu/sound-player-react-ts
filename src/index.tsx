import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Player from './components/player/player';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Player />
  </React.StrictMode>
);
