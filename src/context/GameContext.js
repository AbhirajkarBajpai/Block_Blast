import React, { createContext, useState, useEffect } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {

  
  const tetrominos = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  };

  const colors = {
    I: "cyan",
    O: "yellow",
    T: "purple",
    S: "green",
    Z: "red",
    J: "blue",
    L: "orange",
  };


  const getNextTetromino = (playfield) => {
    const sequence = Object.keys(tetrominos);
    const name = sequence[Math.floor(Math.random() * sequence.length)];
    const matrix = tetrominos[name];
    const col = Math.floor((playfield[0].length - matrix[0].length) / 2);
    const row = name === "I" ? -1 : -2;

    return { name, matrix, row, col };
  };

  const initializePlayfield = () => {
    const playfield = [];
    for (let row = -2; row < 20; row++) {
      playfield[row] = new Array(10).fill(0);
    }
    return playfield;
  };
  
  const [playfield, setPlayfield] = useState(initializePlayfield());
  const [tetromino, setTetromino] = useState(getNextTetromino(playfield));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveTetromino = (direction) => {
    if (gameOver) return;
    let newCol = tetromino.col;

    if (direction === "left") newCol--;
    if (direction === "right") newCol++;

    if (isValidMove(tetromino.matrix, tetromino.row, newCol, playfield)) {
      setTetromino({ ...tetromino, col: newCol });
    }
  };

  const rotateTetrominoHandler = () => {
    const rotated = rotateTetromino(tetromino.matrix);
    if (isValidMove(rotated, tetromino.row, tetromino.col, playfield)) {
      setTetromino({ ...tetromino, matrix: rotated });
    }
  };

  const dropTetromino = () => {
    if (gameOver) return;
    const newRow = tetromino.row + 1;

    if (!isValidMove(tetromino.matrix, newRow, tetromino.col, playfield)) {
      placeTetromino(tetromino, playfield, setPlayfield, setGameOver, setScore);
      setTetromino(getNextTetromino(playfield));
    } else {
      setTetromino({ ...tetromino, row: newRow });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dropTetromino();
    }, 500);

    return () => clearInterval(interval);
  }, [tetromino, playfield, gameOver]);

 


  

  const isValidMove = (matrix, cellRow, cellCol, playfield) => {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col]) {
          // Check if the cell is out of bounds (top, bottom, sides)
          const playfieldRow = cellRow + row;
          const playfieldCol = cellCol + col;

          if (
            playfieldCol < 0 || // left boundary
            playfieldCol >= playfield[0].length || // right boundary
            playfieldRow >= playfield.length || // bottom boundary
            (playfieldRow >= 0 && playfield[playfieldRow][playfieldCol]) // filled cell
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // useGameLogic.js

  // Adjust blocks that belong to the same group that fall into gaps after clearing lines
  const adjustBlocksByGroup = (playfield, groupsToAdjust) => {
    const newPlayfield = playfield.map((row) => [...row]);

    for (let row = newPlayfield.length - 1; row >= 0; row--) {
      for (let col = 0; col < newPlayfield[row].length; col++) {
        if (
          newPlayfield[row][col] &&
          groupsToAdjust.includes(newPlayfield[row][col])
        ) {
          let currentRow = row;

          // Check if there is space below the current block within the same group
          while (
            currentRow < newPlayfield.length - 1 &&
            !newPlayfield[currentRow + 1][col]
          ) {
            currentRow++;
          }

          // Move block down if there's space
          if (currentRow !== row) {
            newPlayfield[currentRow][col] = newPlayfield[row][col];
            newPlayfield[row][col] = 0;
          }
        }
      }
    }

    return newPlayfield;
  };


  const clearCompletedLines = (playfield, setPlayfield, setScore) => { 
    const rowsToClear = playfield.filter((row) => row.every((cell) => !!cell));
    const linesCleared = rowsToClear.length;

    if (linesCleared === 0)
      return { clearedPlayfield: playfield, linesCleared: 0 };

    // Identify groups (tetromino names) in the lines being cleared
    const groupsToAdjust = new Set();
    rowsToClear.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          groupsToAdjust.add(cell);
        }
      });
    });

    // Filter out completed rows
    const rowsToKeep = playfield.filter((row) => !row.every((cell) => !!cell));

    // Create new empty rows to add at the top of the playfield
    const newRows = Array.from({ length: linesCleared }, () =>
      new Array(10).fill(0)
    );

    // Combine the new rows and the rows that were not cleared
    const updatedPlayfield = [...newRows, ...rowsToKeep];

    // Adjust only blocks of the groups identified from the cleared lines
    const adjustedPlayfield = adjustBlocksByGroup(
      updatedPlayfield,
      Array.from(groupsToAdjust)
    );

    // Set the playfield immediately with the adjusted playfield
    setPlayfield(adjustedPlayfield);

    
    setTimeout(() => {
    console.log("line is Completed");
    setScore((prevScore) => prevScore + 100);
      const { clearedPlayfield, linesCleared } = clearCompletedLines(
        adjustedPlayfield,
        setPlayfield,
        setScore
      );
      setPlayfield(clearedPlayfield);
      console.log("New line is Completed: ", linesCleared);
      setScore((prevScore) => prevScore + linesCleared * 100); 
    }, 1000); 

    return { clearedPlayfield: adjustedPlayfield, linesCleared };
  };


  const placeTetromino = (
    tetromino,
    playfield,
    setPlayfield,
    setGameOver,
    setScore
  ) => {
    const newPlayfield = [...playfield];
    let gameOver = false;

    // Place the tetromino on the playfield
    tetromino.matrix.forEach((row, rIndex) => {
      row.forEach((value, cIndex) => {
        if (value) {
          const playfieldRow = tetromino.row + rIndex;
          const playfieldCol = tetromino.col + cIndex;

          // Check if the row is above the visible playfield (game over condition)
          if (playfieldRow < 0) {
            gameOver = true;
          } else {
            newPlayfield[playfieldRow][playfieldCol] = tetromino.name;
          }
        }
      });
    });

    if (gameOver) {
      setGameOver(true);
    } else {
      clearCompletedLines(newPlayfield, setPlayfield, setScore);
    }
  };

  const rotateTetromino = (matrix) => {
    const N = matrix.length - 1;
    return matrix.map((row, i) => row.map((_, j) => matrix[N - j][i]));
  };

  return (
    <GameContext.Provider
      value={{
        playfield,
        tetromino,
        moveTetromino,
        rotateTetrominoHandler,
        dropTetromino,
        gameOver,
        score,
        getNextTetromino,
        isValidMove,
        placeTetromino,
        rotateTetromino,
        initializePlayfield,
        colors ,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
