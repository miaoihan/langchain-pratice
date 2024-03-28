import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";

const chat = new ChatOpenAI()

const res = await chat.invoke('你好')
console.log(res);
// AIMessage {
//   lc_serializable: true,
//   lc_kwargs: {
//     content: '你好！有什么可以帮助你的吗？',
//     additional_kwargs: { function_call: undefined, tool_calls: undefined },
//     response_metadata: {}
//   },
//   lc_namespace: [ 'langchain_core', 'messages' ],
//   content: '你好！有什么可以帮助你的吗？',
//   name: undefined,
//   additional_kwargs: { function_call: undefined, tool_calls: undefined },
//   response_metadata: {
//     tokenUsage: { completionTokens: 17, promptTokens: 9, totalTokens: 26 },
//     finish_reason: 'stop'
//   }
// }