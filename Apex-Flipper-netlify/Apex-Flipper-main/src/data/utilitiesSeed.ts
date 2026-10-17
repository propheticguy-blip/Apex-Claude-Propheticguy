// Comprehensive US Utilities Sector Universe (> $1B Market Cap)
// Tradable on US brokerages (NYSE & NASDAQ)
// Spanning Electric Utilities, Multi-Utilities, Gas Utilities, Water Utilities,
// Independent Power Producers & Energy Traders, and Renewable Electricity.
// Strictly ordered from largest market cap to smallest.

export interface UtilityStockDef {
  symbol: string;
  name: string;
  subIndustry: string;
  marketCapNum: number; // In Billions USD
  priceApprox: number;
  dayChange?: number;
  exchange: 'NYSE' | 'NASDAQ';
  hasOptions: boolean;
  description: string;
}

export const UTILITIES_STOCKS: UtilityStockDef[] = [
  {
    "symbol": "NEE",
    "name": "NextEra Energy, Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 155,
    "priceApprox": 75.5,
    "dayChange": 0.45,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "World's largest utility company, operating Florida Power & Light alongside NextEra Energy Resources clean energy generation"
  },
  {
    "symbol": "SO",
    "name": "The Southern Company",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 98,
    "priceApprox": 89.2,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Premier energy provider in the Southeast US, serving 9 million customers with regulated electric utilities and Vogtle nuclear units"
  },
  {
    "symbol": "DUK",
    "name": "Duke Energy Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 92,
    "priceApprox": 118.5,
    "dayChange": 0.4,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "One of the largest energy holding companies in the US, distributing electricity to 8.4 million customers in the Carolinas, Florida & Midwest"
  },
  {
    "symbol": "CEG",
    "name": "Constellation Energy Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 85,
    "priceApprox": 268,
    "dayChange": 1.65,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Nation's largest producer of carbon-free energy, supplying 24/7 nuclear power to hyperscale data centers and commercial customers"
  },
  {
    "symbol": "VST",
    "name": "Vistra Corp.",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 78,
    "priceApprox": 135,
    "dayChange": 1.45,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Leading retail electricity supplier and competitive power generator combining dispatchable natural gas, nuclear & battery storage"
  },
  {
    "symbol": "SRE",
    "name": "Sempra",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 56,
    "priceApprox": 88,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy infrastructure champion serving 40 million consumers through Southern California Gas, San Diego Gas & Electric, Oncor & Sempra Infrastructure LNG"
  },
  {
    "symbol": "AEP",
    "name": "American Electric Power Company, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 52,
    "priceApprox": 98.5,
    "dayChange": 0.35,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Major electric utility operating the nation's largest transmission electricity network across 11 Midwestern and Appalachian states"
  },
  {
    "symbol": "D",
    "name": "Dominion Energy, Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 48,
    "priceApprox": 57,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Regulated electric utility providing power to Northern Virginia's 'Data Center Alley' alongside Coastal Virginia Offshore Wind generation"
  },
  {
    "symbol": "NGG",
    "name": "National Grid plc",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 45,
    "priceApprox": 62.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "International electricity and gas transmission and distribution company operating high-voltage networks in the UK and northeastern US"
  },
  {
    "symbol": "PCG",
    "name": "PG&E Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 44,
    "priceApprox": 20.5,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Northern and Central California natural gas and electric utility enterprise serving 16 million residents across 70,000 square miles"
  },
  {
    "symbol": "EXC",
    "name": "Exelon Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 41,
    "priceApprox": 40.8,
    "dayChange": 0.2,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Nation's largest pure-play regulated transmission and distribution utility, delivering power through ComEd, PECO, BGE, Pepco, Delmarva & ACE"
  },
  {
    "symbol": "PEG",
    "name": "Public Service Enterprise Group Incorporated",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 40,
    "priceApprox": 81,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "New Jersey's oldest and largest public utility, operating PSE&G electric and gas delivery and carbon-free nuclear generation"
  },
  {
    "symbol": "ED",
    "name": "Consolidated Edison, Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 34,
    "priceApprox": 98,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Iconic energy provider operating the electric, gas, and steam delivery network throughout New York City and Westchester County"
  },
  {
    "symbol": "XEL",
    "name": "Xcel Energy Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 33,
    "priceApprox": 59,
    "dayChange": 0.3,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Regulated electric and natural gas utility serving 3.8 million electricity and 2.1 million natural gas customers across 8 Western and Midwestern states"
  },
  {
    "symbol": "WEC",
    "name": "WEC Energy Group, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 31,
    "priceApprox": 96.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Midwest energy holding company providing regulated natural gas and electric service to 4.7 million customers in Wisconsin, Illinois, Michigan & Minnesota"
  },
  {
    "symbol": "EIX",
    "name": "Edison International",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 31,
    "priceApprox": 80.5,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Parent company of Southern California Edison (SCE), supplying electric power to 15 million people across 50,000 square miles"
  },
  {
    "symbol": "ETR",
    "name": "Entergy Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 28,
    "priceApprox": 132,
    "dayChange": 0.4,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Electric power production and retail distribution company operating in Arkansas, Louisiana, Mississippi, and Texas with a large nuclear fleet"
  },
  {
    "symbol": "AEE",
    "name": "Ameren Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 26,
    "priceApprox": 97,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Public utility holding company providing electric and natural gas services to 2.4 million electric and 900,000 gas customers across Missouri and Illinois"
  },
  {
    "symbol": "AWK",
    "name": "American Water Works Company, Inc.",
    "subIndustry": "Water Utilities",
    "marketCapNum": 26,
    "priceApprox": 133,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Largest and most geographically diverse publicly traded US water and wastewater utility, serving 14 million people in 14 states"
  },
  {
    "symbol": "DTE",
    "name": "DTE Energy Company",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 25,
    "priceApprox": 122,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Diversified energy company operating DTE Electric and DTE Gas, serving 2.3 million electric and 1.3 million natural gas customers in Michigan"
  },
  {
    "symbol": "FE",
    "name": "FirstEnergy Corp.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 24,
    "priceApprox": 41.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Electric utility company operating one of the nation's largest transmission systems and 10 regulated distribution companies across 6 states"
  },
  {
    "symbol": "PPL",
    "name": "PPL Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 24,
    "priceApprox": 32.8,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Regulated utility company delivering electricity and natural gas to 3.6 million customers in Pennsylvania, Kentucky, Rhode Island & Virginia"
  },
  {
    "symbol": "ES",
    "name": "Eversource Energy",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 22,
    "priceApprox": 62.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "New England's premier energy delivery system, transmitting and distributing electricity, natural gas, and water to 4.4 million customers in CT, MA & NH"
  },
  {
    "symbol": "CNP",
    "name": "CenterPoint Energy, Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 21,
    "priceApprox": 32.5,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Regulated energy delivery company with electric transmission & distribution in the Houston metropolitan area and natural gas utilities across 6 states"
  },
  {
    "symbol": "CMS",
    "name": "CMS Energy Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 21,
    "priceApprox": 69,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Michigan-focused utility operating Consumers Energy, providing electric and natural gas service to 6.8 million residents"
  },
  {
    "symbol": "ATO",
    "name": "Atmos Energy Corporation",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 20,
    "priceApprox": 138,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Nation's largest fully regulated natural gas-only distributor, delivering safe, reliable gas service to 3 million customers across 8 southern states"
  },
  {
    "symbol": "NRG",
    "name": "NRG Energy, Inc.",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 20,
    "priceApprox": 96,
    "dayChange": 0.75,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Leading consumer energy and smart home company delivering retail electricity, natural gas, and home security services across North America"
  },
  {
    "symbol": "EBR",
    "name": "Centrais Elétricas Brasileiras S.A. - Eletrobras",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 18.5,
    "priceApprox": 8.2,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Latin America's largest electric power generation and transmission company, generating clean hydroelectric energy across Brazil"
  },
  {
    "symbol": "BEP",
    "name": "Brookfield Renewable Partners L.P.",
    "subIndustry": "Renewable Electricity",
    "marketCapNum": 16.5,
    "priceApprox": 26.5,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Globally diversified pure-play renewable power platform operating hydroelectric, wind, solar, and distributed energy generation portfolios"
  },
  {
    "symbol": "BIP",
    "name": "Brookfield Infrastructure Partners L.P.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 16,
    "priceApprox": 34,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Global infrastructure vehicle owning and operating critical utilities, transport, midstream energy, and telecom data infrastructure"
  },
  {
    "symbol": "EVRG",
    "name": "Evergy, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 15.5,
    "priceApprox": 67,
    "dayChange": 0.25,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Regulated electric utility providing clean, safe, and reliable electricity to 1.7 million residential and commercial customers in Kansas and Missouri"
  },
  {
    "symbol": "LNT",
    "name": "Alliant Energy Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 15,
    "priceApprox": 58.5,
    "dayChange": 0.2,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Public utility holding company supplying regulated electricity and natural gas to 1 million electric and 425,000 gas customers in Iowa and Wisconsin"
  },
  {
    "symbol": "NI",
    "name": "NiSource Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 15,
    "priceApprox": 33.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy holding company operating Columbia Gas and NIPSCO, delivering natural gas and electricity to 3.7 million customers in 6 states"
  },
  {
    "symbol": "SBS",
    "name": "Companhia de Saneamento Básico do Estado de São Paulo - Sabesp",
    "subIndustry": "Water Utilities",
    "marketCapNum": 11.5,
    "priceApprox": 16.8,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "One of the world's largest water and sewage sanitation companies, providing water supply and sanitation services to 28 million people in São Paulo"
  },
  {
    "symbol": "TLN",
    "name": "Talen Energy Corporation",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 11,
    "priceApprox": 215,
    "dayChange": 1.85,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Independent power producer operating the Susquehanna nuclear plant, powering high-density data centers via direct-connect campus infrastructure"
  },
  {
    "symbol": "AES",
    "name": "The AES Corporation",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 10.5,
    "priceApprox": 14.8,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Global power company operating regulated utilities (AES Indiana, AES Ohio) alongside green solar, wind, and Fluence battery energy storage"
  },
  {
    "symbol": "WTRG",
    "name": "Essential Utilities, Inc.",
    "subIndustry": "Water Utilities",
    "marketCapNum": 10.5,
    "priceApprox": 38.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Regulated utility company delivering drinking water, wastewater services (Aqua) and natural gas distribution (Peoples) to 5 million people"
  },
  {
    "symbol": "PNW",
    "name": "Pinnacle West Capital Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 10,
    "priceApprox": 88,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Parent company of Arizona Public Service (APS), providing electric service to 1.4 million customers in fast-growing Phoenix and Arizona territory"
  },
  {
    "symbol": "OGE",
    "name": "OGE Energy Corp.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 8.2,
    "priceApprox": 40.8,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy holding company operating Oklahoma Gas and Electric Company (OG&E), serving 900,000 electric customers across Oklahoma and western Arkansas"
  },
  {
    "symbol": "CPL",
    "name": "CPFL Energia S.A.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 7.5,
    "priceApprox": 13.2,
    "dayChange": 0.18,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Major Brazilian integrated electric utility distributing power to 10 million consumers across São Paulo, Rio Grande do Sul, Paraná & Minas Gerais"
  },
  {
    "symbol": "IDA",
    "name": "IDACORP, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 5.8,
    "priceApprox": 114,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Electric utility holding company operating Idaho Power, utilizing low-cost hydroelectric power to serve 630,000 customers in southern Idaho and eastern Oregon"
  },
  {
    "symbol": "SWX",
    "name": "Southwest Gas Holdings, Inc.",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 5.6,
    "priceApprox": 77.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Regulated natural gas utility company delivering safe and reliable energy to 2.2 million customers in Arizona, Nevada, and California"
  },
  {
    "symbol": "CWEN",
    "name": "Clearway Energy, Inc.",
    "subIndustry": "Renewable Electricity",
    "marketCapNum": 5.5,
    "priceApprox": 27.2,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "One of the largest renewable energy owners in the US with 6,000+ net MW of wind, solar, and flexible natural gas generation assets"
  },
  {
    "symbol": "CIG",
    "name": "Companhia Energética de Minas Gerais - CEMIG",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 5.2,
    "priceApprox": 2.1,
    "dayChange": 0.05,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "State-controlled Brazilian utility giant generating, transmitting, and distributing electric power in Minas Gerais state"
  },
  {
    "symbol": "UGI",
    "name": "UGI Corporation",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 5.2,
    "priceApprox": 24.8,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "International energy distributor operating regulated gas and electric utilities in Pennsylvania, AmeriGas propane & European LPG delivery"
  },
  {
    "symbol": "POR",
    "name": "Portland General Electric Company",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 5.1,
    "priceApprox": 48.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Fully integrated electric utility serving 930,000 customers in Portland and Oregon's Willamette Valley with wind, hydro & clean energy"
  },
  {
    "symbol": "NJR",
    "name": "New Jersey Resources Corporation",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 4.8,
    "priceApprox": 48.2,
    "dayChange": 0.22,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy services holding company operating New Jersey Natural Gas, delivering natural gas to 575,000 residential and commercial customers"
  },
  {
    "symbol": "ORA",
    "name": "Ormat Technologies, Inc.",
    "subIndustry": "Renewable Electricity",
    "marketCapNum": 4.8,
    "priceApprox": 78.5,
    "dayChange": 0.45,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Leading geothermal and recovered energy power generation company, operating baseload geothermal plants and utility battery storage systems"
  },
  {
    "symbol": "ELP",
    "name": "Companhia Paranaense de Energia - Copel",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 4.8,
    "priceApprox": 7.9,
    "dayChange": 0.12,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Privatized Brazilian utility enterprise generating, transmitting, and distributing electricity to 5 million consumer units in Paraná state"
  },
  {
    "symbol": "TXNM",
    "name": "TXNM Energy, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 4.2,
    "priceApprox": 47,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy holding company operating Public Service Company of New Mexico (PNM) and Texas-New Mexico Power (TNMP) utilities"
  },
  {
    "symbol": "BKH",
    "name": "Black Hills Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 4.2,
    "priceApprox": 61.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Customer-focused utility company providing regulated electric and natural gas service to 1.3 million customers in 8 Western & Midwestern states"
  },
  {
    "symbol": "OGS",
    "name": "ONE Gas, Inc.",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 4,
    "priceApprox": 71,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "100% regulated natural gas distribution utility serving 2.3 million customers in Oklahoma, Kansas, and Texas through Oklahoma Natural Gas, Kansas Gas Service & Texas Gas Service"
  },
  {
    "symbol": "AQN",
    "name": "Algonquin Power & Utilities Corp.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 4,
    "priceApprox": 5.8,
    "dayChange": 0.1,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Diversified international generation, transmission, and distribution utility providing regulated water, electricity, and gas to 1 million+ customer connections"
  },
  {
    "symbol": "SR",
    "name": "Spire Inc.",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 3.8,
    "priceApprox": 68.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Public utility holding company providing safe, reliable natural gas service to 1.7 million homes and businesses across Missouri, Alabama & Mississippi"
  },
  {
    "symbol": "PAM",
    "name": "Pampa Energía S.A.",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 3.8,
    "priceApprox": 64,
    "dayChange": 0.65,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Leading independent energy integrated company in Argentina, generating electricity, producing natural gas & transporting high-voltage power"
  },
  {
    "symbol": "OTTR",
    "name": "Otter Tail Corporation",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 3.6,
    "priceApprox": 86.5,
    "dayChange": 0.35,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Diversified utility company operating Otter Tail Power across Minnesota, North Dakota & South Dakota alongside manufacturing & plastics operations"
  },
  {
    "symbol": "ALE",
    "name": "ALLETE, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 3.6,
    "priceApprox": 62.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy company providing regulated electric service to northern Minnesota and northwestern Wisconsin, serving large industrial iron ore customers"
  },
  {
    "symbol": "NWE",
    "name": "NorthWestern Energy Group, Inc.",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 3.5,
    "priceApprox": 56.5,
    "dayChange": 0.2,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Regulated utility company delivering electricity and natural gas to 775,000 customers in Montana, South Dakota, Nebraska & Yellowstone National Park"
  },
  {
    "symbol": "MGEE",
    "name": "MGE Energy, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 3.2,
    "priceApprox": 88,
    "dayChange": 0.25,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Public utility holding company operating Madison Gas and Electric, delivering electricity and natural gas to the greater Madison, Wisconsin region"
  },
  {
    "symbol": "AWR",
    "name": "American States Water Company",
    "subIndustry": "Water Utilities",
    "marketCapNum": 3.2,
    "priceApprox": 84.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Water and electric utility holding company operating Golden State Water and providing contracted water services to US military bases nationwide"
  },
  {
    "symbol": "CWT",
    "name": "California Water Service Group",
    "subIndustry": "Water Utilities",
    "marketCapNum": 3.1,
    "priceApprox": 52,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Third-largest publicly traded water utility in the United States, providing regulated water service to 2 million people in California, Hawaii, Washington & New Mexico"
  },
  {
    "symbol": "AVA",
    "name": "Avista Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 3,
    "priceApprox": 38.5,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Energy company involved in the production, transmission, and distribution of energy, serving 415,000 electric and 380,000 natural gas customers in the Pacific Northwest"
  },
  {
    "symbol": "TAC",
    "name": "TransAlta Corporation",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 2.8,
    "priceApprox": 9.1,
    "dayChange": 0.1,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Clean electricity provider operating hydro, wind, solar, and natural gas facilities in Canada, the United States, and Australia"
  },
  {
    "symbol": "CPK",
    "name": "Chesapeake Utilities Corporation",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 2.6,
    "priceApprox": 118,
    "dayChange": 0.35,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Diversified energy delivery company engaged in regulated natural gas and electric distribution, transmission pipelines, and propane across the Mid-Atlantic and Florida"
  },
  {
    "symbol": "ENIC",
    "name": "Enel Chile S.A.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 2.5,
    "priceApprox": 3.6,
    "dayChange": 0.05,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Largest electricity company in Chile, operating renewable hydro, solar, and geothermal power generation alongside Santiago distribution networks"
  },
  {
    "symbol": "NEP",
    "name": "NextEra Energy Partners, LP",
    "subIndustry": "Renewable Electricity",
    "marketCapNum": 2.4,
    "priceApprox": 25.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Growth-oriented partnership acquiring, managing, and owning contracted clean energy projects with long-term cash flows across the US"
  },
  {
    "symbol": "SJW",
    "name": "SJW Group",
    "subIndustry": "Water Utilities",
    "marketCapNum": 1.85,
    "priceApprox": 57,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Water utility company providing drinking water and wastewater services to 1.5 million people in Silicon Valley (San Jose Water), Connecticut, Maine & Texas"
  },
  {
    "symbol": "KEN",
    "name": "Kenon Holdings Ltd.",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 1.8,
    "priceApprox": 33.5,
    "dayChange": 0.25,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Global holding company owning controlling interests in OPC Energy, a leading independent power producer operating natural gas and renewable plants"
  },
  {
    "symbol": "CEPU",
    "name": "Central Puerto S.A.",
    "subIndustry": "Independent Power Producers & Energy Traders",
    "marketCapNum": 1.7,
    "priceApprox": 11.2,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Argentina's premier private electric power generator, operating thermal combined-cycle plants, wind farms & hydroelectric dams"
  },
  {
    "symbol": "NWN",
    "name": "Northwest Natural Holding Company",
    "subIndustry": "Gas Utilities",
    "marketCapNum": 1.6,
    "priceApprox": 43.5,
    "dayChange": 0.18,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Regulated energy provider delivering natural gas service to 800,000 customers in Oregon and Southwest Washington alongside growing water utility systems"
  },
  {
    "symbol": "HE",
    "name": "Hawaiian Electric Industries, Inc.",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 1.5,
    "priceApprox": 13.5,
    "dayChange": 0.2,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Holding company for Hawaiian Electric Company, supplying power to 95% of Hawaii's population across Oahu, Maui, Molokai, Lanai & Hawaii Island"
  },
  {
    "symbol": "EDN",
    "name": "Empresa Distribuidora y Comercializadora Norte S.A. - Edenor",
    "subIndustry": "Electric Utilities",
    "marketCapNum": 1.2,
    "priceApprox": 23.5,
    "dayChange": 0.3,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Largest electricity distribution company in Argentina by customers and energy sales, serving northwestern Greater Buenos Aires and northern Buenos Aires City"
  },
  {
    "symbol": "MSEX",
    "name": "Middlesex Water Company",
    "subIndustry": "Water Utilities",
    "marketCapNum": 1.05,
    "priceApprox": 58.5,
    "dayChange": 0.15,
    "exchange": "NASDAQ",
    "hasOptions": true,
    "description": "Water and wastewater utility operating continuous drinking water purification and distribution networks in New Jersey and Delaware"
  },
  {
    "symbol": "UTL",
    "name": "Unitil Corporation",
    "subIndustry": "Multi-Utilities",
    "marketCapNum": 1.02,
    "priceApprox": 62,
    "dayChange": 0.15,
    "exchange": "NYSE",
    "hasOptions": true,
    "description": "Public utility holding company providing regulated electric and natural gas distribution service to 130,000 customers in New Hampshire, Massachusetts & Maine"
  }
];
