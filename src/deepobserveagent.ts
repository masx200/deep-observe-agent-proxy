function isArray(a: any) {
  return Array.isArray(a);
}
"use strict";
const Reflect = window.Reflect;
const {
  ownKeys,
  deleteProperty,
  apply,
  construct,
  defineProperty,
  get,
  getOwnPropertyDescriptor,
  getPrototypeOf,
  has,

  set,
  setPrototypeOf
} = Reflect;
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
interface Callback {
  (
    target: object | Function,
    patharray: Array<any>,
    newvalue: any,
    oldvalue: any
  ): void;
}
function deepobserveaddpath(
  target: object | Function,
  callback: Callback,
  patharray: Array<any> = [],
  ancestor: object | Function = target
): object | Function {
  if (
!
isfunction(callback)

//typeof callback !== "function"

) {
console.error(callback)
console.error("observe callback invalid !")
throw Error();
   
    //throw Error("callback not defined!");
    // setTimeout(() => {
     // }, 0);

    // callback(t, k, v);
  }
  if (isfunction(target) || isobject(target)) {
    //

    let fakeobj: object | Function;
    if (isArray(target)) {
      fakeobj = [];
      /* VM462:1 Uncaught TypeError: 'getOwnPropertyDescriptor' on proxy: trap returned descriptor for property 'length' that is incompatible with the existing property in the proxy target
    at Function.getOwnPropertyDescriptors (<anonymous>)
    at <anonymous>:1:8 */
    } else if (isfunction(target)) {
      fakeobj = () => {};
    } else {
      fakeobj = {};
    }
    setPrototypeOf(fakeobj, null);
    return (fakeobj => {
      // function createfork(target) {
      //   var noneobj;
      //   if (typeof target === "function") {
      //     noneobj = function() {};
      //   } else if (typeof target === "object") {
      //     noneobj = {};
      //   }
      //   setPrototypeOf(noneobj, null);
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

      // const fakeobj = Object.create(null);
      return new Proxy(fakeobj, {
        defineProperty(t, p, a) {
          return defineProperty(target, p, a);
        },
        deleteProperty(t, p) {
          callback(
            ancestor,
            [...patharray, p],
            undefined,
            get(target, p)

            //target[p]
          );
          return deleteProperty(target, p);
        },
        ownKeys(/*  t*/) {
          return ownKeys(target);
        },
        has(t, p) {
          return has(target, p);
        },
        getPrototypeOf(/* t */) {
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
        /* TypeError: 'get' on proxy: property 'prototype' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '[object Symbol]' but got '[object Object]') */
        getOwnPropertyDescriptor(t, k) {
          var descripter = getOwnPropertyDescriptor(target, k);
          if (isArray(target) && k === "length") {
            return descripter;
          } else {
            if (descripter) {
              descripter.configurable = true;
              return descripter;
            } else {
              return;
            }
          }
        },
        //   return {
        //     ...getOwnPropertyDescriptor(t, k),
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
              get(target, k)
              // target[k]
            );
          }

          return set(target, k, v);
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
          var value = get(target, k);
          if (isfunction(value) || isobject(value)) {
            // var descripter = getOwnPropertyDescriptor(t, k);
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
    })(fakeobj);
  } else {
    return target;
  }
}
export default function observedeepagent(
  target: object | Function,
  callback: Callback
): object | Function {
  if (
!
isfunction(callback)
//typeof callback !== "function"

) {
console.error(callback)
console.error("observe callback  invalid function !")
throw Error();
 
    //throw Error("callback not defined!");
    // setTimeout(() => {
       // }, 0);

    // callback(t, k, v);
  }
  if (
!
isfunction(Proxy)
//typeof Proxy !== "function"

) {
console.error("Proxy unsupported!")
throw Error();

    //setTimeout(() => {
    
    // }, 0);
    // return target;
  }

  // else
  if (isfunction(target) || isobject(target)) {
    return deepobserveaddpath(target, callback/*, [], target*/);
  } else {
    return target;
  }
}
