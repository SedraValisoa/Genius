import { addClass, removeClass } from "../getClassName.js";
import { words } from "../words.js";

let gameTime = 30 * 1000;
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
    this.className = this.getAttribute("class");
    this.gameStart = false;
    this.document = document;
    this.secondLeft = 0;
    this.onGame = this.onGame.bind(this);
    this.info = document.getElementById("info");
    this.gameTime = gameTime;
    this.game = document.createElement("div");
    this.cursor = document.createElement("div");
    this.words = document.createElement("div");
    this.focus = document.createElement("div");
  }
  addElement() {
    this.game.id = "game";
    addClass(
      this.game,
      "flex flex-wrap bg-amber-200 px-4 py-3 rounded-lg h-full font-[base]"
    );
    this.cursor.id = "cursor";
    addClass(this.cursor, "bg-amber-300 w-1 z-10 h-5 rounded-ms animate-ping");
    this.words.id = "words";
    this.focus.id = "focus";
    this.focus.addEventListener("click", () => {
      this.focus.style.display = "none";
      this.cursor.style.display = "block";
      this.disconnectedCallback();
    });
    this.game.appendChild(this.cursor);
    this.game.addEventListener("mouseleave", () => {
      this.focus.style.display = "block";
      this.cursor.style.display = "none";
      clearInterval(this.timer);
    });
    this.game.appendChild(this.words);
    this.focus.textContent = "click here to focus";
    this.game.appendChild(this.focus);
    return this.game;
  }

  randomWord() {
    const randomIndex = Math.ceil(Math.random() * this.wordsCount);
    return words[randomIndex - 1];
  }
  formatWord(word) {
    return /*html*/ `<div class="word"><span class="letter">${word
      .split("")
      .join('</span><span class="letter">')}</span></div>`;
  }

  connectedCallback() {
    this.appendChild(this.addElement());
    this.gameStart = false;
    this.gameTime = 30 * 1000;
    clearInterval(this.timer);
    this.startTime = new Date().getTime();
    this.words.innerHTML = "";
    for (let i = 0; i < 200; i++) {
      this.words.innerHTML += this.formatWord(this.randomWord());
    }
    this.info.innerHTML = String(this.gameTime / 1000);
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
    this.document.addEventListener("keydown", (ev) => {
      this.onGame(ev);
    });
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
    this.info.innerHTML += `Game Over`;
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

    if (this.document.querySelector("#game.over")) {
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
          incorrectLetter.className = "letter incorrect extra";
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

    this.cursor.style.top =
      (nextLetter || nextWord)?.getBoundingClientRect().top + 2 + "px";

    this.cursor.style.left =
      (nextLetter || nextWord)?.getBoundingClientRect()[
        nextLetter ? "left" : "right"
      ] + "px";

    if (!isLetter && !isBackspace && !isSpace) {
      return;
    }
    this.info.innerHTML = `WPM: ${WPM} : ACCURECY : ${ACCURACY} \n ${correct}/${incorrect}/${extra}/${missed}/${corrections}`;
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
