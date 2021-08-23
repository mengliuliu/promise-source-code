// import Promise from "./promise.js";
// new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log("resolve");
//     resolve(1);
//   });
// }).then(
//   (value) => {
//     console.log("异步value: ", value);
//   },
//   () => {}
// );
// console.log("同步");

// import Promise from "./promiseInternet.js";

// new Promise((resolve, reject) => {
//   resolve(1);
// })
//   .then(
//     (value) => {
//       console.log("value: ", value);
//       return new Promise((resolve, reject) => {
//         // resolve(
//         //   new Promise((resolve, reject) => {
//         //     reject("reject");
//         //   })
//         // );
//         reject(
//           new Promise((resolve, reject) => {
//             resolve("resolve");
//           })
//         );
//       });
//     },
//     () => {}
//   )
//   .then(
//     (value) => {
//       console.log("value1: ", value);
//     },
//     (reason) => {
//       console.log("reason1: ", reason);
//     }
//   );

// import Promise from "./promiseInternet.js";

// 需要注意 then 方法第一和第二个回调函数的返回值
// 因为第一第二个回调函数的返回值决定 then 方法返回的promise的状态

// then方法的第二个回调函数的返回值

// new Promise((resolve, reject) => {
//   reject("reject");
// })
//   .then(
//     (value1) => {
//       console.log("value1: ", value1);
//       return new Promise((resolve, reject) => {
//         // resolve("return fulfilled");
//         reject("return rejected");
//       });
//     },
//     (reason1) => {
//       //   console.log("reason1: ", reason1);
//       //   return new Promise((resolve, reject) => {
//       //     resolve("return fulfilled");
//       //     // reject("return rejected");
//       //   });
//     }
//   )
//   .then(
//     (value2) => {
//       console.log("value2: ", value2);
//     },
//     (reason2) => {
//       console.log("reason2: ", reason2);
//     }
//   );

// console.log(
//   Promise.resolve(
//     new Promise((resolve, reject) => {
//       //   resolve("resolve");
//       reject("reject");
//     })
//   )
// );

// import Promise from "./promiseInternet.js";
// new Promise((resolve, reject) => {
//   //   resolve("resolve");
//   reject("reject");
// })
//   .then()
//   .then(
//     (value) => {
//       console.log("value: ", value);
//     },
//     (reason) => {
//       console.log("reason: ", reason);
//     }
//   );

// import Promise from "./promiseInternet.js";
new Promise((resolve, reject) => {
  resolve("resolve");
  // reject("reject");
})
  .then(
    (value) => {
      console.log("value: ", value);
    },
    (reason) => {
      console.log("reason: ", reason);
    }
  );
