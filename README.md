# deep-observe-agent-proxy

使用 `Proxy` 实现对 `Object` 的深度观察,检测跟踪对象深层次的属性的变化的`javascript`小工具,可以检测到对象本来不存在的属性的添加,和已有属性的修改

# 安装方法

```powershell
yarn add https://github.com/masx200/deep-observe-agent-proxy.git
```

或者

```powershell
cnpm install  https://github.com/masx200/deep-observe-agent-proxy.git --save
```

# API

```typescript
function deepobserveagent(target: Object | Function, callback: Function): Proxy;

function callback(
  target: Object | Function,
  patharray: Array,
  newvalue: any,
  oldvalue: any
): void;
```

# 使用方法

```js
import deepobserveagent from "deep-observe-agent-proxy";
var a = [{ 0: "1111111a" }, 1, true, [{ bbbb: "ekkk" }, 10000]];
function callback(target, patharray, newvalue, oldvalue) {
  console.log(target, patharray, newvalue, oldvalue);
}
var observable = deepobserveagent(a, callback);
observable.qqqqq = {};
observable.push("11", []);
observable[0] = "hhhhhh";

observable.sort();

observable.reverse();
/*

(4) [{…}, 1, true, Array(2)]0: "hhhhhh"1: 12: true3: (2) [{…}, 10000]4: "11"5: []qqqqq: {}length: 6__proto__: Array(0) "qqqqq" {} undefined
(4) [{…}, 1, true, Array(2), qqqqq: {…}] "4" "11" undefined
 (5) [{…}, 1, true, Array(2), "11", qqqqq: {…}] "5" [] undefined
 (6) [{…}, 1, true, Array(2), "11", Array(0), qqqqq: {…}]0: "hhhhhh"1: 12: true3: (2) [{…}, 10000]4: "11"5: []qqqqq: {}length: 6__proto__: Array(0) "length" 6 6
 (6) [{…}, 1, true, Array(2), "11", Array(0), qqqqq: {…}]0: "hhhhhh"1: 12: true3: (2) [{…}, 10000]4: "11"5: []qqqqq: {}length: 6__proto__: Array(0) "0" "hhhhhh" {0: "1111111a"}

*/
```

# 关于 Proxy

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
