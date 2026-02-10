import { CONFIG } from "../constants";

/**
 * Check if a string contains a substring (case-insensitive)
 * @param {string} str - The string to search in
 * @param {string} substring - The substring to search for
 * @returns {boolean}
 */
export const includesIgnoreCase = (str, substring) => {
    return String(str).toLocaleUpperCase().includes(substring.toLocaleUpperCase());
};

/**
 * Get first N characters of a string
 * @param {string} str - The string to get prefix from
 * @param {number} length - Number of characters to get (default: 2)
 * @returns {string}
 */
export const getPrefix = (str, length = 2) => {
    return String(str).trim().substring(0, length);
};

/**
 * Check if custom code starts with a specific prefix
 * @param {object} item - Object with customCode property
 * @param {string} prefix - The prefix to check
 * @returns {boolean}
 */
export const hasCustomCodePrefix = (item, prefix) => {
    return getPrefix(item.customCode) === prefix;
};

/**
 * Check if a material/model name is valid (not undefined and doesn't contain invalid terms)
 * @param {string} name - The name to validate
 * @returns {boolean}
 */
export const isValidMaterialName = (name) => {
    if (!name || name === "undefined") return false;
    const invalidTerms = ["Cajon", "Gaveta", "Sola", "Mural", "Corte"];
    return !invalidTerms.some(term => includesIgnoreCase(name, term));
};

/**
 * Check if model name or brand name contains "CASCO" (case-insensitive)
 * @param {object} item - Object with modelName and modelBrandGoodName properties
 * @returns {boolean}
 */
export const isCasco = (item) => {
    return (
        includesIgnoreCase(item.modelName || "", "CASCO") ||
        includesIgnoreCase(item.modelBrandGoodName || "", "CASCO")
    );
};

/**
 * Check if model brand name needs perfil (PURA, GP, or MONTEA)
 * @param {string} modelBrandGoodName
 * @returns {boolean}
 */
export const needsPerfil = (modelBrandGoodName) => {
    const keywords = ["PURA", "GP", "MONTEA"];
    return keywords.some(keyword => includesIgnoreCase(modelBrandGoodName, keyword));
};
