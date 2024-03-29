/**
 *
 * @param {string} input - input string
 * @returns {string} - returns a string with the first alphabet of the string changes to upperCase
 */
const firstAlphabetUpperCase = (input = '') => {
    if (input && input.trim()) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
    return '';
};

export default firstAlphabetUpperCase;
