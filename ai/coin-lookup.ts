import { TOP_ETH_TOKENS } from "@/ai/data/eth-tokens";

const removePunctuation = (str: string) => {
  return str.replaceAll(/[^\s\w]|_/g, "");
};

const removeAccents = (str: string) => {
  return str.normalize("NFD").replaceAll(/[\u0300-\u036F]/g, "");
};

const removeNumbers = (str: string) => {
  return str.replace(/\d/g, "");
};

const removeMultipleSpaces = (str: string) => {
  return str.replace(/\s+/g, " ");
};

const removeSpaces = (str: string) => {
  return str.replace(/\s/g, "");
};

/**
 * Takes a query in that can be formatted "loosely" e.g. "usdC", "Us DC"
 * @param query
 */
export const coinLookup = (query: string): `0x${string}` => {
  // The idea of this formatters array is to start as specific as possible and then move to more general
  const formatters: Array<(query: string) => string> = [
    removePunctuation,
    removeNumbers,
    removeMultipleSpaces,
    removeSpaces,
    removeAccents, // This is the last one as if a user has passed "à" then it's probably intentional
  ];

  let currentQuery = query;

  for (const formatter of formatters) {
    for (const lookupFormatter of formatters) {
      const obj = Object.fromEntries(
        Object.entries(TOP_ETH_TOKENS).map(([key, value]) => [
          lookupFormatter(key),
          value,
        ]),
      );

      if (currentQuery in obj) {
        return obj[currentQuery];
      }
    }

    currentQuery = formatter(currentQuery);
  }

  throw new Error("No match found");
};
