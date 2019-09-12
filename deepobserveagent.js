"use strict";
function isobject(a) {
    return typeof a === "object" && a !== null;
}
function isfunction(a) {
    return typeof a === "function";
}
function deepobserveaddpath(target, callback, patharray = [], ancestor = target) {
    if (typeof callback !== "function") {
        throw Error("observe callback is not valid function !");
    }
    if (isfunction(target) || isobject(target)) {
        let forkobj;
        if (isobject(target)) {
            forkobj = {};
        }
        else {
            forkobj = () => { };
        }
        Reflect.setPrototypeOf(forkobj, null);
        return (forkobj => {
            return new Proxy(forkobj, {
                defineProperty(t, p, a) {
                    return Reflect.defineProperty(target, p, a);
                },
                deleteProperty(t, p) {
                    callback(ancestor, [...patharray, p], undefined, Reflect.get(target, p));
                    return Reflect.deleteProperty(target, p);
                },
                ownKeys() {
                    return Reflect.ownKeys(target);
                },
                has(t, p) {
                    return Reflect.has(target, p);
                },
                getPrototypeOf() {
                    return Reflect.getPrototypeOf(target);
                },
                setPrototypeOf(t, v) {
                    return Reflect.setPrototypeOf(target, v);
                },
                construct(t, argumentslist) {
                    if (typeof target === "function") {
                        return Reflect.construct(target, argumentslist);
                    }
                },
                apply(t, thisarg, argarray) {
                    if (typeof target === "function") {
                        return Reflect.apply(target, thisarg, argarray);
                    }
                },
                getOwnPropertyDescriptor(t, k) {
                    var descripter = Reflect.getOwnPropertyDescriptor(target, k);
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
                        callback(ancestor, [...patharray, k], v, Reflect.get(target, k));
                    }
                    return Reflect.set(target, k, v);
                },
                get(t, k) {
                    var value = Reflect.get(target, k);
                    if (isfunction(value) || isobject(value)) {
                        return deepobserveaddpath(value, callback, [...patharray, k], target);
                    }
                    else {
                        return value;
                    }
                }
            });
        })(forkobj);
    }
    else {
        return target;
    }
}
export default function observedeepagent(target, callback) {
    if (typeof callback !== "function") {
        throw Error("observe callback is not valid function !");
    }
    if (typeof Proxy !== "function") {
        setTimeout(() => {
            throw Error("不支持Proxy!");
        }, 0);
        return target;
    }
    if (isfunction(target) || isobject(target)) {
        return deepobserveaddpath(target, callback, [], target);
    }
    else {
        return target;
    }
}
//# sourceMappingURL=deepobserveagent.js.map