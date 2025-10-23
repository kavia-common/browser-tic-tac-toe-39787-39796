import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional Tic Tac Toe
 * - Modern, centered layout
 * - Smooth transitions, rounded corners, subtle shadows
 * - Color palette:
 *   primary #2563EB, secondary #F59E0B, error #EF4444,
 *   background #f9fafb, surface #ffffff, text #111827
 */

// Utility to calculate winner from a 9-cell board array
function calculateWinner(cells) {
  const lines = [
    // rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // cols
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // diagonals
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { player: cells[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * App renders the complete Tic Tac Toe game with Ocean Professional theme.
   * Provides a centered board, status, and controls.
   */
  return (
    <div className="ocean-app">
      <header className="ocean-header">
        <h1 className="ocean-title" aria-label="Tic Tac Toe Game">
          Tic Tac Toe
        </h1>
        <p className="ocean-subtitle">Two players. Take turns. First to three in a row wins.</p>
      </header>

      <main className="ocean-main">
        <Game />
      </main>

      <footer className="ocean-footer" aria-hidden="true">
        Built with the Ocean Professional theme
      </footer>
    </div>
  );
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(
    () => !winnerInfo && board.every((c) => c !== null),
    [board, winnerInfo]
  );

  const currentPlayer = xIsNext ? 'X' : 'O';

  function handleSquareClick(index) {
    // Prevent play if cell taken or game finished
    if (board[index] || winnerInfo) return;
    setBoard((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((v) => !v);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    /**
     * Reset the board and turn state to start a new game.
     */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  let status = `Current turn: ${currentPlayer}`;
  if (winnerInfo) {
    status = `Winner: ${winnerInfo.player} 🎉`;
  } else if (isDraw) {
    status = "It's a draw 🤝";
  }

  return (
    <div className="game-card" role="region" aria-label="Tic Tac Toe Board and Controls">
      <div className="status-row">
        <div
          className={`pill ${winnerInfo ? 'pill-win' : isDraw ? 'pill-draw' : 'pill-turn'}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {status}
        </div>
      </div>

      <Board
        squares={board}
        onClick={handleSquareClick}
        winningLine={winnerInfo?.line || []}
        gameOver={Boolean(winnerInfo) || isDraw}
      />

      <div className="controls">
        <button
          className="btn-reset"
          onClick={resetGame}
          aria-label="Start a new game"
        >
          New Game
        </button>
      </div>
    </div>
  );
}

function Board({ squares, onClick, winningLine, gameOver }) {
  return (
    <div
      className="board"
      role="grid"
      aria-label="Tic Tac Toe grid"
      aria-readonly={gameOver}
    >
      {squares.map((value, idx) => {
        const isWinning = winningLine.includes(idx);
        return (
          <Square
            key={idx}
            index={idx}
            value={value}
            onClick={() => onClick(idx)}
            isWinning={isWinning}
            disabled={gameOver || Boolean(value)}
          />
        );
      })}
    </div>
  );
}

function Square({ index, value, onClick, isWinning, disabled }) {
  const label = value
    ? `Cell ${index + 1}, ${value}`
    : `Cell ${index + 1}, empty`;

  return (
    <button
      type="button"
      className={`square ${isWinning ? 'square-winning' : ''}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!value}
      disabled={disabled}
    >
      <span className={`mark ${value ? 'mark-visible' : ''}`}>
        {value || ''}
      </span>
    </button>
  );
}
