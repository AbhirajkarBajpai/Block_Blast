import React, { useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';

const TetrominoControls = () => {
  const { moveTetromino, rotateTetrominoHandler, dropTetromino, gameOver } = useContext(GameContext);

  const handleKeyDown = (e) => {
    if (gameOver) return;

    switch (e.keyCode) {
      case 37: // left arrow
        moveTetromino('left');
        break;
      case 39: // right arrow
        moveTetromino('right');
        break;
      case 38: // up arrow
        rotateTetrominoHandler();
        break;
      case 40: // down arrow
        dropTetromino();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
};

export default TetrominoControls;
