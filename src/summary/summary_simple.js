import 'dotenv/config';
import { OpenAI } from "@langchain/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const text = "成为专家的路径，是“刻意练习”。如果你发现你在某项技能方面有天赋、肯钻研、极易进入“心流状态”，那在一家大企业中成为某个领域的专家，是最好的归宿。";
const model = new OpenAI();
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500 });
const docs = await textSplitter.createDocuments([text]);

const chain = loadSummarizationChain( model, { type: "map_reduce" });

const res = await chain.invoke({
  input_documents: docs,
})
console.log(res);