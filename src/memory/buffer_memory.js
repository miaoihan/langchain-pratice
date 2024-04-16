import 'dotenv/config'
import { BufferMemory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const memory = new BufferMemory();

await memory.chatHistory.addMessage(new HumanMessage("你好"));
await memory.chatHistory.addMessage(new AIMessage("你好，有什么可以帮你的么?"));

console.log(memory.chatHistory.messages);
console.log('=============================');
console.log(await memory.loadMemoryVariables()); // 默认返回一个key是history的对象,值默认是字符串
// [
//   HumanMessage {
//     lc_serializable: true,
//     lc_kwargs: { content: 'Hi!', additional_kwargs: {}, response_metadata: {} },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: 'Hi!',
//     name: undefined,
//     additional_kwargs: {},
//     response_metadata: {}
//   },
//   AIMessage {
//     lc_serializable: true,
//     lc_kwargs: {
//       content: "What's up?",
//       additional_kwargs: {},
//       response_metadata: {}
//     },
//     lc_namespace: [ 'langchain_core', 'messages' ],
//     content: "What's up?",
//     name: undefined,
//     additional_kwargs: {},
//     response_metadata: {}
//   }
// ]
// =====================
// { history: "Human: Hi!\nAI: What's up?" }

const memory2 = new BufferMemory({
  returnMessages: true, // true则返回一个消息列表
  memoryKey: "chat_history",
}); 
console.log('=============================');
console.log(await memory2.loadMemoryVariables());
// =============================
// { chat_history: [] }