const filtrar = (index) => index !== 0

const getLabels = () => document.querySelectorAll("label");

const labelsValues = (condicion = (label) => label.innerText || 'Empty') => {
        const labels = getLabels()
        return Object.values(labels)
                .filter((_label, i) => filtrar(i))
                .map(condicion)

}

const getInputs = () => document.querySelectorAll("input");

const inputsValues = (condicion = (input) => input.value || 'Empty') => {
        const inputs = getInputs()
        return Object.values(inputs)
                .filter((_input, i) => filtrar(i))
                .map(condicion)
}

export {
        labelsValues,
        inputsValues
}
