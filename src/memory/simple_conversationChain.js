import 'dotenv/config'
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";

const model = new ChatOpenAI({});
// 自动装载的memory的读取和存储
// 默认 new BufferMemory()
const chain = new ConversationChain({ llm: model });

// Sending a greeting to the conversation chain
const res1 = await chain.call({ input: "Hi! I'm Jim." });
console.log(res1);

// Following up with a question in the conversation
const res2 = await chain.call({ input: "What's my name?" });
console.log(res2);