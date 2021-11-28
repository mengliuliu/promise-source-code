// import Promise from "./promise.js";
// const Promise = require("./promise");
// let obj = {
//   // then: (resolve, reject) => {
//   //   console.log(this);
//   // },
//   then: function (resolve, reject) {
//     console.log(this);
//     // console.log(l);
//     // resolve();
//     // reject();
//   },
// };
// obj.then();
// console.log('外面的this', this)

// console.log(
//   Promise.resolve(
//     // new Promise((resolve, reject) => {
//     //   reject("err");
//     // })
//   )
// );

// new Promise((resolve, reject) => {
//   resolve("1");
// })
//   .finally(() => {
//     console.log("finally");
//     return 2;
//   })
//   .then(
//     (value) => {
//       console.log("value", value);
//     },
//     (reason) => {
//       console.log("reason", reason);
//     }
//   );

// let p1 = new Promise((resolve, reject) => {
//   resolve("1");
// });
// console.log(p1.then(2, 4)); // Promise { <pending> }
// let p2 = p1.then(2, 4);
// setTimeout(() => {
//   console.log(p2);
// });
// p1.then(2, 4).then(
//   (value) => {
//     console.log("value", value);
//   },
//   (reason) => {
//     console.log("reason", reason);
//   }
// );

// new Promise((resolve, reject) => {
//   console.log(l);
//   resolve(1);
// }).then(
//   (value) => {
//     console.log("value", value);
//   },
//   (reason) => {
//     console.log("reason", reason);
//   }
// );

console.log(
  new Promise((resolve, reject) => {
    reject(
      new Promise((resolve, reject) => {
        // resolve(1);
        reject("err");
      })
    );
  })
);
