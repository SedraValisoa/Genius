import { addClass, removeClass } from "../getClassName.js";
import {
  createSpring,
  animate,
} from "../../../../node_modules/animejs/lib/anime.esm.js";

import { words } from "../words.js";

let gameTime = 15 * 1000;
const keyType = [];
const keyExpected = [];
export const scoreWord = [];
let missed = 0;
let extra = 0;
export default class typeGame extends HTMLElement {
  constructor() {
    super();
    this.timer = 0;
    this.wordsCount = words.length;
    this.gameStart = false;
    this.document = document;
    this.secondLeft = 0;
    this.reset = this.document.querySelector(".reset");
    this.onGame = this.onGame.bind(this);
    this.gameTime = gameTime;
    this.game = document.createElement("div");
    this.cursor = document.createElement("div");
    this.words = document.createElement("div");
    this.focus = document.createElement("div");
  }
  addElement() {
    this.game.id = "game";
    addClass(this.game, "w-full pt-5 rounded-lg font-[base]");
    this.cursor.id = "cursor";
    addClass(this.cursor, " w-20 z-50 h-50 rounded-ms");
    this.words.id = "words";
    this.focus.id = "focus";
    this.focus.addEventListener("click", () => {
      addClass(this.focus, "hidden");
      removeClass(this.focus, "flex");
      this.reset.removeAttribute("disabled");
      removeClass(this.document.querySelector(".typed-conteiner"), "w-1/2");
      addClass(this.document.querySelector(".typed-conteiner"), "w-8/9");
      this.cursor.style.display = "flex";
      this.cursor.style.top = this.getBoundingClientRect()["top"] + 40 + "px";
      this.cursor.style.left =
        this.words.firstChild.firstChild.getBoundingClientRect()["left"] -
        268 +
        "px";
    });
    this.game.appendChild(this.cursor);
    this.game.addEventListener("mouseleave", () => {
      addClass(this.focus, "flex");
      removeClass(this.focus, "hidden");
      addClass(this.cursor, "hidden");
      clearInterval(this.timer);
    });
    this.game.appendChild(this.words);
    this.focus.textContent = "click here to focus";
    addClass(
      this.focus,
      "flex flex-col items-center pt-34.5 text-3xl font-bold text-amber-600"
    );
    this.game.appendChild(this.focus);
    return this.game;
  }

  randomWord() {
    const randomIndex = Math.ceil(Math.random() * this.wordsCount);
    return words[randomIndex - 1];
  }
  formatWord(word) {
    return /*html*/ `<div class="word "><span class="letter  text-3xl">${word
      .split("")
      .join('</span><span class="letter text-3xl">')}</span></div>`;
  }

  connectedCallback() {
    this.appendChild(this.addElement());
    this.gameStart = false;
    this.gameTime = gameTime;
    clearInterval(this.timer);
    this.startTime = new Date().getTime();
    this.words.innerHTML = "";
    for (let i = 0; i < 200; i++) {
      this.words.innerHTML += this.formatWord(this.randomWord());
    }
    document.getElementById("timer").innerHTML = String(this.gameTime / 1000);
    removeClass(document.querySelector(".word"), "current");
    removeClass(document.querySelector(".letter"), "current");
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    removeClass(document.getElementById("game"), "over");
    this.timer = null;
    this.cursor.style.top = this.getBoundingClientRect()["top"] + "px";

    this.cursor.style.left =
      this.words.firstChild.firstChild.getBoundingClientRect()["left"] + "px";
    this.document.addEventListener("keydown", (ev) => {
      this.onGame(ev);
    });
    this.reset.addEventListener("click", () => this.disconnectedCallback());
  }
  disconnectedCallback() {
    keyType.splice(0, keyType.length - 1);
    keyExpected.splice(0, keyExpected.length - 1);
    window.removeEventListener("keydown", this.onGame);
    this.appendChild(this.addElement());
    this.gameStart = false;
    this.gameTime = gameTime;
    clearInterval(this.timer);
    this.startTime = new Date().getTime();
    this.words.innerHTML = "";
    for (let i = 0; i < 200; i++) {
      this.words.innerHTML += this.formatWord(this.randomWord());
    }
    document.getElementById("timer").innerHTML = String(this.gameTime / 1000);
    removeClass(document.querySelector(".word"), "current");
    removeClass(document.querySelector(".letter"), "current");
    addClass(document.querySelector(".word"), "current");
    addClass(document.querySelector(".letter"), "current");
    removeClass(document.getElementById("game"), "over");
    this.timer = null;
    this.cursor.style.top =
      this.words.firstChild.getBoundingClientRect()["top"] + "px";
    this.cursor.style.left =
      this.words.firstChild.getBoundingClientRect()["left"] + "px";
  }
  gameOver() {
    clearInterval(this.timer);
    addClass(this.game, "over");
    window.removeEventListener("keydown", this.onGame);
    return;
  }

