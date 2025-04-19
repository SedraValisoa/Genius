/**
 * Creer des drapeaux pour chaque pays
 * @param {string} code
 */
export function isoToEmoji(code) {
  let countryCode = (code) =>
    String.fromCodePoint(
      ...[...code.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt())
    );
  return countryCode(code);
}
