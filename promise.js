const PEDNING = "PENGING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function Promise(executor) {
  this.state = PEDNING;
  this.value = "";
  this.reason = "";
  this.onFulfilledCallbackArr = [];
  this.onRejectededCallbackArr = [];

  // 调用 resolve 函数改变内部状态和内部执行值
  const resolve = (value) => {
    // resolve函数的作用是
    // 1. 把参数传递给 then 的第一个回调函数（通过把参数赋值给实例对象的属性）
    // 2. 执行 then 的第一个回调函数（通过状态改变）
    if (this.state === PEDNING) {
      this.state = FULFILLED;
      this.value = value;
      // 异步执行 onFulfilled
      this.onFulfilledCallbackArr.forEach((fn) => {
        fn();
      });
    }
  };
  const reject = (reason) => {
    if (this.state === PEDNING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectededCallbackArr.forEach((fn) => {
        fn();
      });
    }
  };

  executor(resolve, reject);
}
// 调用resolve方法，promise内部的状态就一定变成 fulfilled 么

// 正向思维
// Promise构造函数中的回调函数 决定 执行then(first)方法的第一个还是第二个回调函数
// then(first)方法中被执行的回调函数的返回值 决定 then(first)方法返回的promise的状态变化
// then(first)方法返回的promise的状态 决定 执行then(other)方法的第一个还是第二个回调函数

// 逆向思维
// then(first)方法执行第一个或者第二个回调函数 是由 Promise构造函数中的回调函数决定的
// then(other)方法执行第一个或者第二个回调函数 是由 上一个then方法中执行的回调函数的返回值决定的
Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    if (this.state === PEDNING) {
      this.onFulfilledCallbackArr.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectededCallbackArr.push(() => {
        onRejected(this.reason);
      });
    }
    if (this.state === FULFILLED) {
      // 同步执行 onFulfilled
      onFulfilled(this.value);
    }
    if (this.state === REJECTED) {
      onRejected(this.reason);
    }


    
  });
};

export default Promise;
// module.exports = Promise;
