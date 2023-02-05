/**
 * @param {string} input - input string
 * @returns {string} - updated string with spaces and plus symbol removed
 */
const removePlusCharacterAndSpace = (input) => input.replaceAll(' ', '').replaceAll('+', '');

export default removePlusCharacterAndSpace;
