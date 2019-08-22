"use strict";
function isvalidobject(a) {
  return (
    (a instanceof Object && typeof a === "object") || typeof a === "function"
  );
}
export default function observedeepagent(target, callback) {
  if (typeof Proxy !== "function") {
    setTimeout(() => {
      throw Error("不支持Proxy!");
    }, 0);
    return target;
  } else {
    if (isvalidobject(target)) {
      return new Proxy(target, {
        set(t, k, v) {
          callback(t, k, v);

          Reflect.set(t, k, v);
          return true;
        },
        get(t, k) {
          var value = Reflect.get(t, k);
          if (isvalidobject(value)) {
            return observedeepagent(value, callback);
          }
          return value;
        }
      });
    } else {
      return target;
    }
  }
}
