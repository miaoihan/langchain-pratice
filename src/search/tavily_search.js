import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
// import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

// 定义配置参数
const baseURL = "https://ai98.vip/v1"
const openAIApiKey = "sk-A68jUnj7Pc4Te1d27f7f1654A0C144De85F453Fa29C435Fa"
const modelName = "gpt-3.5-turbo-1106"
// 创建模型实例
const llm = new ChatOpenAI({ modelName, openAIApiKey, streaming: true }, { baseURL })

async function chat(query) {
  // Define the tools the agent will have access to.
  const tools = [new TavilySearchResults({ maxResults: 1, apiKey: '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' })];

  // Get the prompt to use - you can modify this!
  // If you want to see the prompt in full, you can at:
  // https://smith.langchain.com/hub/hwchase17/openai-functions-agent
  const prompt = await pull(
    "hwchase17/openai-functions-agent"
  );

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    // verbose: true,
  }).withConfig({ runName: "Agent" });

  // const result = await agentExecutor.invoke({
  //   input: query,
  // });

  // const stream  = await agentExecutor.stream({ input: query, });
  // for await (const chunk of stream) {
  //   console.log('====',chunk);
  // }

  // 通过获取流事件的方式获取各个步骤执行的结果
  const streamEvents = agentExecutor.streamEvents({ input: query, }, { version: 'v1' });

  for await (const event of streamEvents) {
    const eventType = event.event;
    if (eventType === "on_chain_start") {
      // Was assigned when creating the agent with `.withConfig({"runName": "Agent"})` above
      if (event.name === "Agent") {
        console.log("\n-----");
        console.log(
          `Starting agent: ${event.name} with input: ${JSON.stringify(
            event.data.input
          )}`
        );
      }
    } else if (eventType === "on_chain_end") {
      // Was assigned when creating the agent with `.withConfig({"runName": "Agent"})` above
      if (event.name === "Agent") {
        console.log("\n-----");
        console.log(`Finished agent: ${event.name}\n`);
        console.log(`Agent output was: ${event.data.output}`);
        console.log("\n-----");
      }
    } else if (eventType === "on_llm_stream") {
      const content = event.data?.chunk?.message?.content;
      // Empty content in the context of OpenAI means
      // that the model is asking for a tool to be invoked via function call.
      // So we only print non-empty content
      if (content !== undefined && content !== "") {
        console.log(`| ${content}`);
      }
    } else if (eventType === "on_tool_start") {
      console.log("\n-----");
      console.log(
        `Starting tool: ${event.name} with inputs: ${event.data.input}`
      );
    } else if (eventType === "on_tool_end") {
      console.log("\n-----");
      console.log(`Finished tool: ${event.name}\n`);
      console.log(`Tool output was: ${event.data.output}`);
      console.log("\n-----");
    }
  }

}
chat("你好")

/*
  {
    input: 'what is the weather in wailea?',
    output: "The current weather in Wailea, HI is 64°F with clear skies. The high for today is 82°F and the low is 66°F. If you'd like more detailed information, you can visit [The Weather Channel](https://weather.com/weather/today/l/Wailea+HI?canonicalCityId=ffa9df9f7220c7e22cbcca3dc0a6c402d9c740c755955db833ea32a645b2bcab)."
  }
*/