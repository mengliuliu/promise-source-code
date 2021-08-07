// var Promise = require("./promiseInternet.js");
import Promise from './promise.js'

new Promise((resolve, reject) => {
  resolve(
    new Promise((resolve, reject) => {
      reject("error");
    })
  );
}).then(
  (value) => {
    console.log("value: ", value);
  },
  (reason) => {
    console.log("reason: ", reason);
  }
);
