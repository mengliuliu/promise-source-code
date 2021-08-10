// import Promise from "./promise.js";
// const Promise = require("./promise");
var promise1 = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve(1);
  //   // reject("error");
  // });
  // resolve("1");
  resolve(
    new Promise((resolve, reject) => {
      reject("返回一个promise error");
    })
  );
});
var promise2 = promise1.then(
  (value1) => {
    console.log("value1", value1);
    // return new Promise((resolve, reject) => {
    //   resolve("返回一个promise");
    //   // resolve(
    //   //   new Promise((resolve, reject) => {
    //   //     reject("返回一个promise error");
    //   //   })
    //   // );
    //   // reject("返回一个promise error");
    // });
    // return ''
    // return 3
    // return function() {}
    // return {
    //   then: function (resolve, reject) {
    //     // resolve('obj中的then方法')
    //     reject('obj中的then方法， error')
    //   },
    // };
  },
  (reason1) => {
    console.log("reason1", reason1);
  }
);
// promise2.then(
//   (value2) => {
//     console.log("value2", value2);
//   },
//   (reason2) => {
//     console.log("reason2", reason2);
//   }
// );

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
getURL("http://httpbin.org/get").then(
  function onFulfilled(value) {
    console.log(value);
    return getURL(`http://xxxxx/get${value}`);
  },
  function onRejected(error) {
    console.log(error);
  }
);

function getURL(url, resolve, reject) {
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
}
getURL(
  "http://httpbin.org/get",
  (value) => {
    console.log("请求成功：", value);
  },
  (reason) => {
    console.log("请求失败：", reason);
  }
);
