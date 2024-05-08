import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ConversationSummaryBufferMemory } from "langchain/memory";

/**
 * 测试ConversationSummaryBufferMemory
 * maxTokenLimit 是否有效
 * tips:
 * 若加入三方数据库，如redis，则maxTokenLimit不会生效，https://github.com/langchain-ai/langchain/issues/10078
 */

const memory = new ConversationSummaryBufferMemory({
  llm: new OpenAI({}),
  maxTokenLimit: 10
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

// 报错 安装了 js-tiktoken也不行
// Failed to calculate number of tokens, falling back to approximate count TypeError: fetch failed
//     at Object.fetch (node:internal/deps/undici/undici:11372:11)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async RetryOperation._fn (/Users/zhanghan/project/com.pratice/langchain-pratice/node_modules/.pnpm/p-retry@4.6.2/node_modules/p-retry/index.js:50:12) {
//   cause: _ConnectTimeoutError: Connect Timeout Error
//       at onConnectTimeout (node:internal/deps/undici/undici:6616:28)
//       at node:internal/deps/undici/undici:6574:50
//       at Immediate._onImmediate (node:internal/deps/undici/undici:6605:13)
//       at process.processImmediate (node:internal/timers:476:21) {
//     code: 'UND_ERR_CONNECT_TIMEOUT'
//   }