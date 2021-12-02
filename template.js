// Promise 常规写法
new Promise((resolve, reject) => {
  resolve("data");
}).then(
  (value) => {
    console.log("value: ", value);
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);

// new Promise 时有错误
new Promise((resolve, reject) => {
  console.log(l);
  resolve("data");
}).then(
  (value) => {
    console.log("value: ", value);
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);

// resolve 函数异步执行
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("data");
  });
}).then(
  (value) => {
    console.log("value: ", value);
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);

// 同一个 promise 的 then 方法被调用多次
let p = new Promise((resolve, reject) => {
  resolve("data");
});
p.then(
  (value) => {
    // 某些处理
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);
p.then(
  (value) => {
    // 另一些处理
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);

// then 方法中的回调函数返回一个 thenable 对象
new Promise((resolve, reject) => {
  resolve("data");
}).then(
  (value) => {
    console.log("value: ", value);
    return {
      then: function (resolvePromise, rejectPromise) {
        resolvePromise("success");
      },
    };
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);

// resolvePromise、rejectPromise 回调函数最多执行一次
new Promise((resolve, reject) => {
  resolve("data");
}).then(
  (value) => {
    console.log("value: ", value);
    return {
      then: function (resolvePromise, rejectPromise) {
        console.log(l); // ReferenceError: l is not defined
        resolvePromise("success");
        rejectPromise("error");
      },
    };
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);

// then 方法不是一个函数
new Promise((resolve, reject) => {
  resolve("1");
}).then(2, 4);
console.log(
  new Promise((resolve, reject) => {
    resolve("1");
  }).then(2, 4)
);

// resolve 方法的参数是一个 promise
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

// reject 方法的参数是一个 promise
new Promise((resolve, reject) => {
  reject(
    new Promise((resolve, reject) => {
      resolve("success");
    })
  );
});
new Promise((resolve, reject) => {
  reject(
    new Promise((resolve, reject) => {
      reject("fail");
    })
  );
});
