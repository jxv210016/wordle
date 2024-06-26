// solver.js

function calculateLetterFrequencies(words) {
  const frequencies = Array.from({ length: 5 }, () => ({}));
  words.forEach((word) => {
    word.split("").forEach((char, i) => {
      frequencies[i][char] = (frequencies[i][char] || 0) + 1;
    });
  });
  return frequencies;
}

function calculateWordScore(word, frequencies) {
  let score = 0;
  const seen = new Set();
  word.split("").forEach((char, i) => {
    if (!seen.has(char)) {
      score += frequencies[i][char] || 0;
      seen.add(char);
    }
  });
  return score;
}

function makeGuess(possibleWords) {
  if (!possibleWords.length) return null;
  const frequencies = calculateLetterFrequencies(possibleWords);
  return possibleWords.reduce((bestWord, word) =>
    calculateWordScore(word, frequencies) >
    calculateWordScore(bestWord, frequencies)
      ? word
      : bestWord
  );
}

function filterWords(words, guess, feedback) {
  return words.filter((word) => {
    return word.split("").every((char, i) => {
      if (feedback[i] === "green") return word[i] === guess[i];
      if (feedback[i] === "yellow")
        return word.includes(guess[i]) && word[i] !== guess[i];
      if (feedback[i] === "gray") return !word.includes(guess[i]);
      return true;
    });
  });
}

export { makeGuess, filterWords };
