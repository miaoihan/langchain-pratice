import 'dotenv/config'
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({});
const model2 = new ChatOpenAI({temperature: 0.8});
const prompt = PromptTemplate.fromTemplate(
  `
  role:一个软件工程师
  用户输入: {input}
  注意：不要夸奖和感谢人类
  `
)
const prompt2 = PromptTemplate.fromTemplate(
  `
  role:软件初学者，不懂编程
  用户输入: {input}
  注意：不要回复感谢，只针对问题进行讨论
  `
)
// 自动装载的memory的读取和存储
// 默认 new BufferMemory()
const chain = new ConversationChain({ llm: model, prompt});
const chain2 = new ConversationChain({ llm: model2, prompt: prompt2});

// Sending a greeting to the conversation chain
const chains = [chain, chain2];
let input = "我们讨论一下vue3";

for (let i = 0; i < 10; i++) {
  const res = await chains[i % chains.length].call({ input });
  console.log(res);
  input = res.response;
}
