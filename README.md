# promise-source-code

根据 promises/A+规范手写 promise 源码

参考文档：https://promisesaplus.com/

https://www.ituring.com.cn/article/66566

https://www.cnblogs.com/sugar-tomato/p/11353546.html

https://github.com/YvetteLau/Blog/issues/2

1. promise 和 thenable 的区别
   “promise” is an object or function with a then method whose behavior conforms to this specification.
   “thenable” is an object or function that defines a then method.

2. new 的 promise对象的状态时由什么决定的

3. new Promise 的时候调用 resolve 函数时，new 出来的 promise 对象的状态一定时 fullfilled 么

4. new Promise 的时候调用 reject 函数时，new 出来的 promise 对象的状态一定时 rejected 么

5. then 方法返回的 promise对象的状态是由什么决定的
