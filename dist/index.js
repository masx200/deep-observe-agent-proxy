const Reflect = window.Reflect;
const { ownKeys, deleteProperty, apply, construct, defineProperty, get, getOwnPropertyDescriptor, getPrototypeOf, has, set, setPrototypeOf } = Reflect;
function isobject(a) {
    return typeof a === "object" && a !== null;
}
function isfunction(a) {
    return typeof a === "function";
}
function deepobserveaddpath(target, callback, patharray = [], ancestor = target) {
    if (typeof callback !== "function") {
        throw Error("observe callback invalid !");
    }
    if (isfunction(target) || isobject(target)) {
        let fakeobj;
        if (isobject(target)) {
            fakeobj = {};
        }
        else {
            fakeobj = () => { };
        }
        setPrototypeOf(fakeobj, null);
        return (fakeobj => {
            return new Proxy(fakeobj, {
                defineProperty(t, p, a) {
                    return defineProperty(target, p, a);
                },
                deleteProperty(t, p) {
                    callback(ancestor, [...patharray, p], undefined, get(target, p));
                    return deleteProperty(target, p);
                },
                ownKeys() {
                    return ownKeys(target);
                },
                has(t, p) {
                    return has(target, p);
                },
                getPrototypeOf() {
                    return getPrototypeOf(target);
                },
                setPrototypeOf(t, v) {
                    return setPrototypeOf(target, v);
                },
                construct(t, argumentslist) {
                    if (typeof target === "function") {
                        return construct(target, argumentslist);
                    }
                },
                apply(t, thisarg, argarray) {
                    if (typeof target === "function") {
                        return apply(target, thisarg, argarray);
                    }
                },
                getOwnPropertyDescriptor(t, k) {
                    var descripter = getOwnPropertyDescriptor(target, k);
                    if (descripter) {
                        descripter.configurable = true;
                        return descripter;
                    }
                    else {
                        return;
                    }
                },
                set(t, k, v) {
                    if (typeof callback === "function") {
                        callback(ancestor, [...patharray, k], v, get(target, k));
                    }
                    return set(target, k, v);
                },
                get(t, k) {
                    var value = get(target, k);
                    if (isfunction(value) || isobject(value)) {
                        return deepobserveaddpath(value, callback, [...patharray, k], target);
                    }
                    else {
                        return value;
                    }
                }
            });
        })(fakeobj);
    }
    else {
        return target;
    }
}
function observedeepagent(target, callback) {
    if (typeof callback !== "function") {
        throw Error("observe callback  invalid function ");
    }
    if (typeof Proxy !== "function") {
        throw Error("Proxy unsupported!");
    }
    if (isfunction(target) || isobject(target)) {
        return deepobserveaddpath(target, callback, [], target);
    }
    else {
        return target;
    }
}

export default observedeepagent;
//# sourceMappingURL=index.js.map
