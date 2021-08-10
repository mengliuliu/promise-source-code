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
