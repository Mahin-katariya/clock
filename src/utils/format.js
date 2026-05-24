/**
 * Formats a total number of seconds into "hh:mm:ss".
 * @param {number} s - total seconds
 * @returns {string}
 */
export function fmt(s) {
  return [
    Math.floor(s / 3600),
    Math.floor((s % 3600) / 60),
    s % 60,
  ]
    .map(x => String(x).padStart(2, '0'))
    .join(':')
}
