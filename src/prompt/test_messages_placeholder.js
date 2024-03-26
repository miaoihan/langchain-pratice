import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a web researcher who answers user questions by looking up information on the internet and retrieving contents of helpful documents. Cite your sources. {topic}`,
  ],
  ["human", "{input}"],
  // new MessagesPlaceholder("agent_scratchpad"),
]);

let values = { input: "Who is the president of the United States?", topic: "politics", agent_scratchpad: "I'm not sure, let me look it up." };

// console.log("Formatted Prompt: ", await prompt.format(values));
// console.log("Formatted Messages: ", await prompt.formatMessages(values));
console.log("Formatted Prompt Value: ", await prompt.formatPromptValue(values));