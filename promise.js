const Pending = "pending";
const Fulfilled = "fulfilled";
const Rejected = "rejected";

function MPromise(executor) {
  this.state = Pending;
  this.value = "";
  this.reason = "";
  this.fulfilledArr = [];
  this.rejectedArr = [];
  const resolve = (value) => {
    if (value instanceof MPromise) {
      return value.then(resolve, reject);
    }
    if (this.state === Pending) {
      this.state = Fulfilled;
      this.value = value;
      this.fulfilledArr.forEach((arr) => {
        arr();
      });
    }
  };
  const reject = (reason) => {
    if (this.state === Pending) {
      this.state = Rejected;
      this.reason = reason;
      this.rejectedArr.forEach((arr) => {
        arr();
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
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;

  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };

  let p2 = new MPromise((resolve, reject) => {
    try {
      if (this.state === Fulfilled) {
        queueMicrotask(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(p2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.state === Rejected) {
        queueMicrotask(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(p2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.state === Pending) {
        this.fulfilledArr.push(() => {
          queueMicrotask(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(p2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });

        this.rejectedArr.push(() => {
          queueMicrotask(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(p2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    } catch (error) {
      reject(error);
    }
  });
  return p2;
};

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    reject(new TypeError("Chaining cycle"));
  }
  if ((x !== null && typeof x === "object") || typeof x === "function") {
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

// console.log(
//   new MPromise((resolve, reject) => {
//     resolve(
//       new MPromise((resolve, reject) => {
//         resolve("success");
//       })
//     );
//   })
// );
// console.log(
//   new Promise((resolve, reject) => {
//     // resolve("success");
//     resolve(
//       new Promise((resolve, reject) => {
//         resolve("success");
//       })
//     );
//     // console.log(l);
//   })
// );
