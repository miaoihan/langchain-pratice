import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate, } from "@langchain/core/prompts";
import { Chroma } from "@langchain/community/vectorstores/chroma";

// TIPS: 同一个数据多次存储，再查询的时候会出现查不出结果的情况，所以不要重复存储

console.time('start')
// 创建一个新的ChatOpenAI实例
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106", // 模型名称
  temperature: 0.2, // 温度参数，控制生成文本的随机性
});

// 创建一个新的OpenAIEmbeddings实例
const embeddings = new OpenAIEmbeddings();

// 创建一个新的CheerioWebBaseLoader实例，用于从指定的URL加载文档
const loader = new CheerioWebBaseLoader(
  "https://www.miaoyanai.com"
);

// 加载文档
const rawDocs = await loader.load();
rawDocs[0].metadata = { ...rawDocs[0].metadata, dialogId: 5 }
// console.log('====rawDocs====\n', rawDocs);

/**  将文档分割成小块，以便LLM的上下文窗口可以处理，并将其存储在向量数据库中 **/
// split it into smaller chunks that the LLM’s context window can handle and store it in a vector database

// 创建分割器示例
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // 每个块的大小
  chunkOverlap: 0, // 块之间的重叠大小
});

// 将文档分割成小块
const allSplits = await textSplitter.splitDocuments(rawDocs);
// console.log('====allSplits====\n', allSplits);

console.time('vectorstore')
// 存储到向量数据库
// const vectorstore = await Chroma.fromDocuments(allSplits, embeddings)
const vectorStore = await Chroma.fromDocuments(allSplits, embeddings, {
  collectionName: "collection-10",
  url: "http://107.150.102.219:8000", // Optional, will default to this value
  collectionMetadata: {
    "hnsw:space": "cosine",
  }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
});
console.timeEnd('vectorstore')

// const vectorStore = await Chroma.fromExistingCollection(embeddings, {
//   collectionName: "test-collection-2",
//   url: "http://107.150.102.219:8000",
// })

// it can work
// const res = await vectorStore.similaritySearch('总结文档', 4, (doc) => doc.metadata.dialogId === 2)
console.time('similaritySearch')
const searchResults = await vectorStore.similaritySearch('', 4, { dialogId: 5 })
console.timeEnd('similaritySearch')
console.log('====searchResults====\n', searchResults);
// const result = await vectorStore.collection.query({
//   // queryEmbeddings: embeddings,
//   queryTexts: ['langchain有什么特点'],
//   nResults: 10,
//   where: { "dialogId": 1 },
// })
// console.log('====result====\n', result);
// 将vectorstore转换为检索器
const retriever = vectorStore.asRetriever();

console.time('retriever.invoke')
// 使用检索器查询文档
const docs = await retriever.invoke('妙言AI', { dialogId: 5 })
console.timeEnd('retriever.invoke')
// const doc2 = await vectore.invoke('what is LangChain Libraries?')
// const doc3 = await vectore.invoke('')
// 打印查询结果
console.log('=========docs========\n', docs)
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
  input: '妙言Ai是什么？',
  context: docs
})

console.log('=========answer======= \n', answer);
console.timeEnd('start')