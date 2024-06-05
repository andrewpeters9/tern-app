// NOTE: I wasn't able to find an OpenAPI spec for the Etherscan API, so I'm just using the docs
// https://api.etherscan.io/apis
export const ETHERSCAN_API_DATA = `
Account APIs
Get Ether Balance for a single Address
/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest
Get Historical Ether Balance for a single Address By BlockNo
/api?module=account&action=balancehistory&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&blockno=8000000
Get Ether Balance for multiple Addresses in a single call
/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest

Separate addresses by comma, up to a maxium of 20 accounts in a single batch
Get a list of 'Normal' Transactions By Address
[Optional Parameters] startblock: starting blockNo to retrieve results, endblock: ending blockNo to retrieve results

/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc

(Returned 'isError' values: 0=No Error, 1=Got Error)

(Returns up to a maximum of the last 10000 transactions only)

Or

/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&page=1&offset=10&sort=asc

(To get paginated results use page=<page number> and offset=<max records to return>)
Get a list of 'Internal' Transactions by Address
[Optional Parameters] startblock: starting blockNo to retrieve results, endblock: ending blockNo to retrieve results

/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&sort=asc

(Returned 'isError' values: 0=No Error, 1=Got Error)

(Returns up to a maximum of the last 10000 transactions only)

Or

/api?module=account&action=txlistinternal&address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&startblock=0&endblock=2702578&page=1&offset=10&sort=asc

(To get paginated results use page=<page number> and offset=<max records to return>)
Get "Internal Transactions" by Transaction Hash
/api?module=account&action=txlistinternal&txhash=0x40eb908387324f2b575b4879cd9d7188f69c8fc9d87c901b9e2daaea4b442170

(Returned 'isError' values: 0=Ok, 1=Rejected/Cancelled)

(Returns up to a maximum of the last 10000 transactions only)
Get "Internal Transactions" by Block Range
/api?module=account&action=txlistinternal&startblock=0&endblock=2702578&page=1&offset=10&sort=asc

(Returns up to a maximum of the last 10000 transactions only)
Get a list of "ERC20 - Token Transfer Events" by Address
[Optional Parameters] startblock: starting blockNo to retrieve results, endblock: ending blockNo to retrieve results

/api?module=account&action=tokentx&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&startblock=0&endblock=999999999&sort=asc

(Returns up to a maximum of the last 10000 transactions only)

Or

/api?module=account&action=tokentx&contractaddress=0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2&page=1&offset=100&sort=asc

(To get paginated results use page=<page number> and offset=<max records to return>)

Or

/api?module=account&action=tokentx&contractaddress=0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&page=1&offset=100&sort=asc

(To get transfer events for a specific token contract, include the contractaddress parameter)
Get a list of "ERC721 - Token Transfer Events" by Address
[Optional Parameters] startblock: starting blockNo to retrieve results, endblock: ending blockNo to retrieve results

/api?module=account&action=tokennfttx&address=0x6975be450864c02b4613023c2152ee0743572325&startblock=0&endblock=999999999&sort=asc

(Returns up to a maximum of the last 10000 transactions only)

Or

/api?module=account&action=tokennfttx&contractaddress=0x06012c8cf97bead5deae237070f9587f8e7a266d&page=1&offset=100&sort=asc

(To get paginated results use page=<page number> and offset=<max records to return>)

Or

/api?module=account&action=tokennfttx&contractaddress=0x06012c8cf97bead5deae237070f9587f8e7a266d&address=0x6975be450864c02b4613023c2152ee0743572325&page=1&offset=100&sort=asc

(To get transfer events for a specific token contract, include the contractaddress parameter)
Get a list of "ERC1155 - Token Transfer Events" by Address
[Optional Parameters] startblock: starting blockNo to retrieve results, endblock: ending blockNo to retrieve results

/api?module=account&action=token1155tx&address=0x72855c26ee72bbe2db66a9a50eae750bd0f5bc88&startblock=0&endblock=999999999&sort=asc

(Returns up to a maximum of the last 10000 transactions only)

Or

/api?module=account&action=token1155tx&contractaddress=0x06012c8cf97bead5deae237070f9587f8e7a266d&page=1&offset=100&sort=asc

(To get paginated results use page=<page number> and offset=<max records to return>)

Or

/api?module=account&action=token1155tx&contractaddress=0x06012c8cf97bead5deae237070f9587f8e7a266d&address=0xba52c75764d6f594735dc735be7f1830cdf58ddf&page=1&offset=100&sort=asc

(To get transfer events for a specific token contract, include the contractaddress parameter)
Get list of Blocks Mined by Address
/api?module=account&action=getminedblocks&address=0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b&blocktype=blocks

Or

/api?module=account&action=getminedblocks&address=0x9dd134d14d1e65f84b706d6f205cd5b1cd03a46b&blocktype=blocks&page=1&offset=10

(To get paginated results use page=<page number> and offset=<max records to return>)

** type = blocks (full blocks only) or uncles (uncle blocks only)
Blocks APIs
Get Block And Uncle Rewards by BlockNo
/api?module=block&action=getblockreward&blockno=2165403
Get Estimated Block Countdown Time by BlockNo
/api?module=block&action=getblockcountdown&blockno=9100000
Get Block Number by Timestamp
[Parameters] timestamp format: Unix timestamp (supports Unix timestamps in seconds), closest value: 'before' or 'after'

/api?module=block&action=getblocknobytime&timestamp=1578638524&closest=before
Event Logs
The Event Log API was designed to provide an alternative to the native eth_getLogs. Below are the list of supported filter parameters:

        . fromBlock, toBlock, address
        . topic0, topic1, topic2, topic3 (32 Bytes per topic)
        . topic0_1_opr (and|or between topic0 & topic1), topic1_2_opr (and|or between topic1 & topic2), topic2_3_opr (and|or between topic2 & topic3), topic0_2_opr (and|or between topic0 & topic2), topic0_3_opr (and|or between topic0 & topic3), topic1_3_opr (and|or between topic1 & topic3)

    - FromBlock & ToBlock accepts the blocknumber (integer, NOT hex) or 'latest' (earliest & pending is NOT supported yet)
    - Topic Operator (opr) choices are either 'and' or 'or' and are restricted to the above choices only
    - FromBlock & ToBlock parameters are required
    - An address and/or topic(X) parameters are required, when multiple topic(X) parameters are used the topicX_X_opr (and|or operator) is also required
    - For performance & security considerations, only the first 1000 results are return. So please narrow down the filter parameters

Here are some examples of how this filter maybe used:

Get Event Logs from block number 379224 to 'latest' Block, where log address = 0x33990122638b9132ca29c723bdf037f1a891a70c and topic[0] = 0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545

/api?module=logs&action=getLogs
&fromBlock=379224
&toBlock=latest
&address=0x33990122638b9132ca29c723bdf037f1a891a70c
&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545


Get Event Logs from block number 379224 to block 400000 , where log address = 0x33990122638b9132ca29c723bdf037f1a891a70c, topic[0] = 0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545 'AND' topic[1] = 0x72657075746174696f6e00000000000000000000000000000000000000000000

/api?module=logs&action=getLogs
&fromBlock=379224
&toBlock=400000
&address=0x33990122638b9132ca29c723bdf037f1a891a70c
&topic0=0xf63780e752c6a54a94fc52715dbc5518a3b4c3c2833d301a204226548a2a8545
&topic0_1_opr=and
&topic1=0x72657075746174696f6e00000000000000000000000000000000000000000000

Geth/Parity Proxy APIs
The following are the limited list of supported Proxied APIs for Geth available through Etherscan.

For the list of the parameters and descriptions please see https://github.com/ethereum/wiki/wiki/JSON-RPC. Parameters provided should be named like in the examples below. For compatibility with Parity, please prefix all hex strings with "0x"
eth_blockNumber
Returns the number of most recent block

/api?module=proxy&action=eth_blockNumber
eth_getBlockByNumber
Returns information about a block by block number

/api?module=proxy&action=eth_getBlockByNumber&tag=0x10d4f&boolean=true
eth_getUncleByBlockNumberAndIndex
Returns information about a uncle by block number

/api?module=proxy&action=eth_getUncleByBlockNumberAndIndex&tag=0x210A9B&index=0x0
eth_getBlockTransactionCountByNumber
Returns the number of transactions in a block from a block matching the given block number

/api?module=proxy&action=eth_getBlockTransactionCountByNumber&tag=0x10FB78
eth_getTransactionByHash
Returns the information about a transaction requested by transaction hash

/api?module=proxy&action=eth_getTransactionByHash&txhash=0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1
eth_getTransactionByBlockNumberAndIndex
Returns information about a transaction by block number and transaction index position

/api?module=proxy&action=eth_getTransactionByBlockNumberAndIndex&tag=0x10d4f&index=0x0
eth_getTransactionCount
Returns the number of transactions sent from an address

/api?module=proxy&action=eth_getTransactionCount&address=0x2910543af39aba0cd09dbb2d50200b3e800a63d2&tag=latest
eth_sendRawTransaction
Creates new message call transaction or a contract creation for signed transactions

/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080

(Replace the hex value with your raw hex encoded transaction that you want to send.
Send as a POST request, if your hex code is particularly long)
eth_getTransactionReceipt
Returns the receipt of a transaction by transaction hash

/api?module=proxy&action=eth_getTransactionReceipt&txhash=0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1
eth_call
Executes a new message call immediately without creating a transaction on the block chain

/api?module=proxy&action=eth_call&to=0xAEEF46DB4855E25702F8237E8f403FddcaF931C0&data=0x70a08231000000000000000000000000e16359506c028e51f16be38986ec5746251e9724&tag=latest

(The gas parameter to eth_call are capped at 2x the current block gas limit)
eth_getCode
Returns code at a given address

/api?module=proxy&action=eth_getCode&address=0xf75e354c5edc8efed9b59ee9f67a80845ade7d0c&tag=latest
eth_getStorageAt
Returns the value from a storage position at a given address

/api?module=proxy&action=eth_getStorageAt&address=0x6e03d9cce9d60f3e9f2597e13cd4c54c55330cfd&position=0x0&tag=latest
eth_gasPrice
Returns the current price per gas in wei

/api?module=proxy&action=eth_gasPrice
eth_estimateGas
Makes a call or transaction, which won't be added to the blockchain and returns the used gas, which can be used for estimating the used gas

/api?module=proxy&action=eth_estimateGas&to=0xf0160428a8552ac9bb7e050d90eeade4ddd52843&value=0xff22&gasPrice=0x051da038cc&gas=0xffffff

(The gas parameter to eth_estimateGas are capped at 2x the current block gas limit)
Token Info APIs
Get ERC20-Token TotalSupply by ContractAddress
/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055
Get Historical ERC20-Token TotalSupply by ContractAddress & BlockNo
/api?module=stats&action=tokensupplyhistory&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&blockno=8000000
Get ERC20-Token Account Balance for TokenContractAddress
/api?module=account&action=tokenbalance&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&tag=latest
Get Historical ERC20-Token Account Balance for TokenContractAddress by BlockNo
/api?module=account&action=tokenbalancehistory&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&address=0xe04f27eb70e025b78871a2ad7eabe85e61212761&blockno=8000000
Get Token Info by ContractAddress
/api?module=token&action=tokeninfo&contractaddress=0x0e3a2a1f2146d86a604adc220b4967a898d7fe07
Gas Tracker APIs
Get Estimation of Confirmation Time
/api?module=gastracker&action=gasestimate&gasprice=2000000000

(Result returned in seconds, gasprice value in Wei)
Get Gas Oracle
/api?module=gastracker&action=gasoracle
General Stats APIs
Get Total Supply of Ether
/api?module=stats&action=ethsupply

(Result returned in Wei, to get value in Ether divide resultAbove/1000000000000000000)
Get ETHER Last Price
/api?module=stats&action=ethprice
Get Ethereum Nodes Size
[Parameters] startdate and enddate format 'yyyy-MM-dd', clienttype value is 'geth' or 'parity', syncmode value is 'default' or 'archive'

/api?module=stats&action=chainsize&startdate=2019-02-01&enddate=2019-02-28&clienttype=geth&syncmode=default&sort=asc

(The chainsize return in bytes.)
Get ETHER Historical Price
[Parameters] startdate and enddate format 'yyyy-MM-dd'

/api?module=stats&action=ethdailyprice&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get ETHER Historical Daily Market Cap
/api?module=stats&action=ethdailymarketcap&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Transaction Count
/api?module=stats&action=dailytx&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily New Address Count
/api?module=stats&action=dailynewaddress&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Average Block Size
/api?module=stats&action=dailyavgblocksize&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Average Block Time for A Block to be Included in the Ethereum Blockchain
/api?module=stats&action=dailyavgblocktime&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Average Gas Price Used
/api?module=stats&action=dailyavggasprice&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Average Gas Limit
/api?module=stats&action=dailyavggaslimit&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Total Gas Used
/api?module=stats&action=dailygasused&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Block Rewards
/api?module=stats&action=dailyblockrewards&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Block Count and Block Rewards
/api?module=stats&action=dailyblkcount&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Uncle Block Count and Uncle Block Rewards
/api?module=stats&action=dailyuncleblkcount&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Average Network Hash Rate
/api?module=stats&action=dailyavghashrate&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Average Network Difficulty
/api?module=stats&action=dailyavgnetdifficulty&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Total Transaction Fee
/api?module=stats&action=dailytxnfee&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily Network Utilization
/api?module=stats&action=dailynetutilization&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get Daily ENS Registration Count
/api?module=stats&action=dailyensregister&startdate=2019-02-01&enddate=2019-02-28&sort=asc
Get DeFi Leaderboard
[Parameters] date format 'yyyy-MM-dd', sortby value is 'marketcap' or 'totallock'

/api?module=stats&action=defileaderboard&date=2020-09-01&sortby=marketcap&sort=desc




`;
