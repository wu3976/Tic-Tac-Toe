/**
 * See the position of first occurance of an element in an array.
 * @param arr The array being evaluated
 * @param entry The target entry
 * @return {number} position of first occurance, or -1 if not found.
 */
const positionOf = (arr, entry) => {
    for (let i = 0; i < arr.length; i++){
        if (arr[i] === entry){
            return i;
        }
    }
    return -1;
}

/**
 * See if an object contains a specified key.
 * @param obj The object
 * @param key The key
 * @return {boolean} True if obj contains key in its keys, or false otherwise.
 */
const containsKey = (obj, key) => {
    return positionOf(Object.keys(obj), key) >= 0;
}

/**
 * Clear response's cookies with key in key_arr
 * @param res The response.
 * @param key_arr The array of cookies being cleaned. Type: ARRAY
 */
const clearCookies = (res, key_arr) => {
    for (let ele of key_arr){
        res.clearCookie(ele);
    }
}

/**
 * Check query parameter to prevent SQL injection.
 * @param param The parameter being checked.
 * @return {boolean|boolean} If param is safe, return true, else return false;
 */
const checkMalparam = (param) => {
    param = param.toLowerCase();
    let malChar = [" ", "=", "#"]
    for (let ele of malChar){
        if (param.indexOf(ele) >= 0){
            return false;
        }
    }
    return true;
}

const generateAccessCode = (maxAccessCode) => {
    return (Math.floor(MAX_ACCESS_CODE * Math.random())).toString();
}

module.exports = {
    containsKey : containsKey,
    positionOf : positionOf,
    clearCookies : clearCookies,
    checkMalparam : checkMalparam,
    generateAccessCode : generateAccessCode
}