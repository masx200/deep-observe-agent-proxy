function isArray(a) {
    return Array.isArray(a);
}
const Reflect = window.Reflect;
const { ownKeys, deleteProperty, apply, construct, defineProperty, get, getOwnPropertyDescriptor, getPrototypeOf, has, set, setPrototypeOf } = Reflect;
function isobject(a) {
    return typeof a === "object" && a !== null;
}
function isfunction(a) {
    return typeof a === "function";
}
function deepobserveaddpath(target, callback, patharray = [], ancestor = target) {
    if (!isfunction(callback)) {
        console.error(callback);
        console.error("observe callback invalid !");
        throw Error();
    }
    if (isfunction(target) || isobject(target)) {
        let fakeobj;
        if (isArray(target)) {
            fakeobj = [];
        }
        else if (isfunction(target)) {
            fakeobj = (() => { });
        }
        else {
            fakeobj = {};
        }
        setPrototypeOf(fakeobj, null);
        return new Proxy(fakeobj, {
            defineProperty(t, p, a) {
                callback(ancestor, [...patharray, String(p)], has(a, "value") ? a.value : isfunction(a.get) ? a.get() : undefined, get(target, p));
                return defineProperty(target, p, a);
            },
            deleteProperty(t, p) {
                callback(ancestor, [...patharray, String(p)], undefined, get(target, p));
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
                if (isfunction(target)) {
                    return construct(target, argumentslist);
                }
            },
            apply(t, thisarg, argarray) {
                if (isfunction(target)) {
                    return apply(target, thisarg, argarray);
                }
            },
            getOwnPropertyDescriptor(t, k) {
                var descripter = getOwnPropertyDescriptor(target, k);
                if (isArray(target) && k === "length") {
                    return descripter;
                }
                else {
                    if (descripter) {
                        descripter.configurable = true;
                        return descripter;
                    }
                    else {
                        return;
                    }
                }
            },
            set(t, k, v) {
                if (isfunction(callback)) {
                    callback(ancestor, [...patharray, String(k)], v, get(target, k));
                }
                return set(target, k, v);
            },
            get(t, k) {
                var value = get(target, k);
                if (isfunction(value) || isobject(value)) {
                    return deepobserveaddpath(value, callback, [...patharray, String(k)], target);
                }
                else {
                    return value;
                }
            }
        });
    }
    else {
        return target;
    }
}
function observedeepagent(target, callback) {
    if (!isfunction(callback)) {
        console.error(callback);
        console.error("observe callback  invalid function !");
        throw Error();
    }
    if (!isfunction(Proxy)) {
        console.error("Proxy unsupported!");
        throw Error();
    }
    if (isfunction(target) || isobject(target)) {
        return deepobserveaddpath(target, callback);
    }
    else {
        return target;
    }
}

export default observedeepagent;
//# sourceMappingURL=index.js.map
