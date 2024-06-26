import React from "react";

function GameBoard({ history, guess, gameOver }) {
  return (
    <div className="guesses">
      {Array.from({ length: 6 }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className={`guess-row ${
            rowIndex === history.length ? "current" : ""
          }`}
        >
          {Array.from({ length: 5 }, (_, colIndex) => {
            const guessEntry =
              history[rowIndex] && history[rowIndex].guess[colIndex];
            const feedbackEntry =
              history[rowIndex] && history[rowIndex].feedback[colIndex];
            const isCurrentGuessRow = rowIndex === history.length;
            const isGuessChar = isCurrentGuessRow && colIndex < guess.length;
            const guessChar = isGuessChar ? guess[colIndex].toUpperCase() : "";
            const boxClass = isGuessChar
              ? "guess-box current"
              : `guess-box ${feedbackEntry ? feedbackEntry.toLowerCase() : ""}`;
            return (
              <div key={colIndex} className={boxClass}>
                {guessChar || (guessEntry ? guessEntry.toUpperCase() : "")}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default GameBoard;
