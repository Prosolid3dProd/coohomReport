export const createPushObject = (item, mcv = null) => ({
    name: item.displayName || item.name,
    value: parseFloat(item.value),
    description: item.description || null,
    nameValue:
        item.options?.length > 2
            ? item.optionValues?.[item.options?.indexOf(item.value)]?.name
            : undefined,
    mcv,
});

/**
 * Find a parameter by name in combined parameters and ignoreParameters
 * @param {array} parameters - Array of parameters
 * @param {array} ignoreParameters - Array of ignoreParameters
 * @param {string} paramName - Name of parameter to find
 * @returns {object|undefined}
 */
export const findParameter = (parameters, ignoreParameters, paramName) => {
    const allParams = [...(parameters || []), ...(ignoreParameters || [])];
    return allParams.find(
        p => p.name === paramName || p.name?.toUpperCase() === paramName.toUpperCase()
    );
};

/**
 * Get parameter value by name, with optional default
 * @param {array} parameters - Array of parameters
 * @param {array} ignoreParameters - Array of ignoreParameters
 * @param {string} paramName - Name of parameter
 * @param {*} defaultValue - Default value if not found
 * @returns {number|*}
 */
export const getParameterValue = (parameters, ignoreParameters, paramName, defaultValue = null) => {
    const param = findParameter(parameters, ignoreParameters, paramName);
    return param ? parseFloat(param.value) : defaultValue;
};
