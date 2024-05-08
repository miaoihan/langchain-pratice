import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ConversationSummaryBufferMemory } from "langchain/memory";

/**
 * ConversationSummaryBufferMemory 会话摘要缓冲区内存
 * 
 * 原文：
 * ConversationSummaryBufferMemory combines the ideas behind BufferMemory and ConversationSummaryMemory. 
 * It keeps a buffer of recent interactions in memory, but rather than just completely flushing old interactions 
 * it compiles them into a summary and uses both. Unlike the previous implementation though, 
 * it uses token length rather than number of interactions to determine when to flush interactions.
 * 
 * 译文：
 * ConversationSummaryBufferMemory 结合了BufferMemory和ConversationSummaryMemory背后的思想。
 * 它在内存中保留了一个最近交互的缓冲区，但它并不只是完全刷新旧的交互，而是将它们编译成一个摘要并使用两者。
 * 与前面的实现不同，它使用令牌长度而不是交互数量来确定何时刷新交互。
 * 
 * 要点：
 * 1. 当达到maxTokenLimit时，会调用llm去生成对话摘要
 */

const memory = new ConversationSummaryBufferMemory({
  llm: new OpenAI({}),
  maxTokenLimit: 500
});
const chain = new ConversationChain({ llm: new OpenAI({}), memory: memory });
const res1 = await chain.invoke({ input: "你好，我叫张三" });
console.log(res1);
// { response: ' 你好张三！很高兴见到你。我是一个人工智能助手，可以为你提供各种信息和帮助。你有什么问题或者需求吗？' }

console.log(await memory.loadMemoryVariables());

const res2 = await chain.invoke({ input: "我叫什么？" });
console.log(res2);
// { response: ' 你的名字是张三。这是你给自己取的名字吗？或者是你的父母给你取的名字？我是一个人工智能，无法确定这个信息。' }

console.log(await memory.loadMemoryVariables());
// {
//   history: '\n' +
//     'The human introduces themselves as Zhang San and the AI responds by introducing itself as an artificial intelligence assistant and offering to answer any questions. The AI asks the human if there is anything it can help with. The human asks what their name is and the AI responds that their name is Zhang San and that it is a human name. The AI also mentions that it is an artificial intelligence assistant and can answer any questions the human may have.'
// }