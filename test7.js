// var promise1 = new Promise((resolve, reject) => {
//   resolve("resolve");
// }).then(
//   (value) => {
//     console.log("value", value);
//   },
//   (reason) => {
//     console.log("reason", reason);
//   }
// );
// console.log("outer value", value);

const func1 = (value) => {
  var name = "meng";
  console.log("value", value);
};
func1();
console.log("name", name);

if (true) {
  var age = 18;
}
console.log("age", age);
