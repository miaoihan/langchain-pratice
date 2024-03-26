import 'dotenv/config';
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const modelName = "gpt-3.5-turbo"
// 创建模型实例
const model = new OpenAI({ modelName })

const prompt = PromptTemplate.fromTemplate(
  `
  role:一个愤怒的打工仔
  用户输入: {input}
  `
)

const chain = prompt.pipe(model)

chain.invoke({input: '你好'}).then(res => console.log(res))

