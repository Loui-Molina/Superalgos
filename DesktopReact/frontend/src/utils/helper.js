/*** returns if all the fields in an object are null, undefined or blank*/
const isObjectEmpty = (obj) => Object.values(obj).every(value => value === null || value === void 0 || value === '');


/*** removes empty or null fields from an object*/
const cleanObject = (obj) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => (v !== null || v !== void 0) && v !== ''));

/*** validates files uploaded are not bigger than the limit in MB*/
const validateFileSize = (file, limit) => file.size <= (1024000) * limit;


export {
    isObjectEmpty,
    cleanObject,
    validateFileSize
}
