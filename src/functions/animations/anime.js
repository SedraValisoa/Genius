import {
  createSpring,
  createTimeline,
  stagger,
  waapi,
} from "../../../node_modules/animejs/lib/anime.esm.js";

document.addEventListener("DOMContentLoaded", () => {
  const logo = waapi.animate(".anime-logo", {
    x: "20rem",
  });
  const notification = waapi.animate(".anime-notification", {
    y: "14rem",
  });
  const user = waapi.animate(".anime-user", {
    x: "-18rem",
  });
  const footer = waapi.animate(".anime-footer", {
    x: "-18rem",
  });
  const aside = waapi.animate(".anime", {
    x: "18rem",
    ease: createSpring({ stiffness: 25, damping: 5 }),
    delay: stagger(200),
  });
  const tl = createTimeline()
    .sync(logo, 0)
    .sync(aside, 120)
    .sync(user, 200)
    .sync(notification, 250)
    .sync(footer, 400);
  // document.addEventListener("click", () => tl.reverse());
});
