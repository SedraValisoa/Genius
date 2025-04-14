import { gameTime } from "../script.js";
import { keyType, keyExpected } from "../script.js";
export function getCurrentStats() {
  const words = [...document.querySelectorAll(".word")];
  const lastTypedWord = document.querySelector(".word.current");
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const valueOfTypedWords = typedWords.map((el) => el.textContent);

  const getAccurecy = () => {
    const wordLengh = valueOfTypedWords.join(" ").length;
    let accuracy = correct / wordLengh;
    return (accuracy * 100).toFixed(2);
  };

  const { correct } = calculateKeyStats(keyType, keyExpected);
  const WPM = ((correct / 5 / gameTime) * 60 * 1000).toFixed(2);
  const ACCURACY = getAccurecy();
  return [WPM, ACCURACY];
}

export function calculateKeyStats(typedChars, expectedChars) {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;
  let corrections = 0;

  for (let i = 0; i < typedChars.length; i++) {
    if (typedChars[i] === expectedChars[i]) {
      correct++;
    } else if (expectedChars[i] === undefined) {
      extra++;
    } else {
      incorrect++;
    }
  }

  if (typedChars.length < expectedChars.length) {
    missed = expectedChars.length - typedChars.length;
  }

  corrections = typedChars.filter((c) => c === "Backspace").length;

  return {
    correct,
    incorrect,
    extra,
    missed,
    corrections,
  };
}
