export function addClass(el, name) {
  if (el) {
    el.className += " " + name;
  }
}
export function removeClass(el, name) {
  if (el) {
    el.className = el.className.replace(name, "");
  }
}
