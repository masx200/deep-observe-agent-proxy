import deepobserveagent from "../dist/index.js";
console.dir(deepobserveagent);
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

const testset = deepobserveagent(new Set(), console.log);
const testmap = deepobserveagent(new Map(), console.log);
console.log([testset, testmap]);
testset.add(1111);
testmap.set(1111, "22222");
testset.clear();
testmap.clear();
