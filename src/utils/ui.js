export const breakPointMD = 768;

export const breakpoint = (width, point) => {
    return width < point;
};

export const typeOfText = (bool, text, icon) => {
    return bool ? text : icon;
};
