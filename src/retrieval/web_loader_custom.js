import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";

console.time('start')
// 创建一个新的ChatOpenAI实例
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-0125", // 模型名称
  temperature: 0, // 温度参数，控制生成文本的随机性
});

// 创建一个新的OpenAIEmbeddings实例
const embeddings = new OpenAIEmbeddings();

async function getWebDocs({ type, content }) {
  if (type === 'url') {
    const loader = new CheerioWebBaseLoader(content)
    return await loader.load()
  }
  if (type === 'text') {
    const metadata = { source: '' };
    return [new Document({ pageContent: content, metadata })]
  }
}

// const rawDocs = getWebDocs({ type: 'url', content: 'https://js.langchain.com/docs/get_started/introduction' })
const rawDocs = await getWebDocs({ type: 'text', content: '2024年5月1号是劳动节，麦子科技公司放假7天！' })

rawDocs.map(doc => {
  doc.metadata = { ...doc.metadata, "dialogId": 5 }
})

// 创建分割器示例
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // 每个块的大小
  chunkOverlap: 0, // 块之间的重叠大小
});

// 将文档分割成小块
console.time('split')
const allSplits = await textSplitter.splitDocuments(rawDocs);
console.timeEnd('split')

console.time('vectorstore')
// 存储到向量数据库
const vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings)
console.timeEnd('vectorstore')

// 将vectorstore转换为检索器
const retriever = vectorStore.asRetriever(4, (doc) => doc.metadata.dialogId === 5);

console.time('retriever.invoke')
// 使用检索器查询文档
const docs = await retriever.invoke('放假几天？')
console.timeEnd('retriever.invoke')
// 打印查询结果
console.log('=========docs========\n', docs)

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
  input: '放假几天？',
  context: docs
})

console.log('=========answer======= \n', answer);

console.timeEnd('start')