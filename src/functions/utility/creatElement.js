/**
 *  creer un element Html
 * @param {HTMLElement} tag
 * @param {Object} attrs
 * @returns {HTMLElement}
 */

export function createElement(tag, attrs = {}) {
  const element = document.createElement(tag);
  for (const [attribute, value] of Object.entries(attrs)) {
    if (attribute !== null && value !== null) {
      element.setAttribute(attribute, value);
    }
  }
  return element;
}
