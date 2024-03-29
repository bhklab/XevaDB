/**
 * replaces '.' '+' and '\s' characters with empty string
 * @param {string} input - input string
 * @returns {string} - updated string with spaces and plus symbol removed
 */
const removeSomeSpecialCharacters = (input) => {
    const re = new RegExp(/\.|\+|\s/, 'g');
    return input.replaceAll(re, '');
};

export default removeSomeSpecialCharacters;
