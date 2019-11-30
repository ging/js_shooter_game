const _ = require("underscore");
const path = require("path");

const TestUtils = {};

const REG_URL = /(\b(http|ftp|https|ftps):\/\/[-A-ZáéíóúÁÉÍÓÚ0-9+&@#\/%?=~_|!:,.;]*[-A-ZáéíóúÁÉÍÓÚ0-9+&@#\/%=~_|])/ig;

TestUtils.getURL = (string) => {
    const urls = string.match(REG_URL);
    let url = null;
    if (urls instanceof Array) {
        url = urls[0];
    }
    return url;
};

TestUtils.exists = (thing) => {
    return !_.isUndefined(thing) && !_.isNull(thing);
};

TestUtils.isString = (thing) => {
    return _.isString(thing);
};

TestUtils.isObject = (thing) => {
    return _.isObject(thing);
};

TestUtils.isNumber = (thing) => {
    let number = false;
    if (TestUtils.exists(thing)) {
        number = typeof parseInt(thing) === "number";
    }
    return number
};

TestUtils.isArray = (thing) => {
    return _.isArray(thing);
};

TestUtils.isURL = (thing) => {
    if (TestUtils.isString(thing)) {
        return REG_URL.test(thing);
    }
};

TestUtils.isRegExp = (thing) => {
    return (thing instanceof RegExp);
};

TestUtils.isJSON = (thing) => {
    try {
        JSON.parse(thing);
        return true;
    } catch (e) {
        return false;
    }
};

TestUtils.search = (b, a) => {
    if (TestUtils.isRegExp(b)) {
        if (TestUtils.isString(a) && a.length > 0) {
            return b.test(a);
        } else {
            return false;
        }
    } else {
        if (TestUtils.isArray(a)) {
            let result = false;
            for (let item in a) {
                if (TestUtils.search(b, a[item])) {
                    result = true;
                }
            }
            return result;
        } else {
            if (TestUtils.isString(a.toString())) {
                return (a.toString().toLowerCase().indexOf(b.toLowerCase()) > -1);
            }
        }
    }
};

module.exports = TestUtils;
