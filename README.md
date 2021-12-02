# 基于 Promises/A+规范手写 Promise

## 一、什么是 promise ？

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。

一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。Promise 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。

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

### 2.1.1 When pending, a promise:

    2.1.1. 当一个promise对象处于 pending 状态：

- 2.1.1.1 may transition to either the fulfilled or rejected state.

### 2.1.2 When fulfilled, a promise:

- 2.1.2.1 must not transition to any other state.
- 2.1.2.2 must have a value, which must not change.

### 2.1.3 When rejected, a promise:

- 2.1.3.1 must not transition to any other state.
- 2.1.3.2 must have a reason, which must not change.

```javascript
// 定义promise的三个状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function Promise(executor) {
  this.status = PENDING;
  this.value = "";
  this.reason = "";
  this.onFulfilled = []; //成功的回调
  this.onRejected = []; //失败的回调
  const resolve = (value) => {
    // 如果 resolve 的是 promise，则 new 出来的 promise 的状态由 resolve 参数中的 promise 决定
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
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
    // 则当前呢 new 的promsie对象的状态为 rejected，reason为报错的内容
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

### 2.2.1 Both onFulfilled and onRejected are optional arguments:

- 2.2.1.1 If onFulfilled is not a function, it must be ignored.
- 2.2.1.2 If onRejected is not a function, it must be ignored.

### 2.2.2 If onFulfilled is a function:

- 2.2.2.1 it must not be called before promise is fulfilled.
- 2.2.2.2 it must be called after promise is fulfilled, with promise’s value as its first argument.
- 2.2.2.3 it must not be called more than once.

### 2.2.3 If onRejected is a function,

- 2.2.3.1 it must be called after promise is rejected, with promise’s reason as its first argument.
- 2.2.3.2 it must not be called before promise is rejected.
- 2.2.3.3 it must not be called more than once.

### 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].

### 2.2.5 onFulfilled and onRejected must be called as functions (i.e. with no this value). [3.2]

### 2.2.6 then may be called multiple times on the same promise.

- 2.2.6.1 If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
- 2.2.6.2 If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.

### 2.2.7 then must return a promise [3.3].

```javascript
promise2 = promise1.then(onFulfilled, onRejected);
```

- 2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
- 2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
- 2.2.7.3 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
- 2.2.7.4 If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.

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
      // 处理resolve同步执行
      // queueMicrotask实现微任务
      queueMicrotask(() => {
        // try、catch捕获执行onFulfilled函数执行过程的错误
        try {
          let x = onFulfilled(this.value);
          //  then方法返回的promise对象的状态由回调函数的返回值决定
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
      // 处理resolve、reject异步执行
      // 思想：先把onFulilled函数存到数组中，当resolve函数异步执行时把数组中的元素（之前存的onFulfilled函数）执行
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

### 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.

### 2.3.2 If x is a promise, adopt its state [3.4]:

- 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
- 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
- 2.3.2.3 If/when x is rejected, reject promise with the same reason.

### 2.3.3 Otherwise, if x is an object or function,

- 2.3.3.1 Let then be x.then. [3.5]
- 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
- 2.3.3.3 If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
  - 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
  - 2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
  - 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
  - 2.3.3.3.4 If calling then throws an exception e,
    - 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
    - 2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
- 2.3.3.4 If then is not a function, fulfill promise with x.

### 2.3.4 If x is not an object or function, fulfill promise with x.

```javascript
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    // 防止进入死循环
    reject(new TypeError("Chaining cycle"));
  }

  if (x instanceof MPromise) {
    // 可忽略，因为 promise 就是 thenable
    x.then(
      (y) => {
        resolvePromise(promise, y, resolve, reject);
      },
      (error) => {
        reject(error);
      }
    );
  } else if ((x && typeof x === "object") || typeof x === "function") {
    let used;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (used) return;
            used = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (used) return;
            used = true;
            reject(r);
          }
        );
      } else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (e) {
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

### 正向思维

- Promise 构造函数中回调函数的函数参数(resolve, reject)和函数参数(resolve, reject)的参数 决定 执行 then(first)方法的第一个还是第二个回调函数
- then(first)方法中被执行的回调函数的返回值 决定 then(first)方法返回的 promise 的状态
- then(first)方法返回的 promise 的状态 决定 执行 then(other)方法的第一个还是第二个回调函数

### 测试

- npm 有一个 promises-aplus-tests 插件 npm i promises-aplus-tests -g 可以全局安装 mac 用户最前面加上 sudo

- 命令行 promises-aplus-tests [js 文件名] 即可验证

```javascript
// 目前是通过他测试 他会测试一个对象
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
```

## 五、补充

### Promise.resolve()

#### 1. 参数是一个 Promise 实例

- 如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改，原封不动地返回这个实例

#### 2. 参数是一个 thenable 对象

- Promise.resolve 方法会将这个对象转为 Promise 对象，然后立即执行 thenable 对象地 then 方法

#### 3. 参数不是具有 then 方法地对象或根本不是对象

- 如果参数是一个原始值，或者是一个不具有 then 方法地对象，那么 Promise.resolve 方法返回一个新的 Promise 对象，状态为 fulfilled

#### 4. 不带有任何参数

- Promise.resolve 方法允许在调用时不带有参数，而直接返回一个 fulfilled 状态的 Promise 对象

```javascript
Promise.resolve = function (param) {
  if (param instanceof Promise) {
    return param;
  }
  return new Promise((resolve, reject) => {
    if (
      param &&
      typeof param === "object" &&
      typeof param.then === "function"
    ) {
      setTimeout(() => {
        param.then(resolve, reject);
      });
    } else {
      resolve(param);
    }
  });
};
```

### Promise.reject()

#### 1. Promise.reject()方法的参数会原封不动地作为 reject 的理由变成后续方法的参数。这一点与 Promise.resolve 方法不一致

```javascript
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
```

### Promise.prototype.catch()

#### 1. Promise.prototype.catch 方法是 .then(null, rejection) 的别名，用于指定发生错误时的回调函数

#### 2. catch 方法返回的还是一个 Promise 对象，因此后面还可以接着调用 then 方法

```javascript
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

### Promise.prototype.finally()

#### 1. finally 方法用于指定不管 Promise 对象最后状态如何都会执行的操作

```javascript
Promise.prototype.finally = function (callback) {
  return this.then(
    (value) => {
      return Promise.resolve(callback()).then(() => {
        return value;
      });
    },
    (err) => {
      return Promise.resolve(callback()).then(() => {
        throw err;
      });
    }
  );
};
```

### Promise.all()

```javascript
var p = Promise.all([p1, p2, p3]);
```

#### 1. 上面的代码中，Promise.all 方法接受一个数组作为参数，p1、p2、p3 都是 Promise 对象的实例；如果不是，就会先调用 Promise.resolve 方法，将参数转为 Promsie 实例，再进一步处理（Promise.all 方法的参数不一定是数组，但是必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例）

#### 2. Promise.all 方法用于将多个 Promise 实例包装成一个新的 Promsie 实例（发送多个异步请求，对请求结果做统一处理）

#### 3. p 的状态由 p1、p2、p3 决定，分成两种情况

- 只有 p1、p2、p3 的状态都变为 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数
- 只要 p1、p2、p3 中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 rejected 的实例的返回值会传递给 p 的回调函数

```javascript
Promise.all = function (promises) {
  promises = Array.from(promises); //将可迭代对象或伪数组转换为数组
  return new Promise((resolve, reject) => {
    let index = 0;
    let result = [];
    if (promises.length === 0) {
      resolve(result);
    } else {
      function processValue(i, data) {
        result[i] = data;
        if (++index === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        //promises[i] 可能是普通值
        Promise.resolve(promises[i]).then(
          (data) => {
            processValue(i, data);
          },
          (err) => {
            reject(err);
            return;
          }
        );
      }
    }
  });
};
```

### Promise.race()

```javascript
var p = Promise.race([p1, p2, p3]);
```

#### 1. 上面的代码中，只要 p1、p2、p3 中有一个实例率先改变状态，p 的状态就根治改变。那个率先改变的 Promise 实例的返回值就传递给 p 的回调函数。Promise.race 方法的参数与 Promise.all 方法一样，如果不是 Promise 实例，就会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再进一步处理

#### 2. Promise.race 方法用于对异步任务做时间控制

```javascript
Promise.race = function (promises) {
  promises = Array.from(promises); //将可迭代对象或伪数组转换为数组
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      return;
    } else {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (data) => {
            resolve(data);
            return;
          },
          (err) => {
            reject(err);
            return;
          }
        );
      }
    }
  });
};
```

## 六、问题与反思

1. 调用 resolve 方法，promise 内部的状态就一定变成 fulfilled 么
   resolve 函数的参数是一个 promise 会怎么处理
2. 调用 reject 方法，promise 内部的状态就一定变成 rejected 么
   reject 函数的参数是一个 promise 会怎么处理
3. promise 和 thenable 的区别
4. 调用 Promise.resolve 方法返回的 promise 的状态一定是 fulfilled 么
5. 调用 Promise.reject 方法返回的 promise 的状态一定是 rejected 么

```javascript
// then 的参数不是函数
let p1 = new Promise((resolve, reject) => {
  resolve("1");
});
console.log(p1.then(2, 4));
p1.then(2, 4).then(
  (value) => {
    console.log("value", value);
  },
  (reason) => {
    console.log("reason", reason);
  }
);
```

```javascript
// resolve 的参数是一个 promise
new Promise((resolve, reject) => {
  resolve(
    new Promise((resolve, reject) => {
      resolve("success");
    })
  );
});
new Promise((resolve, reject) => {
  resolve(
    new Promise((resolve, reject) => {
      reject("fail");
    })
  );
});
```

```javascript
// Promise.resolve 的参数是一个 promise
console.log(
  Promise.resolve(
    new Promise((resolve, reject) => {
      reject("err");
    })
  )
);
```

## 七、参考资料

《ES6 标准入门（第 3 版）》

https://promisesaplus.com/

https://www.ituring.com.cn/article/66566

https://www.cnblogs.com/sugar-tomato/p/11353546.html

https://github.com/YvetteLau/Blog/issues/2

...
