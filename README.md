# deep-observe-agent-proxy

使用 `Proxy` 实现对 `Object` 的深度观察,检测跟踪对象深层次的属性的变化的`javascript`小工具,可以检测到对象本来不存在的属性的添加,和已有属性的修改

# 安装方法

```powershell
yarn add https://github.com/masx200/deep-observe-agent-proxy.git
```

# 使用方法

```js
import deepobserveagent from "deep-observe-agent-proxy";
var a = [{ 0: "1111111a" }, 1, true, [{ bbbb: "ekkk" }, 10000]];
function callback(target, key, newvalue, oldvalue) {
  console.log(target, key, newvalue, oldvalue);
}
var observable = deepobserveagent(a, callback);
observable.qqqqq = {};
observable.push("11", []);
observable[0] = "hhhhhh";
```

# 关于 Proxy

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
