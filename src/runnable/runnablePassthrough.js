import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

//
// 可以将RunnablePassthrough.assign() 理解为Object.assign()
// 将新属性合并到原对象上
//

const myChain = RunnableSequence.from([
  () => '666',
  () => '777'
])
const res = await myChain.invoke()
console.log('=========res======= \n', res);

const myChain2 = RunnablePassthrough.assign(
  { name: () => 'zhangsan' }
)
const res2 = await myChain2.invoke()
console.log('=========res2======= \n', res2);
//  { name: 'zhangsan' }

const res2_1 = await myChain2.invoke({ age: 18 })
console.log('=========res2_1======= \n', res2_1);
// { age: 18, name: 'zhangsan' }

const myChain3 = RunnablePassthrough.assign(
  { name: (params) => 'zhangsan ' + params.age }
)
// 会执行两种，1 age合并到 {name:'zhangsan'}对象里，2. 也被当成参数穿进去了
// 所以myChain3 一般应该不带参数
const res3 = await myChain3.invoke({ age: 18 })
console.log('=========res3======= \n', res3);
// { age: 18, name: 'zhangsan 18' }

const myChain4 = RunnablePassthrough.assign(
  { 
    name: () => 'zhangsan',
    sex: () => '女',
   },
)
const res4 = await myChain4.invoke({ age: 18 })
console.log('=========res4======= \n', res4);
// { age: 18, name: 'zhangsan', sex: '女' }

const myChain5 = RunnablePassthrough.assign(
  { 
    name: () => 'zhangsan',
  }
).assign(
  {
    sex: (params) => '女' + JSON.stringify(params),
  }
)
const res5 = await myChain5.invoke({ age: 18 })
console.log('=========res5======= \n', res5);
// { age: 18, name: 'zhangsan', sex: '女{"age":18,"name":"zhangsan"}' }
// Q: myChain4和myChain5不是一样的嘛，为啥还要两次assign？
// A: 因为第二次assign能拿到第一次的值，属于同步，如果是放在一个assign里，就是异步了，第二个属性拿不到第一个属性的值