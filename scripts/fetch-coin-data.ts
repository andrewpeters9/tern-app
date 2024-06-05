import wretch from 'wretch';
import QueryStringAddon from "wretch/addons/queryString";
// import {COIN_DATA} from "@/ai/data/coin-data";

// const getTokenAddress = async (tokenId: string) => {
//     const url = `https://api.coingecko.com/api/v3/coins/${tokenId}`;
//
//     const response = await fetch(url);
//     const data = await response.json();
//
//     if (data && data.contract_address) {
//         return data.contract_address;
//     } else {
//         throw new Error('Token not found');
//     }
// };
//
// getTokenAddress('tether').then(console.log).catch(console.error);

export const w = wretch().addon(QueryStringAddon);

// const getTop20Cryptos = async () => {
//     const response = await w
//         .url('https://api.coingecko.com/api/v3/coins/list')
//         .query({
//             vs_currency: 'usd',
//             order: 'market_cap_desc',
//             per_page: 50,
//             page: 1,
//             sparkline: false,
//         })
//         .get();
//
//     const data = await response.json();
//     return data;
// };
//
// getTop20Cryptos().then(console.log).catch(console.error);


// const getTop500ethTokens = async () => {
//     const top500ids = COIN_DATA_BY_MCAP.map(c => c.id);
//     const top500byPlatform = COIN_DATA.filter(([id]) => top500ids.includes(id));
//
//     console.log(Object.fromEntries(top500byPlatform.map(([id, ticker, name, contractAddress]) => [name, contractAddress])));
// }
//
// getTop500ethTokens().then(console.log).catch(console.error);
//
