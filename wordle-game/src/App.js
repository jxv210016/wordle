import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/guess", {
        guess,
      });
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        alert("Error: " + error.response.data.error);
      } else {
        alert(
          "Error: Unable to connect to the server or receive a valid response."
        );
      }
    }
  };

  return (
    <div className="App">
      <h1>Wordle Game</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          maxLength="5"
        />
        <button type="submit">Guess</button>
      </form>
      <div>
        {feedback.map((color, index) => (
          <span
            key={index}
            style={{
              color:
                color === "Green"
                  ? "green"
                  : color === "Yellow"
                  ? "orange"
                  : "grey",
            }}
          >
            {guess[index] || "_"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
