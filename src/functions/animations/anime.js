import {
  createSpring,
  createTimeline,
  animate,
  stagger,
  waapi,
  svg,
} from "../../../node_modules/animejs/lib/anime.esm.js";

const focus = document.querySelector("type-game").querySelector("#focus");
const logo = animate(".anime-logo", {
  x: "2rem",
  easing: "easeInOutQuad",
});

const notification = animate(".anime-notification", {
  y: "12rem",
  easing: "easeInOutQuad",
});

const user = animate(".anime-user", {
  x: "-20rem",
  easing: "easeInOutQuad",
});

const footerRigth = animate(".anime-footer-right", {
  x: "-34rem",
  easing: "easeInOutQuad",
});

const footerLeft = animate(".anime-footer-left", {
  opacity: [0, 0.5, 1, 0.8, 1],
  translateX: "28rem",
  easing: "easeInOutQuad",
});

const aside = animate(".anime", {
  x: "18rem",
  easing: "easeInOutQuad",

  delay: stagger(50),
});
console.log(focus);

export const tl = createTimeline()
  .sync(user, 100)
  .sync(logo, 10)
  .sync(aside, 10)
  .sync(footerLeft, 10)
  .sync(notification, 10)
  .sync(footerRigth, 10);

document.addEventListener("DOMContentLoaded", () => {
  let clicked = false;
  if (focus) {
    focus.addEventListener("click", () => {
      clicked = true;
      tl.reverse().then(() => (clicked = false));
    });
  }
  if (document.querySelector("#game")) {
    const game = document.querySelector("#game");
    game.addEventListener("mouseleave", () => {
      if (clicked) tl.restart();
    });
  }
  document.querySelector("button.reset").addEventListener("click", () =>
    animate("#resetIcon", {
      rotateZ: "360deg",
      easing: "easeInOut",
      duration: 300,
      onComplete: (self) => self.reverse(),
    })
  );
});
