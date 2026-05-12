const breakPointMD = 768;

const breakpoint = (width, max) => width >= max;

const typeOfText = (size, text, Icon) => (size ? text : Icon);

export { breakPointMD, breakpoint, typeOfText };