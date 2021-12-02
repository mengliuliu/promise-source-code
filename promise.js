const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MPromise(executor) {
  this.state = PENDING;
  this.value = "";
  this.reason = "";
  this.onFulfilled = [];
  this.onRejected = [];
  const resolve = (value) => {
    if (value instanceof MPromise) {
      value.then(resolve, reject);
    }
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilled.forEach((fn) => {
        fn();
      });
    }
  };
  const reject = (reason) => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejected.forEach((fn) => {
        fn();
      });
    }
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MPromise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function"
      ? onFulfilled
      : (value) => {
          return value;
        };
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
          //   return value;
        };

  let promise2 = new MPromise((resolve, reject) => {
    if (this.state === FULFILLED) {
      queueMicrotask(() => {
        try {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.state === REJECTED) {
      queueMicrotask(() => {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.state === PENDING) {
      this.onFulfilled.push(() => {
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      this.onRejected.push(() => {
        queueMicrotask(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });
  return promise2;
};

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError("err"));
  }
  if (x instanceof MPromise) {
    x.then(
      (y) => {
        resolvePromise(promise, y, resolve, reject);
      },
      (error) => {
        reject(error);
      }
    );
  } else if ((x !== null && typeof x === "object") || typeof x === "function") {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

MPromise.defer = MPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

module.exports = MPromise;
