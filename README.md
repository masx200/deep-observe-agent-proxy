# deep-observe-agent-proxy

使用 `Proxy` 实现对 `Object` 的深度观察,检测跟踪对象深层次的属性的变化的`javascript`小工具

```powershell
yarn add https://github.com/masx200/deep-observe-agent-proxy.git
```

```js
import deepobserveagent from "deep-observe-agent-proxy";
var a = [{ 0: "1111111a" }, 1, true, [{ bbbb: "ekkk" }, 10000]];
function callback(t, k, v) {
  console.log(t, k, v);
}
var observable = deepobserveagent(a, callback);
observable.qqqqq = {};
observable.push("11", []);
```
