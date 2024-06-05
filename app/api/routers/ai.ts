import type { TRPCRouterRecord } from "@trpc/server";

import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { LLMResult } from "@langchain/core/outputs";
import { zodToJsonSchema } from "zod-to-json-schema";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { AIMessageChunk } from "@langchain/core/messages";

import { publicProcedure } from "../trpc";

import { sendPromptToJsonModel } from "@/utils/ai";
import { ETHERSCAN_API_DATA } from "@/ai/data/etherscan";
import { TOP_ETH_TOKENS } from "@/ai/data/eth-tokens";
import { EtherscanAPISchema, getEtherscanData } from "@/ai/etherscan";

const handleLLMEnd = (output: LLMResult) => {
  console.log(
    `Completion ${output.llmOutput?.tokenUsage?.completionTokens ?? "Unknown"} --- Prompt ${
      output.llmOutput?.tokenUsage?.promptTokens ?? "Unknown"
    }`,
  );
};

const EtherscanFunctionSchema = z.object({
  requiresFollowUpAnalysis: z
    .boolean()
    .describe(
      "An example of true: The user asks for how much USDC was sent from a certain wallet, " +
        "this would require a follow up analysis to tally up transaction amounts." +
        "An example of false: The user asks for the last 10 transactions of a certain wallet, this would " +
        "not require a follow up analysis as that data can just be shown to the user after.",
    ),
  reason: z
    .string()
    .describe(
      "Provide the user a bit of information as to why you're making this request. Start " +
        "the message with 'Calling Etherscan to ...'",
    ),
  api: EtherscanAPISchema,
});

export const w = wretch().addon(QueryStringAddon);

export const strongGpt = new ChatOpenAI({
  modelName: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0, // we generally want a low temperature, esp. with JSON formats
  cache: true, // temperature 0 === deterministic, therefore we want to cache
  maxRetries: 3,
  callbacks: [
    {
      handleLLMEnd,
    },
  ],
});

const queryEtherscan = async (
  prompts: Array<{
    role: "user" | "assistant";
    message: string;
  }>,
  data?: string,
) => {
  const response = await sendPromptToJsonModel(prompts, {
    systemMessage: `Your job to help the user solve the question they have relating to 
      blockchain data on the Ethereum network. To answer these questions you will rely 
      primarily on calling the etherscan API.
      
      ${data ? `Here is some of the necessary data needed for this analysis: {data}` : ""}
  
      Here are the contract addresses of the top Ethereum tokens:
      ${Object.entries(TOP_ETH_TOKENS)
        .map(([name, address]) => `${name}: ${address}`)
        .join("\n")}

      Here is some info on the etherscan API: 
      ${ETHERSCAN_API_DATA}
      `,
    input: {
      ...(data ? { data } : {}),
    },
    maxTokens: 2000,
    model: strongGpt,
    functions: [
      {
        name: "etherscan",
        description:
          "Used for querying Etherscan for information about a contract, token, or transaction.",
        parameters: zodToJsonSchema(EtherscanFunctionSchema),
      },
      // {
      //   name: "result",
      //   description:
      //     "Used for querying Etherscan for information about a contract, token, or transaction.",
      //   parameters: zodToJsonSchema(EtherscanFunctionSchema),
      // },
    ],
  });

  return response;
};

const recursiveLLMcall = async (
  prompts: Array<{
    role: "user" | "assistant";
    message: string;
  }>,
  tableQueryResults: Array<string> = [],
  recursionsRemaining = 3, // Avoid allowing the LLM to excessively recurse on itself
): Promise<{
  result: AIMessageChunk;
  tableQueryResults: Array<string>;
}> => {
  if (recursionsRemaining === 0) {
    throw new Error("Maximum recursion depth reached");
  }

  const result = await queryEtherscan(prompts, tableQueryResults.join("\n"));
  const isEtherscanQueried =
    result.additional_kwargs.function_call?.name === "etherscan";
  let tableData = [...tableQueryResults];

  if (isEtherscanQueried) {
    // @TODO, this could be improved to handle cases where LLM returns invalid JSON
    debugger;
    const query = EtherscanFunctionSchema.parse(
      JSON.parse(result.additional_kwargs.function_call?.arguments ?? "{}"),
    );

    // Call the etherscan API
    const etherscanData = await getEtherscanData(query.api);
    // @TODO, handle errors from the etherscan API

    console.log(etherscanData);
    tableData.push(JSON.stringify(etherscanData));

    if (query.requiresFollowUpAnalysis) {
      return recursiveLLMcall(prompts, tableData, recursionsRemaining - 1);
    }
  }

  // @TODO, check for a result function call

  return {
    tableQueryResults,
    result,
  };
};

export const aiRouter = {
  prompt: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            message: z.string(),
          }),
        ),
        tables: z.array(z.string()), // NOTE: table data is too variable to not be stringified
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await recursiveLLMcall(input.messages, input.tables);

        return {
          message: "Something went wrong while trying to generate a response",
          status: "success",
          tables: [],
        };
      } catch (e) {
        console.log(e);

        return {
          message: "Something went wrong while trying to generate a response",
          status: "error",
          tables: [],
        };
      }
    }),
} satisfies TRPCRouterRecord;
