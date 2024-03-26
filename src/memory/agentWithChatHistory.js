import 'dotenv/config'
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence  } from "@langchain/core/runnables";
import { LLMChain } from "langchain/chains";
import { ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import { BufferMemory } from 'langchain/memory';

const modelName = "gpt-3.5-turbo"
// 创建模型实例
const model = new OpenAI({ modelName })

// const prompt = PromptTemplate.fromTemplate(
//   `your a kind ai assistant
//   Human Input: {input}

//   历史聊天记录: {chat_history}
//   `
// )
// 必须是ChatPromptTemplate 才行？？
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You're an assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const chain = prompt.pipe(model)
const chain2 = new LLMChain({ llm: model, prompt: prompt})
const chain3 = RunnableSequence.from([prompt, model]);

// chain.invoke("你好").then(res => console.log(res))

const messageHistory = new ChatMessageHistory();
// const memory = new BufferMemory({memoryKey: 'history'});
// memory.chatHistory

const agentWithChatHistory = new RunnableWithMessageHistory({
  runnable: chain3,
  // This is needed because in most real world scenarios, a session id is needed per user.
  // It isn't really used here because we are using a simple in memory ChatMessageHistory.
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

const result5 = await agentWithChatHistory.invoke(
  {
    input: "hi! i'm han",
  },
  {
    // This is needed because in most real world scenarios, a session id is needed per user.
    // It isn't really used here because we are using a simple in memory ChatMessageHistory.
    configurable: {
      sessionId: "foo",
    },
  }
);

console.log(result5);
/*
  {
    input: "hi! i'm cob",
    chat_history: [
      HumanMessage {
        content: "hi! i'm cob",
        additional_kwargs: {}
      },
      AIMessage {
        content: 'Hello Cob! How can I assist you today?',
        additional_kwargs: {}
      }
    ],
    output: 'Hello Cob! How can I assist you today?'
  }
*/

const result6 = await agentWithChatHistory.invoke(
  {
    input: "what's my name?",
  },
  {
    configurable: {
      sessionId: "foo",
    },
  }
);

console.log(result6);