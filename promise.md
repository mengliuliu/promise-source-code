## 一、什么是 promise ？

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。

一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。Promise 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。

一个 Promise 必然处于以下几种状态之一：

- 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（fulfilled）: 意味着操作成功完成。
- 已拒绝（rejected）: 意味着操作失败。

```javascript
// 回调函数形式
function getURL(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.onload = function () {
    if (req.status === 200) {
      callback(null, req.responseText);
    } else {
      callback(req.statusText, req.responseText);
    }
  };
  req.onerror = function () {
    reject(new Error(req.statusText));
  };
  req.send();
}
// 运行示例
getURL("http://httpbin.org/get", (error, res) => {
  if (error) {
    console.log("errpr", error);
  } else {
    getURL(`http://xxxxx/get${res.data.params}`, (error1, res1) => {
      if (error1) {
        console.log("errpr1", error1);
      } else {
          // setState(res1.data)
          console.log(res1);
        });
      }
    });
  }
});
```

```javascript
// promise形式
function getURL(url) {
  return (promise = new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = function () {
      if (req.status === 200) {
        resolve(req.responseText);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(new Error(req.statusText));
    };
    req.send();
  }));
}
// 运行示例
getURL("http://httpbin.org/get")
  .then((res) => {
    console.log(res);
    return getURL(`http://xxxxx/get${res.data.params}`);
  })
  .then((res) => {
    // setState(res.data)
    console.log(res);
  })
  .catch((reason) => {
    console.log(reason);
  });
```

## 二、Promise 构造函数

A promise must be in one of three states: pending, fulfilled, or rejected.

### When pending, a promise:

- may transition to either the fulfilled or rejected state.

### When fulfilled, a promise:

- must not transition to any other state.
- must have a value, which must not change.

### When rejected, a promise:

- must not transition to any other state.
- must have a reason, which must not change.

```javascript
// 定义promise的三个状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function Promise(executor) {
  this.status = PENDING;
  this.onFulfilled = []; //成功的回调
  this.onRejected = []; //失败的回调
  const resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      this.onFulfilled.forEach((fn) => fn()); // 处理resolve函数异步执行
    }
  };
  const reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      this.onRejected.forEach((fn) => fn());
    }
  };
  try {
    // 如果Promise构造函数中的参数(回调函数)在执行过程中报错，
    // 则当前呢 new 的promsie对象的状态为 rejected，据因为报错的内容
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
```

## 三、then 回调函数

A promise must provide a then method to access its current or eventual value or reason.
A promise’s then method accepts two arguments:

```javascript
promise.then(onFulfilled, onRejected);
```

### Both onFulfilled and onRejected are optional arguments:

If onFulfilled is not a function, it must be ignored.
If onRejected is not a function, it must be ignored.

### If onFulfilled is a function:

- it must not be called before promise is fulfilled.
- it must be called after promise is fulfilled, with promise’s value as its first argument.
- it must not be called more than once.

### If onRejected is a function,

- it must be called after promise is rejected, with promise’s reason as its first argument.
- it must not be called before promise is rejected.
- it must not be called more than once.

### onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].

### onFulfilled and onRejected must be called as functions (i.e. with no this value). [3.2]

### then may be called multiple times on the same promise.

- If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
- If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.

### then must return a promise [3.3].

```javascript
promise2 = promise1.then(onFulfilled, onRejected);
```

- If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
- If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
- If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
- If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
          // return reason;
        };
  let promise2 = new Promise((resolve, reject) => {
    if (this.status === FULFILLED) {
      queueMicrotask(() => {
        try {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    } else if (this.status === REJECTED) {
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
```

## 四、resolvePromise 函数

## 五、问题反思

参考文档：https://promisesaplus.com/

https://www.ituring.com.cn/article/66566

https://www.cnblogs.com/sugar-tomato/p/11353546.html

https://github.com/YvetteLau/Blog/issues/2
