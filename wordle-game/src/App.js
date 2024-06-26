import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";
import "./App.css";

function App() {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [keyStatus, setKeyStatus] = useState({});
  const [targetWord, setTargetWord] = useState("");

  const updateKeyStatus = useCallback(
    (guess, feedback) => {
      const newKeyStatus = { ...keyStatus };
      guess.split("").forEach((letter, index) => {
        const upperLetter = letter.toUpperCase();
        if (feedback[index] === "Green") {
          newKeyStatus[upperLetter] = "green";
        } else if (
          feedback[index] === "Yellow" &&
          newKeyStatus[upperLetter] !== "green"
        ) {
          newKeyStatus[upperLetter] = "yellow";
        } else if (feedback[index] === "Gray" && !newKeyStatus[upperLetter]) {
          newKeyStatus[upperLetter] = "gray";
        }
      });
      setKeyStatus(newKeyStatus);
    },
    [keyStatus]
  );

  const startNewGame = useCallback(() => {
    setGuess("");
    setHistory([]);
    setGameOver(false);
    setKeyStatus({});
    axios
      .get("http://localhost:5001/new_word")
      .then((response) => setTargetWord(response.data.word))
      .catch((error) => console.error("Error fetching new word:", error));
  }, []);

  const submitGuess = useCallback(async () => {
    try {
      const response = await axios.post("http://localhost:5001/guess", {
        guess: guess.toLowerCase(),
        target_word: targetWord,
      });
      const newFeedback = response.data.feedback;
      setHistory((prevHistory) => [
        ...prevHistory,
        { guess, feedback: newFeedback },
      ]);
      updateKeyStatus(guess, newFeedback);
      if (newFeedback.every((color) => color === "Green")) {
        alert(
          `Congratulations! You've guessed the word in ${
            history.length + 1
          } attempts!`
        );
        setGameOver(true);
      } else if (history.length + 1 === 6) {
        alert("You've reached the maximum number of attempts. Game Over!");
        setGameOver(true);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Error: Unable to connect to the server or receive a valid response."
      );
    }
  }, [guess, targetWord, history, updateKeyStatus]);

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
      } else if (/^[a-zA-Z]$/.test(key) && guess.length < 5) {
        setGuess(guess + key.toUpperCase());
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

  return (
    <div className="App">
      <h1>Wordle Game</h1>
      <GameBoard history={history} guess={guess} gameOver={gameOver} />
      <Keyboard handleKey={handleKey} keyStatus={keyStatus} />
      <button className="new-game" onClick={startNewGame}>
        New Game
      </button>
    </div>
  );
}

export default App;
