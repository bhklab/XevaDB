import checkIfAnObject from '../../utils/CheckIfAnObject';

/**
 *
 * @param filter {Object} - filter object
 * @param row {Object} - current row
 * @returns {boolean|string} - returns if the filter value is present in row id data
 */
const tableFilter = (filter, row) => {
    // if there is no id then return an empty string
    if (!filter.id) return '';

    // regex to match the search value in the string
    // and return true if it matches
    const id = filter.pivotId || filter.id;
    const regex = new RegExp(filter.value, 'gi');

    const match = checkIfAnObject(row[id])
        ? row[id]?.name.match(regex)
        : row[id]?.match(regex);

    return !!match;
};

export default tableFilter;
