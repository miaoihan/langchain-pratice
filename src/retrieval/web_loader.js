import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage } from '@langchain/core/messages';

console.time('start')
// 创建一个新的ChatOpenAI实例
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106", // 模型名称
  temperature: 0.2, // 温度参数，控制生成文本的随机性
});

// 创建一个新的OpenAIEmbeddings实例
const embeddings = new OpenAIEmbeddings({
  // modelName:'text-embedding-ada-002',
  // openAIApiKey: process.env.OPENAI_API_KEY,
  // configuration: {baseURL: process.env.OPENAI_BASE_URL},
  // batchSize: 1,
});

// const emb = await embeddings.embedQuery('langchain是什么?')
// console.log('====emb====\n', emb);

// 创建一个新的CheerioWebBaseLoader实例，用于从指定的URL加载文档
const loader = new CheerioWebBaseLoader("https://www.miaoyanai.com");

// 加载文档
const rawDocs = await loader.load();
rawDocs.map(doc => {
  doc.metadata = {...doc.metadata, "dialogId": 5}
})
// console.log('====rawDocs====\n', rawDocs);
const texts = rawDocs.map(({ pageContent }) => pageContent);
// const emb = await embeddings.embedDocuments(texts)
// const embt = await embeddings.embedDocuments(['langchain是什么?','不等你','haibucuo'])
// const emb2 = await embeddings.embedQuery('123')
// console.log('====emb====\n', embt);

/**  将文档分割成小块，以便LLM的上下文窗口可以处理，并将其存储在向量数据库中 **/
// split it into smaller chunks that the LLM’s context window can handle and store it in a vector database

// 创建分割器示例
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // 每个块的大小
  chunkOverlap: 0, // 块之间的重叠大小
});

// 将文档分割成小块
console.time('split')
const allSplits = await textSplitter.splitDocuments(rawDocs);
console.timeEnd('split')
// const embdoc = await embeddings.embedDocuments(allSplits)
// console.log('====embdoc====\n', embdoc);
// console.log('====allSplits====\n', allSplits);

console.time('vectorstore')
// 存储到向量数据库
const vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings)
console.timeEnd('vectorstore')

// 将vectorstore转换为检索器
const retriever = vectorStore.asRetriever(4, (doc) => doc.metadata.dialogId === 5);

// const res = await vectorstore.similaritySearch('langchain是什么?', 4, (doc) => doc.metadata.dialogId === 5)
console.log();

console.time('retriever.invoke')
// 使用检索器查询文档
const docs = await retriever.invoke('文档说了什么?')
console.timeEnd('retriever.invoke')
// const doc2 = await vectore.invoke('what is LangChain Libraries?')
// const doc3 = await vectore.invoke('')
// 打印查询结果
console.log('=========docs========\n',docs)
// console.log('=================\n',doc2)
// console.log('=================\n',doc3)

// **** 交给llm处理
const SYSTEM_TEMPLATE = `Answer the user's questions based on the below context. 
If the context doesn't contain any relevant information to the question, don't make something up and just say "I don't know":

<context>
{context}
</context>
`;

const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_TEMPLATE],
  // new MessagesPlaceholder("messages"),
  // new HumanMessage("{input}"), // 这样写解析不出来不知道为什么
  ["human", "{input}"],
]);

const documentChain = await createStuffDocumentsChain({
  llm: chat,
  prompt: questionAnsweringPrompt,
});

const answer = await documentChain.invoke({
  input: '文档说了什么?',
  context: docs
})

console.log('=========answer======= \n', answer);

console.timeEnd('start')