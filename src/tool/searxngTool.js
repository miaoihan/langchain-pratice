import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SearxngSearch } from "@langchain/community/tools/searxng_search";

const model = new ChatOpenAI({
  maxTokens: 1000,
  model: "gpt-4",
});

// `apiBase` will be automatically parsed from .env file, set "SEARXNG_API_BASE" in .env,
const tools = [
  new SearxngSearch({
    params: {
      format: "json", // Do not change this, format other than "json" is will throw error
      engines: "google",
    },
    // Custom Headers to support rapidAPI authentication Or any instance that requires custom headers
    headers: {},
  }),
];
const prefix = ChatPromptTemplate.fromMessages([
  [
    "ai",
    "Answer the following questions as best you can. In your final answer, use a bulleted list markdown format.",
  ],
  ["human", "{input}"],
]);
// Replace this with your actual output parser.
const customOutputParser = (
  input
) => ({
  log: "test",
  returnValues: {
    output: input,
  },
});
// Replace this placeholder agent with your actual implementation.
const agent = RunnableSequence.from([prefix, model, customOutputParser]);
const executor = AgentExecutor.fromAgentAndTools({
  agent,
  tools,
});
console.log("Loaded agent.");
const input = `最新特朗普的新闻`;
console.log(`Executing with input "${input}"...`);
const result = await executor.invoke({ input });
console.log(result);