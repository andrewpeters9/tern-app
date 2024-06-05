import type { TRPCRouterRecord } from "@trpc/server";

import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { LLMResult } from "@langchain/core/outputs";
import { zodToJsonSchema } from "zod-to-json-schema";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import { nanoid } from "nanoid";
import { is } from "rambda";

import { publicProcedure } from "../trpc";

import { sendPromptToJsonModel } from "@/utils/ai";
import { ETHERSCAN_API_DATA } from "@/ai/data/etherscan";
import { EtherscanAPISchema, getEtherscanData } from "@/ai/etherscan";
import { coinLookup } from "@/ai/coin-lookup";

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
      "This should be a description of the below data. Make sure to capitalize the first letter.",
    ),
  api: EtherscanAPISchema,
});

const ResultFunctionSchema = z.object({
  result: z
    .string()
    .describe(
      "Provide the response here. If the query is unsolvable, then you should call this too - " +
        "explaining that you can't yet answer these types of questions.",
    ),
});

const CoinLookupFunctionSchema = z.object({
  names: z.array(z.string().describe("The tokens' name")),
});

// Here are the contract addresses of the top Ethereum tokens:
// ${Object.entries(TOP_ETH_TOKENS)
//   .map(([name, address]) => `${name}: ${address}`)
//     .join("\n")}

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
      {
        name: "coin-lookup",
        description:
          "Call this function when you want to find the address of a token by its name.",
        parameters: zodToJsonSchema(CoinLookupFunctionSchema),
      },
      {
        name: "result",
        description:
          "Call this function when you have all the information you need to answer the question." +
          "I.e., you don't need to call etherscan anymore. If the query is unsolvable, then you should call this too.",
        parameters: zodToJsonSchema(ResultFunctionSchema),
      },
    ],
  });

  return response;
};

const recursiveLLMcall = async (
  prompts: Array<{
    role: "user" | "assistant";
    message: string;
  }>,
  tableQueryResults: Array<{
    reason: string;
    data: string;
  }> = [],
  _newTables: Array<{
    reason: string;
    data: string;
  }> = [],
  recursionsRemaining = 5, // Avoid allowing the LLM to excessively recurse on itself
): Promise<{
  result: string;
  tableQueryResults: Array<{
    reason: string;
    data: string;
  }>;
}> => {
  if (recursionsRemaining === 0) {
    throw new Error("Maximum recursion depth reached");
  }

  let newTables = [..._newTables];
  const result = await queryEtherscan(
    prompts,
    [...tableQueryResults, ...newTables].map((t) => t.data).join("\n"),
  );
  const functionCalled = result.additional_kwargs.function_call?.name;
  const isEtherscanQueried = functionCalled === "etherscan";
  const isResultFunctionCalled = functionCalled === "result";

  switch (functionCalled) {
    case "coin-lookup": {
      const query = CoinLookupFunctionSchema.parse(
        JSON.parse(result.additional_kwargs.function_call?.arguments ?? "{}"),
      );
      const data = query.names.map((c) => ({
        name: c,
        address: coinLookup(c),
        key: nanoid(),
      }));

      newTables.push({
        reason: "Coin Lookup",
        data: JSON.stringify(data),
      });

      return recursiveLLMcall(
        prompts,
        tableQueryResults,
        newTables,
        recursionsRemaining - 1,
      );
    }

    case "etherscan": {
      console.log("Etherscan query found");
      // @TODO, this could be improved to handle cases where LLM returns invalid JSON
      const query = EtherscanFunctionSchema.parse(
        JSON.parse(result.additional_kwargs.function_call?.arguments ?? "{}"),
      );

      console.log("Query parsed", query);

      // Call the etherscan API
      const _etherscanData = (await getEtherscanData(query.api)) as {
        result: unknown;
      };
      // @TODO, handle errors from the etherscan API

      // Key the data here (req. for nextui table)
      const etherscanData = Array.isArray(_etherscanData.result)
        ? _etherscanData.result.map((d) => ({ ...d, key: nanoid() }))
        : [
            {
              ...(is(Object, _etherscanData.result)
                ? _etherscanData.result
                : { value: _etherscanData.result }),
              key: nanoid(),
            },
          ];

      newTables.push({
        reason: query.reason,
        data: JSON.stringify(etherscanData),
      });

      if (query.requiresFollowUpAnalysis) {
        console.log("Requires follow up analysis");

        return recursiveLLMcall(
          prompts,
          tableQueryResults,
          newTables,
          recursionsRemaining - 1,
        );
      }
    }
  }

  if (isResultFunctionCalled) {
    console.log("Result function called");
  }

  const resultFn = isResultFunctionCalled
    ? ResultFunctionSchema.parse(
        JSON.parse(result.additional_kwargs.function_call?.arguments ?? "{}"),
      )
    : { result: "" };

  return {
    tableQueryResults: newTables,
    result: resultFn.result,
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
        tables: z.array(
          z.object({
            reason: z.string(),
            data: z.string(),
          }),
        ), // NOTE: table data is too variable to not be stringified
      }),
    )
    .output(
      z.object({
        status: z.enum(["success", "error"]),
        message: z.string(),
        tables: z.array(
          z.object({
            reason: z.string(),
            data: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await recursiveLLMcall(input.messages, input.tables);

        return {
          message: result.result,
          status: "success",
          tables: result.tableQueryResults,
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
