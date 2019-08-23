"use strict";
function isvalidobject(a) {
  return (
    (a instanceof Object && typeof a === "object") || typeof a === "function"
  );
}
export default function observedeepagent(target, callback) {
  if (typeof callback !== "function") {
    //throw Error("callback not defined!");
    // setTimeout(() => {
    throw Error("observe callback is invalid");
    // }, 0);

    // callback(t, k, v);
  }
  if (typeof Proxy !== "function") {
    setTimeout(() => {
      throw Error("不支持Proxy!");
    }, 0);
    return target;
  } else {
    if (isvalidobject(target)) {
      //

      return (() => {
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

        const forkobj = target;
        return new Proxy(forkobj, {
          /* TypeError: 'get' on proxy: property 'prototype' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '[object Symbol]' but got '[object Object]') */
          // getOwnPropertyDescriptor(t, k) {
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
              callback(t, k, v, t[k]);
            }

            Reflect.set(t, k, v);
            return true;
          },

          /* 
            https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
            如果违背了以下的约束，proxy会抛出 TypeError:
    
    如果要访问的目标属性是不可写以及不可配置的，则返回的值必须与该目标属性的值相同。
    如果要访问的目标属性没有配置访问方法，即get方法是undefined的，则返回值必须为undefined。 */
          get(t, k, r) {
            // console.log("get", [t, k]);
            var value = Reflect.get(t, k, r);
            if (isvalidobject(value)) {
              var descripter = Reflect.getOwnPropertyDescriptor(t, k);
              /* descripter  可能是undefined */
              if (
                descripter &&
                descripter.writable === false &&
                descripter.configurable === false
              ) {
                console.warn(
                  `无法代理此属性!\n如果要访问的目标属性是不可写以及不可配置的，\n则返回的值必须与该目标属性的值相同。\n`,
                  [t, k, value]
                );
                return value;
              } else {
                return observedeepagent(value, callback);
              }
            }
            return value;
          }
        });
      })();
    } else {
      return target;
    }
  }
}
