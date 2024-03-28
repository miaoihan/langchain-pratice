import 'dotenv/config';
import { OpenAI } from "@langchain/openai";
// 一行代码生成gpt聊天
new OpenAI().invoke('你是谁?').then(res => console.log(res))

