import { Entries } from "type-fest";
import { ChatOpenAI } from "@langchain/openai";
import { compare } from "@langchain/core/utils/json_patch";
import {
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { FunctionDefinition } from "@langchain/core/language_models/base";
import { AIMessageChunk } from "@langchain/core/messages";

import { strongGpt } from "@/app/api/routers/ai";

export const processInput = <Input extends Record<string, unknown>>(
  input: Input,
): Input => {
  const processedInput: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input) as Entries<typeof input>) {
    // This allows us to pass better formatted data to the LLM when we are passing arrays
    processedInput[key] = Array.isArray(value)
      ? value.map((v) => {
          if (typeof v === "string") {
            return v.startsWith('"') ? v : `"${v}"`;
          }

          return v;
        })
      : value;
  }

  return processedInput as Input;
};

// Fixes weird bug with langchain
export const DO_NOT_REMOVE = compare.bind({});

const EXTRACTOR_FUNCTION = "extractor";

const bindSchemaToModel = (
  model: ChatOpenAI,
  functions: Array<FunctionDefinition> = [],
) => {
  return model.bind({
    // temperature: 0,
    response_format: {
      type: "json_object",
    },
    functions,
    // function_call: {name: EXTRACTOR_FUNCTION},
  });
};

export const sendPromptToJsonModel = async (
  prompts: Array<{
    role: "user" | "assistant";
    message: string;
  }>,
  options: {
    input: Record<string, unknown>;
    maxTokens?: number;
    model?: ChatOpenAI;
    systemMessage?: string;
    temperature?: number;
    retries?: number;
    functions?: Array<FunctionDefinition>;
  },
): Promise<AIMessageChunk> => {
  const {
    model: _model = strongGpt,
    maxTokens,
    input,
    temperature,
    systemMessage = "",
    retries = 2,
    functions,
  } = options;

  const model = new ChatOpenAI({
    modelName: _model.modelName,
    temperature: temperature ?? _model.temperature,
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
    cache: _model.cache,
    maxTokens: maxTokens ?? _model.maxTokens ?? 3500,
    callbacks: _model.callbacks,
  });
  // const parser = new JsonOutputFunctionsParser();
  const modelWithFunctions = bindSchemaToModel(model, functions);

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      ...prompts.map((p) =>
        p.role === "user"
          ? HumanMessagePromptTemplate.fromTemplate(p.message)
          : AIMessagePromptTemplate.fromTemplate(p.message),
      ),
    ],
    inputVariables: Object.keys(input),
  });

  try {
    const response = await prompt
      .pipe(modelWithFunctions)
      .invoke(processInput(input), {
        // options
      });

    return response;
  } catch (error) {
    console.error(error);

    if (retries > 0) {
      return sendPromptToJsonModel(prompts, {
        ...options,
        temperature: 0.2, // increase the temperature a bit to prevent the same error from repeating
        retries: retries - 1,
      });
    }

    throw error;
  }
};
