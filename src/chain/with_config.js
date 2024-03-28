import { RunnableSequence } from "@langchain/core/runnables";

const myChain = RunnableSequence.from([
  () => '666',
  () => '777'
]).withConfig({runName: 'my_chain'})
const res = await myChain.invoke() 
console.log('=========res======= \n', res);