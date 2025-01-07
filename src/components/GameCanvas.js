import React, { useContext, useEffect, useRef } from "react";
import { GameContext } from "../context/GameContext";

const GameCanvas = () => {
  const { playfield, tetromino, gameOver, score,  colors  } = useContext(GameContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const grid = 30;

    context.clearRect(0, 0, canvas.width, canvas.height);

    playfield.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell) {
          context.fillStyle = colors[cell];
          context.fillRect(cIndex * grid, rIndex * grid, grid - 1, grid - 1);
        }
      });
    });

    tetromino.matrix.forEach((row, rIndex) => {
      row.forEach((value, cIndex) => {
        if (value) {
          context.fillStyle = colors[tetromino.name];
          context.fillRect(
            (tetromino.col + cIndex) * grid,
            (tetromino.row + rIndex) * grid,
            grid - 1,
            grid - 1
          );
        }
      });
    });
  }, [playfield, tetromino]);

  return (
    <>
    <canvas
      ref={canvasRef}
      width={300}
      height={600}
      style={{ border: "1px solid white" }}
    />
    <div className="score">Score: {score}</div>
  // Inside GameCanvas or another component to handle game over state
  {
    gameOver && <div className="GameOver show">GAME OVER!</div>
  }
  </>
);
};

export default GameCanvas;
