interface Callback<T extends object | Function | any[]> {
    (target: T, patharray: Array<string>, newvalue: any, oldvalue: any): void;
}
export default function observedeepagent<T extends object | Function | any[]>(target: T, callback: Callback<T>): T;
export {};
