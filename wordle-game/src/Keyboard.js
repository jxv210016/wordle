import React from "react";

function Keyboard({ handleKey, keyStatus }) {
  const keys1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keys2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keys3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"];

  return (
    <div className="keyboard">
      {[keys1, keys2, keys3].map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={keyStatus[key] || ""}
              onClick={() => handleKey(key)}
            >
              {key === "ENTER" ? (
                <small>ENTER</small>
              ) : key === "DELETE" ? (
                <span>&#x232b;</span>
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
