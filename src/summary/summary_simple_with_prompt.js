import 'dotenv/config';
import { OpenAI } from "@langchain/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";

/**
 * 小课堂
 * stuff类型
  LangChain默认类型，会把所有的 文档内容 一次全部传给 llm 模型进行总结，所以叫填充模式，如果文档内容太长，肯定会超过LLM的token限制。

  map_reduce类型
  这种方式是先把每一个文档片段先传给LLM模型单独总结，最后在把所有总结合并起来，再给AI归纳总结一下，这个就跟很多编程语言里面的map-reduce函数库的思想类似。

  refine类型
  这种方式，其实就是归纳的方式生成文本摘要，就是先将第一个文档的内容传给llm模型总结，然后把第一个文档的总结内容 + 第二个文档的内容再发给llm模型总结，以此类推，最后得到一个长文本最终的总结。

  map_rerank类型
  这个是用在问答任务里面，筛选出跟问题相关度高的文档片段，然后传给llm模型回答问题。
 */

const text = "成为专家的路径，是“刻意练习”。如果你发现你在某项技能方面有天赋、肯钻研、极易进入“心流状态”，那在一家大企业中成为某个领域的专家，是最好的归宿。";
const model = new OpenAI();
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 500 });
const docs = await textSplitter.createDocuments([text]);

const prompt = PromptTemplate.fromTemplate(
  `
  {text}
  总结上文内容，格式如下：
  # 总结
  <总结内容>

  # 要点
  <要点内容>
  `
, )

const chain = loadSummarizationChain( model, { type: "map_reduce", combinePrompt: prompt });

const res = await chain.invoke({
  text: text,
  input_documents: docs,
})
console.log(res);