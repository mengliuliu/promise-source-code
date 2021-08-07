// Promise.all([
//   new Promise((resolve, reject) => {
//     resolve("success1");
//   }),
//   new Promise((resolve, reject) => {
//     // resolve("success2");
//     // reject("error1");
//   }),
// ]).then(
//   (res) => {
//     console.log("res: ", res);
//   },
//   (reason) => {
//     console.log("reason: ", reason);
//   }
// );

// new Promise((resolve, reject) => {
//   //   resolve("success");
//   resolve(
//     new Promise((resolve, reject) => {
//       // resolve("success2");
//       reject("error");
//     })
//   );
// }).then(
//   (value) => {
//     console.log("value: ", value);
//   },
//   (reason) => {
//     console.log("reason: ", reason);
//   }
// );

var thenable = {
  then: function (resolve, reject) {
    // reject("error");
    resolve("value");
  },
};
function ThenFunc() {}
ThenFunc.then = function (resolve, reject) {
//   reject("error");
  resolve('value')
};

new Promise((resolve, reject) => {
  //   resolve("success");
//   resolve(thenable);
  resolve(ThenFunc);
}).then(
  (value) => {
    console.log("value: ", value);
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);
