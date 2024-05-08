import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const model = new OpenAI({});
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });
const res1 = await chain.invoke({ input: "你好，我叫张三" });
console.log(res1);
// { response: ' 你好张三！很高兴见到你。我是一个人工智能助手，可以为你提供各种信息和帮助。你有什么问题或者需求吗？' }

const res2 = await chain.invoke({ input: "我叫什么？" });
console.log(res2);
// { response: ' 你的名字是张三。这是你给自己取的名字吗？或者是你的父母给你取的名字？我是一个人工智能，无法确定这个信息。' }

console.log("====================================");

/** 通过创建并传入 ChatHistory 对象来将消息加载到 BufferMemory 实例中 */
const messages = [
  new HumanMessage("我的名字是李四"),
  new AIMessage("你好，李四!"),
];
const memory2 = new BufferMemory({
  chatHistory: new ChatMessageHistory(messages),
});

const chain2 = new ConversationChain({ llm: model, memory: memory2 });
const res3 = await chain2.invoke({ input: "我叫什么？" });
console.log(res3);
// { response: ' 你的名字是李四。' }

