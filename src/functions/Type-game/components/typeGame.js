import { addClass, removeClass } from "../getClassName.js";
import {
  animate,
  stagger,
  createTimer,
} from "../../../../node_modules/animejs/lib/anime.esm.js";

import { getGameTime } from "../index.js";
import { createOptions } from "../createOption.js";
const keyType = [];
const keyExpected = [];
export const scoreWord = [];
const Language = localStorage.getItem("language") || "english";
let sound = new Howl({
  src: "./assets/sound/click3/click3_2.wav",
  volume: 1,
});
let soundError = new Howl({
  src: "./assets/sound/error4/error4_2.wav",
  volume: 1,
});
async function getWords(Language) {
  return localStorage.getItem("qoutes")
    ? await fetch(`assets/quotes/${Language}.json`).then((res) => res.json())
    : await fetch(`assets/languages/${Language}.json`).then((res) =>
        res.json()
      );
}

const words = await getWords(Language);

let missed = 0;
let extra = 0;
/**
 * @constant {HTMLButtonElement} minus
 * @constant {HTMLButtonElement} plus
 */
const minus = document.querySelector("#minus");
const plus = document.querySelector("#plus");
let gameTime = getGameTime();

minus.addEventListener("click", () => {
  gameTime = getGameTime();
  document.querySelector("#timer").textContent = gameTime / 1000;
  console.log("gameTime : " + gameTime);
});
plus.addEventListener("click", () => {
  gameTime = getGameTime();
  document.querySelector("#timer").textContent = gameTime / 1000;
});
export default class typeGame extends HTMLElement {
  constructor() {
    super();
    this.timer = 0;
    this.wordsCount = words?.quotes?.length ?? words?.words?.length;
    this.gameStart = false;
    this.document = document;
    this.setTimer = null;
    this.reset = this.document.querySelector(".reset");
    this.onGame = this.onGame.bind(this);
    this.gameTime = gameTime;
    this.isCapsLockActive = 0;
    this.game = document.createElement("div");
    this.cursor = document.createElement("div");
    this.words = document.createElement("div");
    this.focus = document.createElement("div");
  }
  addElement() {
    this.game.id = "game";
    addClass(this.game, " rounded-lg font-[base]");
    this.cursor.id = "cursor";
    addClass(this.cursor, " w-20 z-50 h-50 rounded-ms");
    this.words.id = "words";
    this.focus.id = "focus";
    this.focus.addEventListener("click", this.focusClick);
    this.game.appendChild(this.cursor);
    this.game.addEventListener("mouseleave", this.mouseLeave);
    this.game.appendChild(this.words);
    this.focus.innerHTML = `
    <div class='flex gap-4 items-center'>
    <svg class='size-14' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.3079 11.8974L14.8974 12.3675L14.8974 12.3675C13.9663 12.6779 13.5008 12.8331 13.1669 13.1669C12.8331 13.5008 12.6779 13.9663 12.3675 14.8974L12.3675 14.8974L11.8974 16.3079C11.113 18.6611 10.7208 19.8377 10 19.8377C9.27924 19.8377 8.88704 18.6611 8.10264 16.3079L8.10263 16.3079L5.26491 7.79473C4.71298 6.13894 4.43702 5.31105 4.87403 4.87403C5.31105 4.43702 6.13894 4.71298 7.79473 5.26491L16.3079 8.10263C18.6611 8.88704 19.8377 9.27924 19.8377 10C19.8377 10.7208 18.6611 11.113 16.3079 11.8974L16.3079 11.8974Z" fill="#7E869E" fill-opacity="0.25"/>
<path d="M16.3079 11.8974L14.8974 12.3675L14.8974 12.3675C13.9663 12.6779 13.5008 12.8331 13.1669 13.1669C12.8331 13.5008 12.6779 13.9663 12.3675 14.8974L12.3675 14.8974L11.8974 16.3079C11.113 18.6611 10.7208 19.8377 10 19.8377C9.27924 19.8377 8.88704 18.6611 8.10264 16.3079L8.10263 16.3079L5.26491 7.79473C4.71298 6.13894 4.43702 5.31105 4.87403 4.87403C5.31105 4.43702 6.13894 4.71298 7.79473 5.26491L16.3079 8.10263C18.6611 8.88704 19.8377 9.27924 19.8377 10C19.8377 10.7208 18.6611 11.113 16.3079 11.8974L16.3079 11.8974Z" class='fill-amber-700'/>
<path d="M14.4743 13.8419L16.536 13.1547C16.8288 13.0571 17.1502 13.1001 17.4069 13.2713L18.4953 13.9969C19.0732 14.3821 18.9193 15.2702 18.2456 15.4386L16.291 15.9272C16.1119 15.972 15.972 16.1119 15.9272 16.291L15.4386 18.2456C15.2702 18.9193 14.3821 19.0732 13.9969 18.4953L13.2713 17.4069C13.1001 17.1502 13.0571 16.8288 13.1547 16.536L13.8419 14.4743C13.9414 14.1757 14.1757 13.9414 14.4743 13.8419Z" fill="#0C0A0F"/>
</svg><p>click here to focus</p></div>`;
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
    this.game.style.cursor = "none";
    removeClass(this.document.querySelector(".typed-conteiner"), "w-1/2");
    addClass(this.document.querySelector(".typed-conteiner"), "w-8/9");
    minus.setAttribute("disabled", "true");
    plus.setAttribute("disabled", "true");

    [...this.document.querySelectorAll("[data-hidden]")].map(
      (el) => (el.style.opacity = "0")
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
    [...this.document.querySelectorAll("[data-hidden]")].map((el) => {
      el.style.display = "flex";
      el.style.opacity = "1";
      return el;
    });
    this.document
      .querySelector("#timeBar")
      .style.setProperty("--widthBar", "635px");
    this.document
      .querySelector("#timeBar")
      .style.setProperty("--bg-bar", "#7FBC8C");
  };

  randomWord() {
    const randomIndex = Math.ceil(Math.random() * this.wordsCount);
    return words.words[randomIndex - 1];
  }
  formatWord(word) {
    return /*html*/ `<div class="word "><span class="letter  text-3xl">${word
      .split("")
      .join('</span><span class="letter text-3xl">')}</span></div>`;
  }

  connectedCallback() {
    this.appendChild(this.addElement());
    this.gameStart = false;
    this.gameTime = getGameTime();
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
    this.reset.addEventListener("click", () => {
      this.disconnectedCallback();
    });
  }
  disconnectedCallback() {
    minus.setAttribute("disabled", "false");
    plus.setAttribute("disabled", "false");
    keyType.splice(0, keyType.length - 1);
    keyExpected.splice(0, keyExpected.length - 1);
    window.removeEventListener("keydown", this.onGame);
    this.appendChild(this.addElement());
    this.gameStart = false;
    this.gameTime = this.gameTime;
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

    window.location.href = `pages/score.html`;
    this.gameStart = false;
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
    const isCapsLock = key === "CapsLock";
    const isFirstLetter = currentLetter === currentWord?.firstChild;
    const extraWord = currentWord?.querySelector(".extra");
    let getLetterErrorLength = currentWord?.querySelectorAll(".extra").length;
    this.startTime = Date.now();
    this.cursor.style.display = "flex";

    if (
      this.document.querySelector("#game.over") ||
      !this.focus.className.includes("hidden")
    ) {
      this.cursor.style.display = "none";
      return;
    }

    keyType.push(key);
    keyExpected.push(expected);
    if (isCapsLock) {
      const popUp = this.document.querySelector("#popUp").cloneNode(true);
      addClass(popUp, "scale-100");
      removeClass(popUp, "scale-0");
      popUp.querySelector("span").innerText =
        this.isCapsLockActive % 2 === 0
          ? `Caps Lock is on`
          : `Caps Lock is off`;
      console.log(this.isCapsLockActive);

      popUp.querySelector("h3").innerHTML =
        this.isCapsLockActive % 2 === 0
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-keyhole-open-icon lucide-lock-keyhole-open"><circle cx="12" cy="16" r="1"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 9.33-2.5"/></svg>`;

      document.body.appendChild(popUp);
      this.isCapsLockActive++;

      setTimeout(() => {
        return popUp.remove();
      }, 2000);
    }

    if (isSpace) {
      const [WPM, ACCURACY] = getCurrentStats();
      const { correct, incorrect, corrections } = calculateKeyStats(
        keyType,
        keyExpected
      );
      scoreWord.push([
        {
          WPM,
          ACCURACY,
          correct,
          incorrect,
          extra,
          corrections,
          missed,
          second: this.secondLeft,
        },
      ]);
      window.localStorage.clear();
      window.localStorage.setItem(
        "score",
        JSON.stringify([
          {
            WPM,
            ACCURACY,
            correct,
            incorrect,
            extra,
            corrections,
            missed,
            second: this.secondLeft,
          },
        ]),
        window.localStorage.setItem("scoreWord", JSON.stringify(scoreWord))
      );
    }
    if (key !== expected) {
      soundError.play();
    }
    if (isLetter) {
      sound.play();
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
            let sLeft = Math.round(gameTime / 1000 - self._currentIteration);
            console.log(parseInt(document.querySelector("#timer").textContent));

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
        translateY: ["0ch", "-4px", "0ch"],
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
