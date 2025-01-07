import React from 'react';
import { GameProvider } from './context/GameContext';
import GameCanvas from './components/GameCanvas';
import TetrominoControls from './components/Tetromino';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <GameCanvas />
        <TetrominoControls />
      </div>
    </GameProvider>
  );
}

export default App;
