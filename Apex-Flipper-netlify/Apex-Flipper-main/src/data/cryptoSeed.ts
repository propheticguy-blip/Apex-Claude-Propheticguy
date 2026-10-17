// Comprehensive Cryptocurrencies Universe (> $1B Market Cap)
// Strictly ordered from largest market cap to smallest.

export interface CryptoStockDef {
  symbol: string;
  name: string;
  subIndustry: string;
  marketCapNum: number; // In Billions USD
  priceApprox: number;
  dayChange?: number;
  exchange: string;
  hasOptions: boolean;
  description: string;
}

export const CRYPTO_STOCKS: CryptoStockDef[] = [
  {
    "symbol": "BTC-USD",
    "name": "Bitcoin",
    "subIndustry": "Store of Value & Digital Gold",
    "marketCapNum": 1750,
    "priceApprox": 88500,
    "dayChange": 1.25,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Decentralized digital hard money and sovereign store of value created by Satoshi Nakamoto with a fixed supply cap of 21 million"
  },
  {
    "symbol": "ETH-USD",
    "name": "Ethereum",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 310,
    "priceApprox": 2580,
    "dayChange": 0.85,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Pioneering smart contract blockchain powering decentralized applications, global finance (DeFi) & proof-of-stake consensus"
  },
  {
    "symbol": "USDT-USD",
    "name": "Tether USD",
    "subIndustry": "Stablecoins",
    "marketCapNum": 142,
    "priceApprox": 1,
    "dayChange": 0.01,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "World's most widely adopted fiat-collateralized stablecoin pegged 1:1 to the US dollar, providing global liquidity"
  },
  {
    "symbol": "SOL-USD",
    "name": "Solana",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 86,
    "priceApprox": 178,
    "dayChange": 1.65,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "High-throughput, low-latency proof-of-history blockchain engineered for mass consumer crypto adoption & decentralized finance"
  },
  {
    "symbol": "BNB-USD",
    "name": "BNB",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 82,
    "priceApprox": 575,
    "dayChange": 0.75,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Utility token powering the BNB Chain decentralized ecosystem, Binance exchange trading fee discounts & decentralized governance"
  },
  {
    "symbol": "XRP-USD",
    "name": "XRP",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 66,
    "priceApprox": 1.16,
    "dayChange": 2.1,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Digital asset built for real-time global cross-border payments, interbank liquidity & financial institution settlement"
  },
  {
    "symbol": "USDC-USD",
    "name": "USD Coin",
    "subIndustry": "Stablecoins",
    "marketCapNum": 41,
    "priceApprox": 1,
    "dayChange": 0.01,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Fully reserved, regulated digital dollar stablecoin issued by Circle with transparent monthly attestation audits"
  },
  {
    "symbol": "DOGE-USD",
    "name": "Dogecoin",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 32,
    "priceApprox": 0.22,
    "dayChange": 3.4,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Original decentralized peer-to-peer meme currency popularized by Elon Musk and a dedicated global community"
  },
  {
    "symbol": "ADA-USD",
    "name": "Cardano",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 25,
    "priceApprox": 0.72,
    "dayChange": 1.15,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Peer-reviewed, evidence-based proof-of-stake blockchain platform designed for security, scalability & formal verification"
  },
  {
    "symbol": "TRX-USD",
    "name": "TRON",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 18.5,
    "priceApprox": 0.2,
    "dayChange": 0.45,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "High-throughput smart contract platform hosting the largest volume of global USDT stablecoin transfers and peer transactions"
  },
  {
    "symbol": "AVAX-USD",
    "name": "Avalanche",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 12.5,
    "priceApprox": 29.5,
    "dayChange": 1.2,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Customizable multi-chain smart contracts platform featuring sub-second finality and application-specific Subnet architecture"
  },
  {
    "symbol": "SHIB-USD",
    "name": "Shiba Inu",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 11,
    "priceApprox": 0.000018,
    "dayChange": 2.5,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Decentralized community-led cryptocurrency ecosystem featuring the Shibarium Layer 2 network, ShibaSwap & digital identity"
  },
  {
    "symbol": "LINK-USD",
    "name": "Chainlink",
    "subIndustry": "Oracle & Infrastructure",
    "marketCapNum": 10.5,
    "priceApprox": 17.4,
    "dayChange": 1.3,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Industry-standard decentralized computing platform connecting blockchains with off-chain data feeds, CCIP cross-chain messaging & APIs"
  },
  {
    "symbol": "SUI-USD",
    "name": "Sui",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 9.8,
    "priceApprox": 3.15,
    "dayChange": 2.45,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Object-centric smart contract blockchain engineered by Mysten Labs with Move language for ultra-fast horizontal scalability"
  },
  {
    "symbol": "DOT-USD",
    "name": "Polkadot",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 9,
    "priceApprox": 6.2,
    "dayChange": 0.7,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Heterogeneous multi-chain protocol uniting a network of specialized application-specific blockchains called parachains"
  },
  {
    "symbol": "XLM-USD",
    "name": "Stellar",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 8.5,
    "priceApprox": 0.28,
    "dayChange": 1.5,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Decentralized open network enabling fast, low-cost international transfers and digital representations of global currencies"
  },
  {
    "symbol": "NEAR-USD",
    "name": "NEAR Protocol",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 8.2,
    "priceApprox": 6.6,
    "dayChange": 1.4,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "High-performance sharded proof-of-stake blockchain pioneering Nightshade sharding and chain abstraction for AI integration"
  },
  {
    "symbol": "UNI-USD",
    "name": "Uniswap",
    "subIndustry": "DeFi Protocols",
    "marketCapNum": 7.6,
    "priceApprox": 12.5,
    "dayChange": 1.25,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Leading decentralized automated market maker protocol facilitating non-custodial crypto token swaps on Ethereum and Layer 2s"
  },
  {
    "symbol": "BCH-USD",
    "name": "Bitcoin Cash",
    "subIndustry": "Store of Value & Digital Gold",
    "marketCapNum": 7.5,
    "priceApprox": 380,
    "dayChange": 0.9,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Peer-to-peer electronic cash system designed for daily transactional utility with larger block sizes for low fees"
  },
  {
    "symbol": "LTC-USD",
    "name": "Litecoin",
    "subIndustry": "Store of Value & Digital Gold",
    "marketCapNum": 6.5,
    "priceApprox": 86,
    "dayChange": 0.85,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Early cryptocurrency created by Charlie Lee as the silver to Bitcoin's gold, featuring 2.5-minute block times and Scrypt hashing"
  },
  {
    "symbol": "PEPE-USD",
    "name": "Pepe",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 6,
    "priceApprox": 0.000014,
    "dayChange": 4.2,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Viral deflationary meme coin launched on Ethereum as an homage to the iconic Pepe the Frog internet meme"
  },
  {
    "symbol": "APT-USD",
    "name": "Aptos",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 5.5,
    "priceApprox": 11.2,
    "dayChange": 1.35,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Independent Layer 1 blockchain developed by former Meta engineers utilizing the Move programming language and Block-STM engine"
  },
  {
    "symbol": "TAO-USD",
    "name": "Bittensor",
    "subIndustry": "AI & DePIN Cryptocurrencies",
    "marketCapNum": 4.6,
    "priceApprox": 615,
    "dayChange": 2.8,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Decentralized machine learning network facilitating an open, collaborative marketplace for artificial intelligence models"
  },
  {
    "symbol": "HBAR-USD",
    "name": "Hedera",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 4.5,
    "priceApprox": 0.12,
    "dayChange": 1.1,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Enterprise-grade public hashgraph network governed by global industry leaders, offering predictable ultra-low transaction fees"
  },
  {
    "symbol": "ICP-USD",
    "name": "Internet Computer",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 4.2,
    "priceApprox": 9.1,
    "dayChange": 0.95,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Decentralized world computer blockchain capable of hosting full-stack web applications, social media & AI models directly on-chain"
  },
  {
    "symbol": "XMR-USD",
    "name": "Monero",
    "subIndustry": "Store of Value & Digital Gold",
    "marketCapNum": 3.8,
    "priceApprox": 210,
    "dayChange": 0.6,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Leading privacy-focused cryptocurrency utilizing ring signatures, stealth addresses & bulletproofs for untraceable transactions"
  },
  {
    "symbol": "RENDER-USD",
    "name": "Render",
    "subIndustry": "AI & DePIN Cryptocurrencies",
    "marketCapNum": 3.5,
    "priceApprox": 6.8,
    "dayChange": 1.75,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Decentralized GPU rendering and AI computing network connecting creators with distributed idle graphics card capacity"
  },
  {
    "symbol": "KAS-USD",
    "name": "Kaspa",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 3.2,
    "priceApprox": 0.13,
    "dayChange": 1.2,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Proof-of-work cryptocurrency implementing the GHOSTDAG blockDAG protocol for high block rates and instant transaction confirmation"
  },
  {
    "symbol": "FET-USD",
    "name": "Artificial Superintelligence Alliance",
    "subIndustry": "AI & DePIN Cryptocurrencies",
    "marketCapNum": 3,
    "priceApprox": 1.2,
    "dayChange": 1.6,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Collaborative decentralized AI network merging Fetch.ai, SingularityNET and Ocean Protocol into an open-source AGI ecosystem"
  },
  {
    "symbol": "ATOM-USD",
    "name": "Cosmos",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 2.8,
    "priceApprox": 7.1,
    "dayChange": 0.8,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "The Internet of Blockchains, powered by Tendermint consensus and Inter-Blockchain Communication (IBC) for interoperability"
  },
  {
    "symbol": "AAVE-USD",
    "name": "Aave",
    "subIndustry": "DeFi Protocols",
    "marketCapNum": 2.8,
    "priceApprox": 185,
    "dayChange": 1.45,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Open-source decentralized non-custodial liquidity protocol enabling users to supply and borrow crypto assets with variable interest"
  },
  {
    "symbol": "POL-USD",
    "name": "Polygon Ecosystem Token",
    "subIndustry": "Layer 2 & Scaling",
    "marketCapNum": 2.6,
    "priceApprox": 0.35,
    "dayChange": 0.9,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Next-generation utility and staking token securing the Polygon AggLayer aggregated zero-knowledge rollup multi-chain ecosystem"
  },
  {
    "symbol": "CRO-USD",
    "name": "Cronos",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 2.5,
    "priceApprox": 0.1,
    "dayChange": 0.85,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "EVM-compatible Layer 1 blockchain interoperating with Cosmos and Ethereum, powering global Web3 payment and DeFi adoption"
  },
  {
    "symbol": "FIL-USD",
    "name": "Filecoin",
    "subIndustry": "AI & DePIN Cryptocurrencies",
    "marketCapNum": 2.2,
    "priceApprox": 4.2,
    "dayChange": 0.65,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Decentralized peer-to-peer cloud storage network that turns cloud storage into an algorithmic verifiable data marketplace"
  },
  {
    "symbol": "ARB-USD",
    "name": "Arbitrum",
    "subIndustry": "Layer 2 & Scaling",
    "marketCapNum": 2,
    "priceApprox": 0.55,
    "dayChange": 1.1,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Leading Ethereum Layer 2 optimistic rollup scaling solution providing high throughput and low gas fees while inheriting Ethereum security"
  },
  {
    "symbol": "OP-USD",
    "name": "Optimism",
    "subIndustry": "Layer 2 & Scaling",
    "marketCapNum": 2,
    "priceApprox": 1.6,
    "dayChange": 1.05,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Low-cost, lightning-fast Ethereum Layer 2 blockchain powering the interconnected Superchain ecosystem"
  },
  {
    "symbol": "INJ-USD",
    "name": "Injective",
    "subIndustry": "DeFi Protocols",
    "marketCapNum": 1.8,
    "priceApprox": 18.5,
    "dayChange": 1.5,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Blockchain optimized for finance, providing plug-and-play modules for decentralized orderbooks, derivatives & cross-chain bridges"
  },
  {
    "symbol": "RUNE-USD",
    "name": "THORChain",
    "subIndustry": "DeFi Protocols",
    "marketCapNum": 1.8,
    "priceApprox": 5.2,
    "dayChange": 1.3,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Decentralized cross-chain liquidity protocol facilitating native non-custodial swaps across Bitcoin, Ethereum, and other base blockchains"
  },
  {
    "symbol": "VET-USD",
    "name": "VeChain",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 1.8,
    "priceApprox": 0.025,
    "dayChange": 0.55,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Enterprise-friendly smart contract platform driving real-world supply chain tracking, carbon management & ESG certification"
  },
  {
    "symbol": "ALGO-USD",
    "name": "Algorand",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 1.8,
    "priceApprox": 0.22,
    "dayChange": 0.7,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Pure proof-of-stake blockchain invented by Turing Award winner Silvio Micali, achieving instant transaction finality with zero forks"
  },
  {
    "symbol": "SEI-USD",
    "name": "Sei",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 1.6,
    "priceApprox": 0.42,
    "dayChange": 1.4,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "First sector-specific Layer 1 blockchain specialized for trading and exchange order matching with ultra-fast twin-turbo consensus"
  },
  {
    "symbol": "THETA-USD",
    "name": "Theta Network",
    "subIndustry": "AI & DePIN Cryptocurrencies",
    "marketCapNum": 1.5,
    "priceApprox": 1.5,
    "dayChange": 0.8,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Decentralized video streaming and edge computing blockchain providing distributed AI computing and bandwidth sharing"
  },
  {
    "symbol": "FLOKI-USD",
    "name": "Floki",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 1.5,
    "priceApprox": 0.00016,
    "dayChange": 3.2,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Utility-driven meme coin ecosystem featuring Valhalla NFT metaverse gaming, FlokiFi crypto locker & educational platforms"
  },
  {
    "symbol": "BONK-USD",
    "name": "Bonk",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 1.4,
    "priceApprox": 0.00002,
    "dayChange": 3.5,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "First dog-themed community token on Solana, revitalizing the Solana ecosystem through extensive DeFi and web integrations"
  },
  {
    "symbol": "HNT-USD",
    "name": "Helium",
    "subIndustry": "AI & DePIN Cryptocurrencies",
    "marketCapNum": 1.4,
    "priceApprox": 8,
    "dayChange": 1.2,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Decentralized wireless IoT and 5G cellular network powered by crowdsourced hotspot hardware deployed by global node operators"
  },
  {
    "symbol": "MKR-USD",
    "name": "Maker",
    "subIndustry": "DeFi Protocols",
    "marketCapNum": 1.4,
    "priceApprox": 1520,
    "dayChange": 0.9,
    "exchange": "CRYPTO",
    "hasOptions": true,
    "description": "Governance token of MakerDAO, issuer of the decentralized multi-collateral DAI stablecoin backed by crypto and real-world assets"
  },
  {
    "symbol": "ONDO-USD",
    "name": "Ondo Finance",
    "subIndustry": "DeFi Protocols",
    "marketCapNum": 1.3,
    "priceApprox": 0.95,
    "dayChange": 1.8,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Institutional-grade decentralized finance platform tokenizing real-world financial assets including US Treasury bills and institutional funds"
  },
  {
    "symbol": "PYTH-USD",
    "name": "Pyth Network",
    "subIndustry": "Oracle & Infrastructure",
    "marketCapNum": 1.2,
    "priceApprox": 0.35,
    "dayChange": 1.15,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "First-party financial oracle network delivering sub-second market data from top global exchanges and market makers to 50+ blockchains"
  },
  {
    "symbol": "SAND-USD",
    "name": "The Sandbox",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 1.1,
    "priceApprox": 0.48,
    "dayChange": 1.4,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Decentralized virtual gaming metaverse where players build, own, and monetize interactive 3D voxel gaming experiences"
  },
  {
    "symbol": "MANA-USD",
    "name": "Decentraland",
    "subIndustry": "Meme & Community Tokens",
    "marketCapNum": 1.05,
    "priceApprox": 0.55,
    "dayChange": 1.25,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Ethereum-based virtual social reality world where users explore, purchase virtual LAND plots and interact in digital events"
  },
  {
    "symbol": "QNT-USD",
    "name": "Quant",
    "subIndustry": "Oracle & Infrastructure",
    "marketCapNum": 1.05,
    "priceApprox": 72,
    "dayChange": 0.7,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Overledger enterprise blockchain operating system enabling seamless interoperability between legacy financial systems and distributed ledgers"
  },
  {
    "symbol": "FLOW-USD",
    "name": "Flow",
    "subIndustry": "Layer 1 Blockchains",
    "marketCapNum": 1.02,
    "priceApprox": 0.65,
    "dayChange": 0.6,
    "exchange": "CRYPTO",
    "hasOptions": false,
    "description": "Developer-friendly blockchain built by Dapper Labs designed for consumer-scale decentralized gaming, entertainment & NBA Top Shot NFTs"
  }
];
