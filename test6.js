// require("./promiseInternet");
import Promise from './promiseInternet.js'
new Promise((resolve, reject) => {
  resolve(1);
}).then((value) => {
  console.log(value);
});
