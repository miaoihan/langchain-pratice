import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage } from '@langchain/core/messages';
import { RunnablePassthrough, RunnableSequence, } from "@langchain/core/runnables";

// 创建一个新的ChatOpenAI实例
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106", // 模型名称
  temperature: 0.2, // 温度参数，控制生成文本的随机性
});

// 创建一个新的OpenAIEmbeddings实例
const embeddings = new OpenAIEmbeddings();

// 创建一个新的CheerioWebBaseLoader实例，用于从指定的URL加载文档
const loader = new CheerioWebBaseLoader(
  "https://js.langchain.com/docs/get_started/introduction"
);

// 加载文档
const rawDocs = await loader.load();
console.log('====rawDocs====\n', rawDocs);

/**  将文档分割成小块，以便LLM的上下文窗口可以处理，并将其存储在向量数据库中 **/
// split it into smaller chunks that the LLM’s context window can handle and store it in a vector database

// 创建分割器示例
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // 每个块的大小
  chunkOverlap: 0, // 块之间的重叠大小
});
// 将文档分割成小块
const allSplits = await textSplitter.splitDocuments(rawDocs);
// 存储到向量数据库
const vectorstore = await MemoryVectorStore.fromDocuments(allSplits, embeddings)
// 将vectorstore转换为检索器
const retriever = vectorstore.asRetriever(4);
// 使用检索器查询文档
// const docs = await retriever.invoke('langchain是什么?')

// **** 交给llm处理
const SYSTEM_TEMPLATE = `Answer the user's questions based on the below context. 
If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

<context>
{context}
</context>

#Example
`

const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_TEMPLATE],
  new MessagesPlaceholder("messages"),
  // new HumanMessage("{input}"), // 这样写解析不出来不知道为什么
  // ["human", "{input}"],
]);
const parseRetrieverInput = (params) => {
  return params.messages[params.messages.length - 1].content;
};

const documentChain = await createStuffDocumentsChain({
  llm: chat,
  prompt: questionAnsweringPrompt,
});
// 将用户的输入传给检索器的输入
const retrievalChain = RunnablePassthrough.assign({
  context: RunnableSequence.from([parseRetrieverInput, retriever]),
}).assign({
  answer: documentChain,
});

const answer = await retrievalChain.invoke({
  messages: [new HumanMessage("langchain是什么?")],
});


console.log('=========answer======= \n', answer);