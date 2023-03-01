const isObject = (obj) => typeof obj === 'object' && obj !== null && !Array.isArray(obj);

export default isObject;
