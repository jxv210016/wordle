import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [keyStatus, setKeyStatus] = useState({});
  const [targetWord, setTargetWord] = useState("");

  const startNewGame = useCallback(() => {
    setGuess("");
    setHistory([]);
    setGameOver(false);
    setKeyStatus({});
    // Fetch a new random word from the backend
    axios.get("http://localhost:5001/new_word")
      .then(response => setTargetWord(response.data.word))
      .catch(error => console.error("Error fetching new word:", error));
  }, []);

  const submitGuess = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:5001/guess", { guess: guess.toLowerCase(), target_word: targetWord });
      const newFeedback = response.data.feedback;
      setHistory(prevHistory => [...prevHistory, { guess, feedback: newFeedback }]);
      updateKeyStatus(guess, newFeedback);
      if (newFeedback.every(color => color === "Green")) {
        alert(`Congratulations! You've guessed the word in ${history.length + 1} attempts!`);
        setGameOver(true);
      } else if (history.length + 1 === 6) {
        alert("You've reached the maximum number of attempts. Game Over!");
        setGameOver(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: Unable to connect to the server or receive a valid response.");
    }
  }, [guess, targetWord, history]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;
      if (gameOver) return;
      if (key === "Enter") {
        if (guess.length === 5) {
          submitGuess();
          setGuess("");
        }
      } else if (key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(key)) {
        if (guess.length < 5) {
          setGuess(guess + key.toUpperCase());
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [guess, gameOver, submitGuess]);

  const handleKey = (key) => {
    if (key === "ENTER") {
      if (guess.length === 5 && !gameOver) {
        submitGuess();
        setGuess("");
      }
    } else if (key === "DELETE") {
      setGuess(guess.slice(0, -1));
    } else if (guess.length < 5 && /^[a-zA-Z]$/.test(key)) {
      setGuess(guess + key.toUpperCase());
    }
  };

  const updateKeyStatus = (guess, feedback) => {
    const newKeyStatus = { ...keyStatus };
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i].toUpperCase();
      if (feedback[i] === "Green") {
        newKeyStatus[letter] = "green";
      } else if (feedback[i] === "Yellow" && newKeyStatus[letter] !== "green") {
        newKeyStatus[letter] = "yellow";
      } else if (feedback[i] === "Gray" && !newKeyStatus[letter]) {
        newKeyStatus[letter] = "gray";
      }
    }
    setKeyStatus(newKeyStatus);
  };

  return (
    <div className="App">
      <h1>Wordle Game</h1>
      <div className="guesses">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className={`guess-row ${rowIndex === history.length ? 'current' : ''}`}>
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const guessEntry = history[rowIndex] && history[rowIndex].guess[colIndex];
              const feedbackEntry = history[rowIndex] && history[rowIndex].feedback[colIndex];
              const isCurrentGuessRow = rowIndex === history.length;
              const isGuessChar = isCurrentGuessRow && colIndex < guess.length;
              const guessChar = isGuessChar ? guess[colIndex].toUpperCase() : '';
              const boxClass = isGuessChar ? 'guess-box current' : `guess-box ${feedbackEntry ? feedbackEntry.toLowerCase() : ''}`;
              return (
                <div key={colIndex} className={boxClass}>
                  {guessChar || guessEntry ? (guessEntry ? guessEntry.toUpperCase() : '') : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="keyboard">
        <div className="keyboard-row">
          {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
            <button key={key} className={keyStatus[key] || ''} onClick={() => handleKey(key)}>{key}</button>
          ))}
        </div>
        <div className="keyboard-row">
          {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
            <button key={key} className={keyStatus[key] || ''} onClick={() => handleKey(key)}>{key}</button>
          ))}
        </div>
        <div className="keyboard-row">
          {['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'].map(key => (
            <button key={key} className={keyStatus[key] || ''} onClick={() => handleKey(key)}>
              {key === 'ENTER' ? <small>ENTER</small> : key === 'DELETE' ? <span>&#x232b;</span> : key}
            </button>
          ))}
        </div>
      </div>
      <button className="new-game" onClick={startNewGame}>New Game</button>
    </div>
  );
}

export default App;
