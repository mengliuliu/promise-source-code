const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function Promise(executor) {
  this.status = PENDING;
  this.onFulfilled = []; //成功的回调
  this.onRejected = []; //失败的回调
  //PromiseA+ 2.1
  const resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      this.onFulfilled.forEach((fn) => fn()); //PromiseA+ 2.2.6.1
    }
  };

  const reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      this.onRejected.forEach((fn) => fn()); //PromiseA+ 2.2.6.2
    }
  };

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
          // return reason;
        };
  //PromiseA+ 2.2.7
  let promise2 = new Promise((resolve, reject) => {
    if (this.status === FULFILLED) {
      //PromiseA+ 2.2.2
      //PromiseA+ 2.2.4 --- queueMicrotask
      queueMicrotask(() => {
        try {
          //PromiseA+ 2.2.7.1
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          //PromiseA+ 2.2.7.2
          reject(e);
        }
      });
    } else if (this.status === REJECTED) {
      //PromiseA+ 2.2.3
      queueMicrotask(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    } else if (this.status === PENDING) {
      this.onFulfilled.push(() => {
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
      this.onRejected.push(() => {
        queueMicrotask(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  });
  return promise2;
};

function resolvePromise(promise2, x, resolve, reject) {
  //PromiseA+ 2.3.1
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle"));
  }
  if (x instanceof Promise) {
    
  } else if ((x && typeof x === "object") || typeof x === "function") {
    let used; //PromiseA+2.3.3.3.3 只能调用一次
    try {
      let then = x.then;
      if (typeof then === "function") {
        //PromiseA+2.3.3
        then.call(
          x,
          (y) => {
            //PromiseA+2.3.3.1
            if (used) return;
            used = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            //PromiseA+2.3.3.2
            if (used) return;
            used = true;
            reject(r);
          }
        );
      } else {
        //PromiseA+2.3.3.4
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (e) {
      //PromiseA+ 2.3.3.2
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    //PromiseA+ 2.3.3.4
    resolve(x);
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = Promise;
// export default Promise;
