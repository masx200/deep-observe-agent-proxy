const Setprototype = Set.prototype;
const Mapprototype = Map.prototype;
function ispromise(a) {
    return a instanceof Promise;
}
function isdate(a) {
    return a instanceof Date;
}
function isregexp(a) {
    return a instanceof RegExp;
}
function isMap(a) {
    return a instanceof Map;
}
function isSet(a) {
    return a instanceof Set;
}
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
    if (ispromise(target) || isregexp(target) || isdate(target)) {
        return target;
    }
    if (isfunction(target) || isobject(target)) {
        let fakeobj;
        if (isSet(target)) {
            fakeobj = new Set([...target]);
            set(fakeobj, "add", (value) => {
                Setprototype.add.call(target, value);
                callback(ancestor, patharray, undefined, undefined);
                return Setprototype.add.call(fakeobj, value);
            });
            set(fakeobj, "delete", (value) => {
                Setprototype.delete.call(target, value);
                callback(ancestor, patharray, undefined, undefined);
                return Setprototype.delete.call(fakeobj, value);
            });
            set(fakeobj, "clear", () => {
                Setprototype.clear.call(target);
                callback(ancestor, patharray, undefined, undefined);
                return Setprototype.clear.call(fakeobj);
            });
        }
        else if (isMap(target)) {
            fakeobj = new Map([...target]);
            set(fakeobj, "clear", () => {
                Mapprototype.clear.call(target);
                callback(ancestor, patharray, undefined, undefined);
                return Mapprototype.clear.call(fakeobj);
            });
            set(fakeobj, "set", (key, value) => {
                Mapprototype.set.call(target, key, value);
                callback(ancestor, patharray, undefined, undefined);
                return Mapprototype.set.call(fakeobj, key, value);
            });
            set(fakeobj, "delete", (value) => {
                Mapprototype.delete.call(target, value);
                callback(ancestor, patharray, undefined, undefined);
                return Mapprototype.delete.call(fakeobj, value);
            });
        }
        else if (isArray(target)) {
            fakeobj = [];
        }
        else if (isfunction(target)) {
            fakeobj = (() => { });
        }
        else {
            fakeobj = {};
        }
        if (!isSet(target) && !isMap(target)) {
            setPrototypeOf(fakeobj, null);
        }
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
                if (isfunction(value) && (isSet(target) || isMap(target))) {
                    return get(fakeobj, k).bind(fakeobj);
                }
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
