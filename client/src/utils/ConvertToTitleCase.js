/* eslint-disable max-len */
/**
 * @param {string} string - Takes string as an input (eg. adrenal gland).
 * @param {string} splitBy - second agrument is to split the string by. (eg '_', adernal_gland)
 * @returns {string} - returns a transformed string with the first letter capitalized for each word in the string(Title Case, eg. Adrenal Gland).
 */
const convertToTitleCase = (string = '', splitBy = ' ') => {
    if (typeof (string) !== 'string') {
        return new Error('Enter a valid string!!');
    }

    const capitalString = string.split(splitBy).map((str) => {
        if (str === 'and') {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    return capitalString.join(' ');
};

export default convertToTitleCase;
