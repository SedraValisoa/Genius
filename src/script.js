import { addClass, removeClass } from "./functions/getClassName.js";
import {
  getCurrentStats,
  calculateKeyStats,
} from "./functions/getCurrentStats.js";
import { words } from "./functions/words.js";

const wordsCount = words.length;

export const gameTime = 30 * 1000;

window.timer = null;
window.gameStart = null;
let gameStart = false;
let startTime = false;
export let spaceCounter = 0;
export const keyType = [];
export const keyExpected = [];

function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word
    .split("")
    .join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  window.gameStart = 0;
  startTime = new Date().getTime();
  clearInterval(window.timer);
  document.getElementById("words").innerHTML = "";
  for (let i = 0; i < 200; i++) {
    document.getElementById("words").innerHTML += formatWord(randomWord());
  }
  document.getElementById("info").innerHTML = String(gameTime / 1000);
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");
  removeClass(document.getElementById("game"), "over");
  window.timer = null;
  cursor.style.top = "193.016px";
  cursor.style.left =
    document.querySelector("#words").firstChild.getBoundingClientRect()[
      "left"
    ] + "px";

  document.getElementById("game").addEventListener("keydown", onGame);
}

document.getElementById("newGameBtn").addEventListener("click", () => {
  gameStart = false;
  newGame();
});

let setTimer = () => {
  if (!gameStart) {
    gameStart = true;
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = new Date().getTime();
      }
      const currentTime = new Date().getTime();
      const msPassed = currentTime - window.gameStart;

      const sPassed = Math.round(msPassed / 1000);

      const sLeft = Math.round(gameTime / 1000 - sPassed);
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById("timer").innerHTML = sLeft + "";
    }, 1000);
  }
};

function gameOver() {
  if (window.timer) {
    clearInterval(window.timer);
  }
  addClass(document.getElementById("game"), "over");
  const [WPM, ACCURACY] = getCurrentStats();
  document.getElementById(
    "info"
  ).innerHTML = `WPM: ${WPM} : ACCURECY : ${ACCURACY}`;
}

function onGame(ev) {
  startTime = Date.now();
  const key = ev.key;
  const currentWord = document.querySelector(".word.current");
  const currentLetter = document.querySelector(".letter.current");
  const expected = currentLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackspace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord?.firstChild;
  const extraWord = currentWord?.querySelector(".extra");
  let getLetterErrorLength = currentWord?.querySelectorAll(".extra").length;
  if (document.querySelector("#game.over")) {
    return;
  }
  const [WPM, ACCURACY] = getCurrentStats();
  const { correct, incorrect, extra, missed, corrections } = calculateKeyStats(
    keyType,
    keyExpected
  );
  document.getElementById(
    "info"
  ).innerHTML = `WPM: ${WPM} : ACCURECY : ${ACCURACY} : ${correct}/${
    incorrect - corrections
  }/${extra}/${missed}/${corrections}`;
  if (!gameStart) {
    setTimer();
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, "current");
      }
    } else {
      if (getLetterErrorLength < 5) {
        const incorrectLetter = document.createElement("span");
        incorrectLetter.innerHTML = key;
        incorrectLetter.className = "letter incorrect extra";
        currentWord.appendChild(incorrectLetter);
      }
    }
  }

  if (isSpace) {
    if (expected !== " ") {
      currentWord.firstChild.className.includes("correct") &&
        [
          ...document.querySelectorAll(".word.current .letter:not(.correct)"),
        ].forEach((letter) => {
          addClass(letter, "incorrect invalided");
        });
      addClass(currentWord.lastChild.nextSibling, "current");
    }
    if (
      expected !== " " &&
      !currentWord.firstChild.className.includes("correct")
    ) {
      return;
    }
    removeClass(currentWord, "current");
    addClass(currentWord.nextSibling, "current");

    if (currentLetter) {
      removeClass(currentLetter, "current");
    }
    addClass(currentWord.nextSibling.firstChild, "current");
  }

  if (isBackspace) {
    if (
      document
        .getElementById("words")
        .firstChild.firstChild.className.includes("current")
    ) {
      return;
    }
    if (currentLetter && isFirstLetter) {
      // make prev word current, last letter current
      removeClass(currentWord, "current");
      addClass(currentWord.previousSibling, "current");
      removeClass(currentLetter, "current");
      addClass(currentWord?.previousSibling?.lastChild, "current");
      removeClass(
        currentWord?.previousSibling?.lastChild,
        "incorrect invalided"
      );
      removeClass(currentWord?.previousSibling?.lastChild, "correct");
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter
      removeClass(currentLetter, "current");
      addClass(currentLetter.previousSibling, "current");
      removeClass(currentLetter.previousSibling, "incorrect invalided");
      removeClass(currentLetter.previousSibling, "correct");
    }
    if (!currentLetter) {
      addClass(currentWord?.lastChild, "current");
      removeClass(currentWord?.lastChild, "incorrect invalided");
      removeClass(currentWord?.lastChild, "correct");
    }
    if (extraWord) currentWord?.lastChild.remove();
  }

  // move lines / words
  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById("words");
    const margin = parseInt(words.style.marginTop || "0px");
    words.style.marginTop = margin - 35 + "px";
  }

  // move cursor
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  const cursor = document.getElementById("cursor");

  cursor.style.top =
    (nextLetter || nextWord)?.getBoundingClientRect().top + 2 + "px";

  cursor.style.left =
    (nextLetter || nextWord)?.getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] + "px";

  const isErrorChar = [...document.querySelector(".word").childNodes].filter(
    (el) => el.className.includes("incorrect")
  ).length;
  const countSpace = () => {
    if (expected === " " && isSpace) {
      spaceCounter++;
    } else if (isBackspace) {
      if (currentLetter && isFirstLetter && !isErrorChar) {
        spaceCounter--;
      }
    }
    return spaceCounter > 0 ? spaceCounter : 0;
  };
  spaceCounter = countSpace();
  if (!isLetter && !isBackspace && !isSpace) {
    return;
  }

  keyType.push(key);
  keyExpected.push(expected);
}

newGame();
