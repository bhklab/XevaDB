const tableFilter = (filter, row) => {
    // if there is no id then return an empty string
    if (!filter.id) return '';

    const id = filter.pivotId || filter.id;
    const searchValue = filter.value;

    // regex to match the search value in the string
    // and return true if it matches
    const regex = new RegExp(`.*${searchValue}.*`, 'gi');
    if (row[id]?.match(regex)) return true;

    return false;
};

export default tableFilter;
