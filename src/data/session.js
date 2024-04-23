/**
 *
 *
 * @param {string} text --
 * @return {*} 
 */
const getValue = (text) => {
    return JSON.parse(sessionStorage.getItem(`input${text}`))
}

/**
 *
 *
 * @param {String} text
 * @param {Array} data
 */
const setValue = (text, data) => {
    sessionStorage.setItem(`input${text}`, JSON.stringify(data))
}

export {
    getValue,
    setValue
}