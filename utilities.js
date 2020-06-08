/*This module contains some utility methods*/

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
    let malChar = [" ", "=", "#", "\"", "\'"]
    for (let ele of malChar){
        if (param.indexOf(ele) >= 0){
            return false;
        }
    }
    return true;
}

/**
 * Check if an account meet the requirements.
 * @param account The account string passed in.
 * @param min_length Minimum account length allowed.
 * @param requirement_arr length 3 array: [min_digit_count, min_upperCaseLetter_count, min_lowerCaseLetter_count]
 * @return {boolean} whether the account string meet the length and requirements,
 * and does not contains dangerous characters. (meet === true)
 */
const checkValidAccount = (account, min_length, requirement_arr) => {
    if (!checkMalparam(account) || account.length < min_length){
        return false;
    } else {
        let upperCount = 0;
        let lowerCount = 0;
        let digitCount = 0;
        for (let i = 0; i < account.length; i++){
            if (account[i] >= 'a' && account[i] <= 'z'){
                lowerCount++;
            }
            if (account[i] >= 'A' && account[i] <= 'Z'){
                upperCount++;
            }
            if (account[i] >= '0' && account[i] <= '9'){
                digitCount++;
            }
        }
        return digitCount >= requirement_arr[0]
            && upperCount >= requirement_arr[1] && lowerCount >= requirement_arr[2]
    }
}

/**
 * Generate a random access code, which would be used to identify client's identity
 * @param maxAccessCode Maximum access code
 * @return {string} A number string of access code.
 */
const generateAccessCode = (maxAccessCode) => {
    return (Math.floor(MAX_ACCESS_CODE * Math.random())).toString();
}

/**
 * Check if a contact information is valid.
 * @param contactInfo The contact information passed in.
 * @return {boolean|boolean} true if contactInfo seems to be a valid email or phone.
 * False otherwise.
 */
const checkValidContactInfo = (contactInfo) => {
    let indexOfAt = contactInfo.indexOf('@');
    if (indexOfAt >= 0){ // email
        let head = contactInfo.substring(0, indexOfAt);
        let tail = contactInfo.sub(indexOfAt + 1, contactInfo.length);
        return checkValidAccount(head, 1, [0, 0, 0])
                && checkValidAccount(tail, 1, [0, 0, 0]);
    } else { // phone
        if (contactInfo.indexOf('(') >= 0 !== (contactInfo.indexOf(')') >= 0)){
            return false;
        }
        let judge = true;
        for (let i = 0; i < contactInfo.length && judge; i++){
            if (!(contactInfo[i] >= 'a' && contactInfo[i] <= 'z')
                    && !(contactInfo[i] >= 'A' && contactInfo[i] <= 'Z')
                    && !(contactInfo[i] >= '0' && contactInfo[i] <= '9')
                    && (contactInfo[i] !== '(') && (contactInfo[i] !== ')')){
                judge = false;
            }
        }
        return judge && (contactInfo.length >= 7 || contactInfo.length === 0);
    }
}


module.exports = {
    containsKey : containsKey,
    positionOf : positionOf,
    clearCookies : clearCookies,
    checkMalparam : checkMalparam,
    generateAccessCode : generateAccessCode,
    checkValidAcctOrPwd : checkValidAccount,
    checkValidContactInfo : checkValidContactInfo
}