  setTimer = () => {
    const startTime = this.startTime;
    this.timer = setInterval(() => {
      if (!this.gameStart) {
        this.gameStart = true;
        startTime = new Date().getTime();
      }

      const currentTime = new Date().getTime();
      const msPassed = currentTime - startTime;

      const sPassed = Math.round(msPassed / 1000);

      const sLeft = Math.round(this.gameTime / 1000 - sPassed);
      this.secondLeft = sPassed;
      if (sLeft <= 0) {
        this.gameOver();
        return;
      }

      document.getElementById("timer").innerHTML = sLeft + "";
    }, 1000);
  };

  onGame(ev) {
    this.startTime = Date.now();
    const key = ev.key;
    const currentWord = this.game.querySelector(".word.current");
    const currentLetter = this.game.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || " ";
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const isFirstLetter = currentLetter === currentWord?.firstChild;
    const extraWord = currentWord?.querySelector(".extra");
    let getLetterErrorLength = currentWord?.querySelectorAll(".extra").length;

    const [WPM, ACCURACY] = getCurrentStats();
    const { correct, incorrect, corrections } = calculateKeyStats(
      keyType,
      keyExpected
    );

    if (
      this.document.querySelector("#game.over") ||
      !this.focus.className.includes("hidden")
    ) {
      this.cursor.style.display = "none";
      return;
    }
    if (!this.gameStart) {
      this.gameStart = true;
      this.setTimer();
    }

    keyType.push(key);
    keyExpected.push(expected);

    if (isSpace) {
      scoreWord.push({
        WPM,
        ACCURACY,
        correct,
        incorrect,
        extra,
        corrections,
        missed,
        second: this.secondLeft,
      });
      console.log(scoreWord);
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
          incorrectLetter.className = "letter incorrect extra text-3xl";
          currentWord.appendChild(incorrectLetter);
          extra++;
        }
      }
    }

    if (isSpace) {
      if (expected !== " ") {
        currentWord.firstChild.className.includes("correct") &&
          [
            ...this.words.querySelectorAll(
              ".word.current .letter:not(.correct)"
            ),
          ].forEach((letter) => {
            addClass(letter, "incorrect invalided");
          });
        missed += [
          ...this.words.querySelectorAll(".word.current .letter:not(.correct)"),
        ].length;
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
      if (this.words.firstChild.firstChild.className.includes("current")) {
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
      const words = this.words;
      const margin = parseInt(words.style.marginTop || "0px");
      words.style.marginTop = margin - 35 + "px";
    }

    // move cursor
    const nextLetter = this.words.querySelector(".letter.current");
    const nextWord = this.words.querySelector(".word.current");
    const position = nextLetter || nextWord;
    this.cursor.style.top =
      position?.getBoundingClientRect().top -
      (position == nextLetter ? 2 : 0) +
      "px";
    this.cursor.style.left =
      position?.getBoundingClientRect()[nextLetter ? "left" : "right"] -
      2 +
      "px";

    if (!isLetter && !isBackspace && !isSpace) {
      return;
    }
    if (isLetter) {
      animate(currentLetter.previousSibling, {
        translateY: ["0ch", "-0.5ch", "0ch"],
        ease: "in",
      });
    }
  }
}
function getCurrentStats() {
  const words = [...document.querySelectorAll(".word")];
  const lastTypedWord = document.querySelector(".word.current");
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const valueOfTypedWords = typedWords.map((el) => el.textContent);
  const wordLengh = valueOfTypedWords.join(" ").length;

  const getAccurecy = () => {
    let accuracy = correct / wordLengh;
    return (accuracy * 100).toFixed(2);
  };

  const { correct } = calculateKeyStats(keyType, keyExpected);
  const WPM = ((correct / 5 / gameTime) * 60 * 1000).toFixed(2);
  const ACCURACY = getAccurecy();
  return [WPM, ACCURACY];
}

function calculateKeyStats(typedChars, expectedChars) {
  let correct = 0;
  let corrections = 0;
  let incorrect = 0;

  for (let i = 0; i < typedChars?.length; i++) {
    if (typedChars[i] === expectedChars[i]) {
      correct++;
    } else if (typedChars[i] === "Backspace") {
      corrections++;
    } else if (typedChars[i] !== "Backspace") {
      incorrect++;
    }
  }

  return {
    correct,
    incorrect,
    corrections,
  };
}
