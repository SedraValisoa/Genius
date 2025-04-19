import { animate } from "../../../node_modules/animejs/lib/anime.esm.js";
import { Language } from "./components/Language.js";
import typeGame from "./components/typeGame.js";
import { createOptions } from "./createOption.js";
import { isoToEmoji } from "./isoToEmoji.js";

customElements.define("type-game", typeGame);
export function getGameTime() {
  let defaultTimer = parseInt(document.querySelector("#timer").textContent);
  const minus = document.querySelector("#minus");
  const plus = document.querySelector("#plus");

  minus.addEventListener("click", () => {
    defaultTimer /= 2;

    if (defaultTimer <= 15) {
      defaultTimer = 15;
    }
    document.querySelector("#timer").textContent =
      defaultTimer <= 15 ? 15 : defaultTimer;
  });

  plus.addEventListener("click", () => {
    defaultTimer = defaultTimer * 2;

    if (defaultTimer >= 120) {
      defaultTimer = 120;
    }
    document.querySelector("#timer").textContent =
      defaultTimer >= 120 ? 120 : defaultTimer;
  });

  return defaultTimer * 1000;
}

let isLoaded = false;
document.querySelector(".btn-language").lastElementChild.textContent =
  localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "english";
async function popOption() {
  const optionConteiner = document.querySelector("#optionPop");
  optionConteiner.style.display = "flex";
  const listOfLanguage = await Language()
    .then((d) => d)
    .catch((e) => console.error("Something that wrong : " + e));

  const lang = listOfLanguage.map((el) => el);
  if (!isLoaded) {
    isLoaded = true;
    for (const l of lang) {
      const listOption = createOptions("listOption").lastElementChild;
      const inputOption = createOptions("listOption").firstElementChild;
      inputOption.id = l.name;
      inputOption.setAttribute("value", l.name);

      listOption.innerHTML = `<span>${isoToEmoji(l.name.slice(0, 2))}</span> ${
        l.name
      }`;
      if (inputOption.value == "english") {
        inputOption.setAttribute("checked", true);
      }
      if (inputOption.value == localStorage.getItem("language")) {
        inputOption.setAttribute("checked", true);
        document.querySelector(".btn-language").lastElementChild.textContent =
          l.name;
        window.localStorage.setItem("language", l.name);
      }
      listOption.setAttribute("for", l.name);

      if (inputOption.value == "lorem_ipsum") {
        listOption.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-left-right-ellipsis-icon lucide-chevrons-left-right-ellipsis"><path d="m18 8 4 4-4 4"/><path d="m6 8-4 4 4 4"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg> Lorem Ipsum`;
      }
      if (inputOption.value == "git") {
        listOption.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github-icon lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> Git`;
      }
      optionConteiner.querySelector(".grid").appendChild(inputOption);
      optionConteiner.querySelector(".grid").appendChild(listOption);
      inputOption.addEventListener("change", (e) => {
        document.querySelector(".btn-language").lastElementChild.textContent =
          e.target.value;
        window.localStorage.setItem("language", l.languages[0]);
        window.localStorage.setItem("isSelected", true);
        window.location.reload();
      });
    }
  }
  const title = optionConteiner.querySelector("h3");
  title.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-earth-icon lucide-earth"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></svg> Language`;

  optionConteiner.querySelector("span").addEventListener("click", () => {
    optionConteiner.style.display = "none";
  });
  document.body.appendChild(optionConteiner);

  // .addEventListener("change", (e) => {
  //   console.log(e.target.value);
  //   document.querySelector(".btn-language").textContent = e.target.value;
  // });
}
let isFullLoad = false;

const modeOp = document.querySelector("#modePop");
function modeOption() {
  modeOp.style.display = "flex";
  const list = [
    {
      icon: `
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="13"
                  r="8"
                  fill="currentColor"
                  fill-opacity="0.5"
                />
                <path
                  d="M12 13L12 8"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M20.3536 5.35355C20.5488 5.15829 20.5488 4.84171 20.3536 4.64645C20.1583 4.45118 19.8417 4.45118 19.6465 4.64645L20.3536 5.35355ZM18.8536 6.85355L20.3536 5.35355L19.6465 4.64645L18.1464 6.14645L18.8536 6.85355Z"
                  fill="#222222"
                />
                <path
                  d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>`,
      mode: "time",
      isSelect: true,
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-whole-word-icon lucide-whole-word"><circle cx="7" cy="12" r="3"/><path d="M10 9v6"/><circle cx="17" cy="12" r="3"/><path d="M14 7v8"/><path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1"/></svg>`,
      mode: "word",
      isSelect: false,
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote-icon lucide-quote"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>`,
      mode: "Qotes",
      isSelect: false,
    },
  ];
  const listOfMode = [...list];
  if (!isFullLoad) {
    isFullLoad = true;
    for (const [k, list] of Object.entries(listOfMode)) {
      const modeOption =
        createOptions("modeOption").lastElementChild.cloneNode(true);
      const modeInput =
        createOptions("modeOption").firstElementChild.cloneNode(true);
      modeOption.innerHTML = `${list.icon} ${list.mode}`;
      modeOption.setAttribute("for", k);
      modeInput.id = k;
      modeInput.setAttribute("value", list.mode);
      modeInput.setAttribute("checked", list.isSelect);
      modeOp.querySelector(".grid").appendChild(modeInput);
      modeOp.querySelector(".grid").appendChild(modeOption);
    }
  }
  const title = modeOp.querySelector("h3");
  title.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-puzzle-icon lucide-puzzle"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg> Mode`;
  document.body.appendChild(modeOp);
  modeOp.querySelector("span").addEventListener("click", () => {
    modeOp.style.display = "none";
  });
}

document
  .querySelector(".btn-language")
  .addEventListener("click", () => popOption());
document
  .querySelector(".btn-mode")
  ?.addEventListener("click", () => modeOption());
document.querySelector("button.btn-with").addEventListener("click", (e) => {
  console.log(e.target.textContent);
});
