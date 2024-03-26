import { OpenAI } from "@langchain/openai";

// 定义配置参数
// const baseURL = "https://api.aigcbest.top/v1"
const baseURL = "https://ai98.vip/v1"
const openAIApiKey = "sk-A68jUnj7Pc4Te1d27f7f1654A0C144De85F453Fa29C435Fa"
const modelName = "gpt-3.5-turbo-0125"
// 创建模型实例
const model = new OpenAI({ modelName, openAIApiKey }, { baseURL })
// const model = new OpenAI({ openAIApiKey }, { baseURL })
let query = "鲁迅是谁"
console.log('query:', query);
// 调用大模型生成答案
model.invoke(query).then(res => console.log(res))
// const res = await model.invoke(query);
// console.log(res);

// async function chat(query) {
//   const res = await model.invoke(query);
//   console.log(res);
// }
// chat("周树人是谁")