/**
 * 
 * @param {string} input - input string
 * @returns {string} - returns a string with the first alphabet of the string changes to upperCase
 */
const firstAlphabetUpperCase = (input = '') => {
    console.log(input);
    if (input.trim()) {
        return input.charAt(0).toUpperCase() + input.slice(1,);
    } else {
        return Error('Please provide a valid input string!');
    }
};

export default firstAlphabetUpperCase;
