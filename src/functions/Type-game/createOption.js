/**
 *
 * @param {string} id
 * @returns {DocumentFragment}
 */

export function createOptions(id) {
  return document.getElementById(id).content.cloneNode(true);
}
