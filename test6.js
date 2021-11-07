// require("./promiseInternet");
// import Promise from "./promiseInternet.js";
new Promise((resolve, reject) => {
  //   resolve(1);
  reject("reject");
})
  .then(
    (value) => {
      //   console.log(value);
      //   return new Promise((resolve, reject) => {rej})
    },
    (reason) => {
      return reason;
    }
  )
  .then(
    (value) => {
      console.log("value", value);
    },
    (reason) => {
      console.log("reason", reason);
    }
  );
