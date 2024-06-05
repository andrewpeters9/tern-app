import { z } from "zod";
import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

export const EtherscanAPISchema = z.object({
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address")
    .optional(),
  contractaddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address")
    .optional(),
  txhash: z
    .string()
    .regex(/^0x([A-Fa-f0-9]{64})$/, "Invalid transaction hash")
    .optional(),
  tag: z.literal("latest").optional(),
  blockno: z.number().int().optional(),
  startblock: z.number().int().gte(0).optional(),
  endblock: z.number().int().gte(0).optional(),
  blocktype: z.enum(["blocks", "uncles"]).optional(),
  addressList: z
    .string()
    .refine(
      (val) => val.split(",").every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)),
      "Invalid Ethereum address list",
    )
    .optional(),
  module: z.enum(["account", "contract", "stats", "token"]),
  action: z.enum([
    "balance",
    "balancehistory",
    "balancemulti",
    "txlist",
    "txlistinternal",
    "tokenbalance",
    "tokenbalancehistory",
    "tokentx",
    "tokennfttx",
    "token1155tx",
    "getminedblocks",
  ]),
  page: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(1).max(100).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});

export const w = wretch().addon(QueryStringAddon);

export const getEtherscanData = async (
  query: z.infer<typeof EtherscanAPISchema>,
) => {
  const response = await w
    .url("https://api.etherscan.io/api")
    .query({
      ...query,
      apikey: process.env.ETHERSCAN_API_KEY,
    })
    .get()
    .json();

  return response;
};
