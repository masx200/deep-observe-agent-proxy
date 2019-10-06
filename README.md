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
interface Callback<T extends object | Function | any[]> {
  (target: T, patharray: Array<string>, newvalue: any, oldvalue: any): void;
}
function observedeepagent<T extends object | Function | any[]>(
  target: T,
  callback: Callback<T>
): T;
```

# 使用方法

```js
import deepobserveagent from "deep-observe-agent-proxy";
var a = [{ 0: "1111111a" }, 1, true, [{ bbbb: "ekkk" }, 10000]];
function callback(target, patharray, newvalue, oldvalue) {
  console.log({
    target,
    patharray,
    newvalue,
    oldvalue
  });
}
var observable = deepobserveagent(a, callback);
observable.qqqqq = {};
observable.push("11", []);
observable[1] = "hhhhhh";

observable.sort();

observable.reverse();

observable.qqqqq.wwww = 2947992;
observable.bbbbbbbbbb = "qqqqqqqqqaaaa";
Reflect.deleteProperty(observable, "bbbbbbbbbb");
```

# 关于 Proxy

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
