import { RunnableSequence } from "@langchain/core/runnables";

// 只传一个函数会报错，至少两个才能叫chain
// const myChain = RunnableSequence.from([
//   () => '666',
// ])

// ====================== 1. 最小代码的chain =================================
// 只接受function、object、runnable
// 输入的是什么数据结构，输出就是什么数据结构
// 只输出最后一个函数的结果
const myChain = RunnableSequence.from([
  () => '666',
  () => '777'
])
const res = await myChain.invoke() 
console.log('=========res======= \n', res);
//  777

// =======================================================
const myChain2 = RunnableSequence.from([
  (params) => params.input,
  (previousOutput) => previousOutput,
])

const res2 = await myChain2.invoke({ input: '888' })
console.log('=========res2======= \n', res2);
//  888

// =======================================================
const runnable1 = (params) => {
  return params.input
}
const runnable2 = (previousOutput) => {
  return previousOutput + 'biubiubiu'
}
const myChain3Pro = RunnableSequence.from([
  runnable1,
  runnable2,
])
const res3 = await myChain3Pro.invoke({ input: '888' })
console.log('=========res3======= \n', res3);
// 888biubiubiu
// 用pipe也可以
// runnable1.p


// =======================================================
const myChain4 = RunnableSequence.from([
  {
    input: () => '666'
  },
  {
    input: () => '777'
  },
])

// console.log('=========myChain======= \n', myChain);
const res4 = await myChain4.invoke('Are u ok?') // 传入任何参数都没用,因为函数没有接受参数
console.log('=========res4======= \n', res4);
//  { input: '777' }

// ========================== 5 =============================
function getMemory(message) {
  return { 
    AIMessage: 'I am a AI',
    HumanMessage: message
  }
}
const myChain5 = RunnableSequence.from([
  {
    input: (initInput) => initInput.input,
    memory: getMemory
  },
  {
    input: (previousOutput) => previousOutput.input,
    history: (previousOutput) => previousOutput.memory
  },
])
const res5 = await myChain5.invoke({ input: '你好' })
console.log('=========res5======= \n', res5);
// {
//   input: '你好',
//   history: { AIMessage: 'I am a AI', HumanMessage: { input: '你好' } }
// }