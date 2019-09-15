"use strict";
const Reflect = window.Reflect;
function isobject(a: any): boolean {
  return typeof a === "object" && a !== null;
}
function isfunction(a: any): boolean {
  return typeof a === "function";
}
/* API
function deepobserveagent(target: Object | Function, callback: callback): any;

interface callback {
  (
    target: Object | Function,
    patharray: Array<any>,
    newvalue: any,
    oldvalue: any
  ): void;
}

*/
interface callback {
  (
    target: Object | Function,
    patharray: Array<any>,
    newvalue: any,
    oldvalue: any
  ): void;
}
function deepobserveaddpath(
  target: Object | Function,
  callback: callback,
  patharray: Array<any> = [],
  ancestor: Object | Function = target
): Object | Function {
  if (typeof callback !== "function") {
    //throw Error("callback not defined!");
    // setTimeout(() => {
    throw Error("observe callback invalid !");
    // }, 0);

    // callback(t, k, v);
  }
  if (isfunction(target) || isobject(target)) {
    //

    let forkobj: Object | Function;
    if (isobject(target)) {
      forkobj = {};
    } else {
      forkobj = () => {};
    }
    Reflect.setPrototypeOf(forkobj, null);
    return (forkobj => {
      // function createfork(target) {
      //   var noneobj;
      //   if (typeof target === "function") {
      //     noneobj = function() {};
      //   } else if (typeof target === "object") {
      //     noneobj = {};
      //   }
      //   Reflect.setPrototypeOf(noneobj, null);
      //   if (noneobj.prototype) {
      //     noneobj.prototype = null;
      //   }
      //   const forkhandler = {};
      //   [
      //     "defineProperty",
      //     "deleteProperty",
      //     "apply",
      //     "construct",
      //     "get",
      //     "getOwnPropertyDescriptor",
      //     "getPrototypeOf",
      //     "has",
      //     "isExtensible",
      //     "ownKeys",
      //     "preventExtensions",
      //     "set",
      //     "setPrototypeOf"
      //   ].forEach(key => {
      //     forkhandler[key] = function(...args) {
      //       args[0] = target;
      //       return Reflect[key](...args);
      //     };
      //   });
      //   return new Proxy(noneobj, forkhandler);
      // }

      // const forkobj = Object.create(null);
      return new Proxy(forkobj, {
        defineProperty(t, p, a) {
          return Reflect.defineProperty(target, p, a);
        },
        deleteProperty(t, p) {
          callback(
            ancestor,
            [...patharray, p],
            undefined,
            Reflect.get(target, p)

            //target[p]
          );
          return Reflect.deleteProperty(target, p);
        },
        ownKeys(/*  t*/) {
          return Reflect.ownKeys(target);
        },
        has(t, p) {
          return Reflect.has(target, p);
        },
        getPrototypeOf(/* t */) {
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
        /* TypeError: 'get' on proxy: property 'prototype' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '[object Symbol]' but got '[object Object]') */
        getOwnPropertyDescriptor(t, k) {
          var descripter = Reflect.getOwnPropertyDescriptor(target, k);
          if (descripter) {
            descripter.configurable = true;
            return descripter;
          } else {
            return;
          }
        },
        //   return {
        //     ...Reflect.getOwnPropertyDescriptor(t, k),
        //     ...{ configurable: true, writable: true }
        //   };
        // },

        /* 
          https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
          如果下列不变量被违反，代理将抛出一个 TypeError：
  
  getOwnPropertyDescriptor 必须返回一个 object 或 undefined。
  如果属性作为目标对象的不可配置的属性存在，则该属性无法报告为不存在。
  如果属性作为目标对象的属性存在，并且目标对象不可扩展，则该属性无法报告为不存在。
  如果属性不存在作为目标对象的属性，并且目标对象不可扩展，则不能将其报告为存在。
  属性不能被报告为不可配置，如果它不作为目标对象的自身属性存在，或者作为目标对象的可配置的属性存在。
  Object.getOwnPropertyDescriptor（target）的结果可以使用 Object.defineProperty 应用于目标对象，也不会抛出异常。 */

        /* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set
  
  如果违背以下的约束条件，proxy会抛出一个TypeError:
  
  若目标属性是不可写及不可配置的，则不能改变它的值。
  如果目标属性没有配置存储方法，即set方法是undefined的，则不能设置它的值。
  在严格模式下，若set方法返回false，则会抛出一个 TypeError 异常。
  */
        set(t, k, v) {
          // console.log("set", [t, k, v]);
          if (typeof callback === "function") {
            //throw Error("callback not defined!");
            callback(
              ancestor,
              [...patharray, k] /* patharray.concat(k) */,
              v,
              Reflect.get(target, k)
              // target[k]
            );
          }

          return Reflect.set(target, k, v);
          // return true;
          /* Uncaught TypeError: 'set' on proxy: trap returned truish for property 'prototype' which exists in the proxy target as a non-configurable and non-writable data property with a different value */
        },

        /* 
          https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
          如果违背了以下的约束，proxy会抛出 TypeError:
  
  如果要访问的目标属性是不可写以及不可配置的，则返回的值必须与该目标属性的值相同。
  如果要访问的目标属性没有配置访问方法，即get方法是undefined的，则返回值必须为undefined。 */
        get(t, k) {
          // console.log("get", [t, k]);
          var value = Reflect.get(target, k);
          if (isfunction(value) || isobject(value)) {
            // var descripter = Reflect.getOwnPropertyDescriptor(t, k);
            // /* descripter  可能是undefined */
            // if (
            //   descripter &&
            //   descripter.writable === false &&
            //   descripter.configurable === false
            // ) {
            //   console.warn(
            //     `无法代理此属性!\n如果要访问的目标属性是不可写以及不可配置的，\n则返回的值必须与该目标属性的值相同。\n`,
            //     [t, k, value]
            //   );
            //   return value;
            // } else {
            return deepobserveaddpath(
              value,
              callback,
              [...patharray, k],
              //  patharray.concat(k),
              target
            );
            // }
          } else {
            return value;
          }
        }
      });
    })(forkobj);
  } else {
    return target;
  }
}
export default function observedeepagent(
  target: Object | Function,
  callback: callback
): Object | Function {
  if (typeof callback !== "function") {
    //throw Error("callback not defined!");
    // setTimeout(() => {
    throw Error("observe callback is not valid function !");
    // }, 0);

    // callback(t, k, v);
  }
  if (typeof Proxy !== "function") {
    setTimeout(() => {
      throw Error("Proxy unsupported!");
    }, 0);
    return target;
  }

  // else
  if (isfunction(target) || isobject(target)) {
    return deepobserveaddpath(target, callback, [], target);
  } else {
    return target;
  }
}
