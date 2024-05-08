import { OpenAI } from "@langchain/openai";
import { BufferWindowMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

/**
 * Conversation buffer window memor 对话缓冲窗口存储器
 * 
 * 原文：
 * ConversationBufferWindowMemory keeps a list of the interactions of the conversation over time. 
 * It only uses the last K interactions. This can be useful for keeping a sliding window of the most recent interactions, so the buffer does not get too large
 * 
 * 翻译：
 * ConversationBufferWindowMemory 保留了一段时间内对话的交互列表。
 * 它只使用最后K个交互。这对于保持最近交互的滑动窗口非常有用，因此缓冲区不会太大
 */

const model = new OpenAI({});
// 1. k是保存的对话轮数
// 开始测试
const memory = new BufferWindowMemory({ k: 1 });
await memory.saveContext({ input: "你好" }, { output: "你好，有什么可以帮你的么?" });
await memory.saveContext({ input: "我是张无忌" }, { output: "你好，张无忌" });
console.log(await memory.loadMemoryVariables());
// 测试没问题，只保留了1个，k=2时，保留了2个
// { history: 'Human: 我是张无忌\nAI: 你好，张无忌' }

/** 使用对话  */
const memory2 = new BufferWindowMemory({ k: 5 });
const chain2 = new ConversationChain({ llm: model, memory: memory2 });
const res1 = await chain2.invoke({ input: "你好，我的名字是张三" });
console.log(res1);
// { response: ' 你好张无忌，我是一个人工智能助手。我的功能包括提供信息、回答问题、执行任务等。我可以说多种语言，并且能够通过学习不断提升自己的能力。你有什么需要帮助的吗？'}
const res2 = await chain2.invoke({ input: "讲个笑话" });
console.log(res2);

const res3 = await chain2.invoke({ input: "继续" });
console.log(res3);
// k=1时无法记住名字了
// { response: ' 你的名字是什么？很抱歉，我并不知道你的名字。'}

const res4 = await chain2.invoke({ input: "我叫什么" });
console.log(res4);
// 测试成功
// k能够起效果

console.log(await memory2.loadMemoryVariables());
