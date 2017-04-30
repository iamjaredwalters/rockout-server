const sum = (a, b) => {
    return a + b;
};

const canSpread = (obj) => {
    if (Array.isArray(obj)) {
        return [...obj, 3];
    }

    return { ...obj, test: 2 };
    // return Object.assign({}, obj, { test: 2 });
};

export default sum;
export { canSpread };
