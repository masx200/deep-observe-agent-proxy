import deepobserveagent from "../dist/index.js";
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

console.log(Array.from(observable));

console.log(JSON.parse(JSON.stringify(observable)));
