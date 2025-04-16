import {
  createSpring,
  createTimeline,
  animate,
  stagger,
  waapi,
} from "../../../node_modules/animejs/lib/anime.esm.js";

document.addEventListener("DOMContentLoaded", () => {
  const logo = waapi.animate(".anime-logo", {
    x: "2rem",
  });
  const notification = waapi.animate(".anime-notification", {
    y: "12rem",
  });
  const user = waapi.animate(".anime-user", {
    x: "-20rem",
  });
  const footerRigth = waapi.animate(".anime-footer-right", {
    x: "-34rem",
    ease: createSpring({ stiffness: 25, damping: 5 }),
  });
  const footerLeft = waapi.animate(".anime-footer-left", {
    opacity: [0, 0.5, 1, 0.8, 1],
    translateX: "28rem",
    scale: ["0", "0.3", "1.5", "1"],
    translateY: ["1rem", "-2rem", "-5rem", "-3rem", "0rem"],
    ease: createSpring({ stiffness: 25, damping: 5 }),
  });
  const aside = waapi.animate(".anime", {
    x: "18rem",
    ease: createSpring({ stiffness: 25, damping: 5 }),
    delay: stagger(50),
  });

  const tl = createTimeline()
    .sync(logo, 0)
    .sync(aside, 10)
    .sync(user, 140)
    .sync(notification, 160)
    .sync(footerRigth, 200)
    .sync(footerLeft, 180);

  document.getElementById("focus").addEventListener("click", () => {
    tl.reverse();
    //   const hideBtn = waapi.animate(".btn-remove", {
    //     opacity: "0",
    //     delay: stagger(100),
    //   });
    //   const rmBtn = waapi.animate(".btn-remove", {
    //     display: "none",
    //     delay: stagger(100),
    //   });
    //   const hideLevel = waapi.animate(".level", {
    //     opacity: "0",
    //     delay: stagger(100),
    //   });
    //   const rmLevel = waapi.animate(".level", {
    //     display: "none",
    //     delay: stagger(100),
    //   });
    //   const tl2 = createTimeline()
    //     .sync(hideBtn, 0)
    //     .sync(rmBtn, 140)
    //     .sync(hideLevel, 120)
    //     .sync(rmLevel, 180);
  });
});
