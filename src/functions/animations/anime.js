import {
  createSpring,
  createTimeline,
  animate,
  stagger,
  waapi,
  svg,
} from "../../../node_modules/animejs/lib/anime.esm.js";

document.addEventListener("DOMContentLoaded", () => {
  const logo = animate(".anime-logo", {
    x: "2rem",
    easing: "easeInOutQuad",
    duration: 300,
  });

  const notification = animate(".anime-notification", {
    y: "12rem",
    easing: "easeInOutQuad",
    duration: 300,
  });

  const user = animate(".anime-user", {
    x: "-20rem",
    easing: "easeInOutQuad",
    duration: 300,
  });

  const footerRigth = animate(".anime-footer-right", {
    x: "-34rem",
    easing: "easeInOutQuad",
    duration: 300,
  });

  const footerLeft = animate(".anime-footer-left", {
    opacity: [0, 0.5, 1, 0.8, 1],
    translateX: "28rem",
    easing: "easeInOutQuad",
    duration: 300,
  });

  const aside = animate(".anime", {
    x: "18rem",
    easing: "easeInOutQuad",
    duration: 100,
    delay: stagger(50),
  });

  const tl = createTimeline({
    delay: 10,
  })
    .sync(user, 100)
    .sync(logo, 10)
    .sync(aside, 10)
    .sync(footerLeft, 10)
    .sync(notification, 10)
    .sync(footerRigth, 10);
  let clicked = false;
  document.getElementById("focus").addEventListener("click", () => {
    clicked = true;
    tl.reverse().then(() => (clicked = false));
  });
  document
    .getElementById("game")
    .addEventListener("mouseleave", () => (clicked ? tl.restart() : null));
});
