import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { ConversationSummaryMemory } from "langchain/memory";

/**
 * Conversation summary memory 会话摘要存储器
 * 
 * 原文：
 * Now let's take a look at using a slightly more complex type of memory - ConversationSummaryMemory. 
 * This type of memory creates a summary of the conversation over time. This can be useful for condensing information from the conversation over time. 
 * Conversation summary memory summarizes the conversation as it happens and stores the current summary in memory. 
 * This memory can then be used to inject the summary of the conversation so far into a prompt/chain. 
 * This memory is most useful for longer conversations, where keeping the past message history in the prompt verbatim would take up too many tokens.
 * 
 * 翻译：
 * 现在让我们来看看使用稍微复杂一点的内存类型- ConversationSummaryMemory 。
 * 这种类型的记忆会随着时间的推移创建对话的摘要。这对于随着时间的推移从对话中浓缩信息很有用。
 * 会话摘要存储器在会话发生时对其进行摘要，并将当前摘要存储在存储器中。
 * 然后，可以使用该存储器将到目前为止的对话的摘要注入到提示符/链中。
 * 这种内存对于较长的会话最有用，在这种情况下，在提示符中逐字保留过去的消息历史记录会占用太多的令牌。
 * 
 * 要点：
 * 1. ConversationChain 每次调用ConversationChain（也就是一轮对话）结束后，都会调用llm，基于上述的对话，生成一个摘要
 * 这中情况会使token翻倍（所以实际项目最好不用这个）
 */

const memory = new ConversationSummaryMemory({
  llm: new OpenAI({}),
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