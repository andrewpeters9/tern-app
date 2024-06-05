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

const TOP_ETH_TOKENS: Record<string, `0x${string}`> = {
  Aave: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
  Arbitrum: "0xb50721bcf8d664c30412cfbc6cf7a15145234ad1",
  "Axie Infinity": "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b",
  Beam: "0x62d0a8458ed7719fdaf978fe5929c6d342b0bfce",
  BNB: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
  "Bitget Token": "0x19de6b897ed14a376dda0fe53a5420d2ac828a28",
  BitTorrent: "0xc669928185dbce49d2230cc9b0979be6dc797957",
  Bonk: "0x1151cb3d861920e07a38e03eead12c32178567f6",
  Chainlink: "0x514910771af9ca656af840dff83e8264ecf986ca",
  Chiliz: "0x3506424f91fd33084466f402d5d97f05f8e3b4af",
  Cronos: "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b",
  Dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
  Ethena: "0x57e114b691db790c35207b2e685d4a43181e6061",
  "Ethena USDe": "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
  "Fetch.ai": "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85",
  "First Digital USD": "0xc5f0f7b66764f6ec8c8dff7ba683102295e16409",
  FLOKI: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
  GALA: "0xd1d2eb1b1e90b638588728b4130137d262c87cae",
  Gate: "0xe66747a101bff2dba3697199dcce5b743b454759",
  Immutable: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
  Injective: "0xe28b3b32b6c345a34ff64674606124dd5aceca30",
  "Kelp DAO Restaked ETH": "0xa1290d69c65a6fe4df752f95823fae25cb99e5a7",
  "LEO Token": "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3",
  "Lido DAO": "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
  Maker: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  Mantle: "0x3c3a81e81dc49a522a592e7622a7e711c06bf354",
  "Mantle Staked Ether": "0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa",
  Polygon: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
  "NEAR Protocol": "0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4",
  OKB: "0x75231f58b43240c9718dd58b4967c5114342a86c",
  Ondo: "0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3",
  Pepe: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
  Quant: "0x4a220e6096b25eadb88358cb44068a3248254675",
  Render: "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",
  "Renzo Restaked ETH": "0xbf5495efe5db9ce00f80364c8b423567e58d2110",
  "Rocket Pool ETH": "0xae78736cd615f374d3085123a210448e74fc6393",
  "Shiba Inu": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
  SingularityNET: "0x5b7533812759b45c2b44c19e320ba2cd2681b542",
  "Lido Staked Ether": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
  Starknet: "0xca14007eff0db1f8135f4c25b34de49ab0d42766",
  Tether: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "The Graph": "0xc944e90c64b2c07662a292be6244bdf05cda44a7",
  Toncoin: "0x582d872a1b094fc48f5de31d3b73f2d9be47def1",
  "The Sandbox": "0x3845badade8e6dff049820680d1f14bd3903a5d0",
  Uniswap: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "WhiteBIT Coin": "0x925206b8a707096ed26ae47c84747fe0bb734f59",
  Worldcoin: "0x163f8c2467924be0ae7b5347228cabf260318753",
  Wormhole: "0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91",
  "Wrapped Bitcoin": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  "Wrapped eETH": "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
};
