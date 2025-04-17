import { addClass, removeClass } from "../getClassName.js";
import {
  createSpring,
  animate,
  stagger,
  createTimer,
} from "../../../../node_modules/animejs/lib/anime.esm.js";

import { words } from "../words.js";

const gameTime = 15 * 1000;
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
    this.setTimer = null;
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
    addClass(this.game, "w-full pt-5 mt-8 rounded-lg font-[base]");
    this.cursor.id = "cursor";
    addClass(this.cursor, " w-20 z-50 h-50 rounded-ms");
    this.words.id = "words";
    this.focus.id = "focus";
    this.focus.addEventListener("click", this.focusClick);
    this.game.appendChild(this.cursor);
    this.game.addEventListener("mouseleave", this.mouseLeave);
    this.game.appendChild(this.words);
    this.focus.textContent = "click here to focus";
    addClass(
      this.focus,
      "grid place-items-center text-3xl font-bold text-amber-600"
    );
    this.game.appendChild(this.focus);
    return this.game;
  }

  focusClick = () => {
    addClass(this.focus, "hidden");
    removeClass(this.focus, "flex");
    removeClass(this.document.querySelector(".typed-conteiner"), "w-1/2");
    addClass(this.document.querySelector(".typed-conteiner"), "w-8/9");
    [...this.document.querySelectorAll(".btn-remove")].map(
      (el) => (el.style.display = "none")
    );
    [...this.document.querySelectorAll(".level")].map(
      (el) => (el.style.display = "none")
    );
  };
  mouseLeave = () => {
    this.pauseTimer();
    removeClass(this.document.querySelector(".typed-conteiner"), "w-8/9");
    addClass(this.document.querySelector(".typed-conteiner"), "w-1/2");
    addClass(this.focus, "flex");
    this.reset.removeAttribute("disabled");
    removeClass(this.focus, "hidden");
    this.cursor.style.display = "none";
    [...this.document.querySelectorAll(".btn-remove")].map(
      (el) => (el.style.display = "flex")
    );
    [...this.document.querySelectorAll(".level")].map(
      (el) => (el.style.display = "flex")
    );
    this.document
      .querySelector("#timeBar")
      .style.setProperty("--widthBar", "635px");
    this.document
      .querySelector("#timeBar")
      .style.setProperty("--bg-bar", "#7FBC8C");
  };

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
    removeClass(this.game, "over");
    this.document
      .querySelector("#timeBar")
      .style.setProperty("--bg-bar", "#7FBC8C");
    this.cursor.style.top =
      this.words.firstChild.getBoundingClientRect()["top"] + "px";
    this.cursor.style.left =
      this.words.firstChild.getBoundingClientRect()["left"] + "px";
  }
  gameOver() {
    addClass(this.game, "over");
    window.removeEventListener("keydown", this.onGame);
    this.cursor.style.display = "none";
    window.removeEventListener("click", this.focusClick);
    window.location.href = "pages/score.html";
    return;
  }

  pauseTimer = () => this.setTimer?.pause();
  resumeTimer = () => this.setTimer?.resume();
  onGame(ev) {
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
    this.startTime = Date.now();
    this.cursor.style.display = "flex";

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
    }
    console.log(scoreWord);

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
      if (!this.gameStart) {
        this.gameStart = true;
        this.setTimer = createTimer({
          duration: 1000,
          loop: true,
          frameRate: 30,
          onLoop: (self) => {
            let sLeft = Math.round(
              this.gameTime / 1000 - self._currentIteration
            );
            if (sLeft <= 0) {
              return this.gameOver();
            }
            let initialeWith = 325;
            let widthOfbar = (sLeft * parseInt(initialeWith, 10)) / 100 + "%";
            console.log(widthOfbar);
            if ((sLeft * parseInt(initialeWith, 10)) / 100 < 30) {
              this.document
                .querySelector("#timeBar")
                .style.setProperty("--bg-bar", "#F4D738");
            }
            if ((sLeft * parseInt(initialeWith, 10)) / 100 < 20) {
              this.document
                .querySelector("#timeBar")
                .style.setProperty("--bg-bar", "#F42738");
            }
            this.document
              .querySelector("#timeBar")
              .style.setProperty("--widthBar", widthOfbar);
            return (document.getElementById("timer").innerHTML = sLeft);
          },
        });
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

    if (isLetter) {
      animate(currentLetter, {
        translateY: ["0ch", "-0.5ch", "0ch"],
        delay: stagger(150),
        duration: 300,
      });
      if (this.pauseTimer) {
        this.resumeTimer();
      }
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
