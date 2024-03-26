import 'dotenv/config';
import { OpenAI } from "@langchain/openai";

// 定义配置参数
const modelName = "gpt-3.5-turbo" // 默认使用gpt-3.5-turbo-instruct
// 创建模型实例
const model = new OpenAI()
let query = "鲁迅是谁"
// 调用大模型生成答案
model.invoke(query).then(res => console.log(res))

// async function chat(query) {
//   const res = await model.invoke(query);
//   console.log(res);
// }
// chat("周树人是谁")