// Comprehensive US Materials Sector Data (> $1B Market Cap)
// All tradable on US brokerages (NYSE & NASDAQ)
// Spanning Chemicals, Metals & Mining, Construction Materials, Packaging, Paper & Forest Products

export interface MaterialsStockDef {
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

export const MATERIALS_STOCKS: MaterialsStockDef[] = [
  // ==========================================
  // MEGA-CAP MATERIALS ($50B - $250B+)
  // ==========================================
  {
    symbol: "LIN",
    name: "Linde plc",
    subIndustry: "Industrial Gases",
    marketCapNum: 230.0,
    priceApprox: 478.50,
    dayChange: 1.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Industrial gases: atmospheric oxygen, nitrogen, argon & clean hydrogen technologies"
  },
  {
    symbol: "BHP",
    name: "BHP Group Limited",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 135.0,
    priceApprox: 54.20,
    dayChange: -0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global diversified resources: iron ore, copper, metallurgical coal & potash"
  },
  {
    symbol: "RIO",
    name: "Rio Tinto Group",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 102.0,
    priceApprox: 64.80,
    dayChange: 0.42,
    exchange: "NYSE",
    hasOptions: true,
    description: "Multinational mining: iron ore, primary aluminum, copper & industrial borates"
  },
  {
    symbol: "SHW",
    name: "Sherwin-Williams Company",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 92.0,
    priceApprox: 372.40,
    dayChange: 0.88,
    exchange: "NYSE",
    hasOptions: true,
    description: "Architectural paints, Valspar, protective finishes & aerospace coatings"
  },
  {
    symbol: "SCCO",
    name: "Southern Copper Corporation",
    subIndustry: "Copper",
    marketCapNum: 85.0,
    priceApprox: 108.30,
    dayChange: 2.14,
    exchange: "NYSE",
    hasOptions: true,
    description: "Low-cost copper mining, smelting & refining operations across Mexico and Peru"
  },
  {
    symbol: "ECL",
    name: "Ecolab Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 72.0,
    priceApprox: 252.10,
    dayChange: -0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Infection prevention, industrial water treatment, hygiene & food safety chemistry"
  },
  {
    symbol: "CRH",
    name: "CRH plc",
    subIndustry: "Construction Materials",
    marketCapNum: 68.0,
    priceApprox: 98.40,
    dayChange: 1.05,
    exchange: "NYSE",
    hasOptions: true,
    description: "Heavy building materials: aggregates, cement, asphalt & infrastructure solutions"
  },
  {
    symbol: "APD",
    name: "Air Products and Chemicals, Inc.",
    subIndustry: "Industrial Gases",
    marketCapNum: 66.0,
    priceApprox: 298.60,
    dayChange: -0.72,
    exchange: "NYSE",
    hasOptions: true,
    description: "Industrial gases supply: hydrogen fueling, helium, argon & process systems"
  },
  {
    symbol: "FCX",
    name: "Freeport-McMoRan Inc.",
    subIndustry: "Copper",
    marketCapNum: 66.0,
    priceApprox: 45.80,
    dayChange: 2.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Copper and gold mining: Grasberg, Morenci & Cerro Verde operations"
  },
  {
    symbol: "GLNCY",
    name: "Glencore plc (ADR)",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 60.0,
    priceApprox: 9.80,
    dayChange: 0.55,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global natural resource extraction, metals commodity marketing & recycling"
  },
  {
    symbol: "NEM",
    name: "Newmont Corporation",
    subIndustry: "Gold",
    marketCapNum: 56.0,
    priceApprox: 48.90,
    dayChange: 1.75,
    exchange: "NYSE",
    hasOptions: true,
    description: "World's leading gold producer with active copper, silver, zinc & lead assets"
  },
  {
    symbol: "CF",
    name: "CF Industries Holdings, Inc.",
    subIndustry: "Fertilizers & Agricultural Chemicals",
    marketCapNum: 55.0,
    priceApprox: 89.20,
    dayChange: -1.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Nitrogen fertilizers, clean ammonia synthesis & crop nutrient solutions"
  },

  // ==========================================
  // LARGE-CAP MATERIALS ($25B - $50B)
  // ==========================================
  {
    symbol: "VALE",
    name: "Vale S.A.",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 45.0,
    priceApprox: 10.45,
    dayChange: -0.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global iron ore pellet producer, nickel mining & logistics infrastructure"
  },
  {
    symbol: "CTVA",
    name: "Corteva, Inc.",
    subIndustry: "Fertilizers & Agricultural Chemicals",
    marketCapNum: 42.0,
    priceApprox: 61.20,
    dayChange: 0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Pure-play agriculture: Pioneer hybrid seeds, crop protection chemicals & traits"
  },
  {
    symbol: "AEM",
    name: "Agnico Eagle Mines Limited",
    subIndustry: "Gold",
    marketCapNum: 41.0,
    priceApprox: 82.50,
    dayChange: 1.95,
    exchange: "NYSE",
    hasOptions: true,
    description: "Canadian senior gold miner operating low-risk jurisdiction precious metal mines"
  },
  {
    symbol: "DOW",
    name: "Dow Inc.",
    subIndustry: "Commodity Chemicals",
    marketCapNum: 38.0,
    priceApprox: 54.10,
    dayChange: -0.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Plastics, polyethylene packaging, industrial intermediates & silicone formulations"
  },
  {
    symbol: "IFF",
    name: "International Flavors & Fragrances Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 37.9,
    priceApprox: 98.70,
    dayChange: 0.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Food and beverage flavors, scent compounds, health enzymes & pharma polymers"
  },
  {
    symbol: "IP",
    name: "International Paper Company",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 37.7,
    priceApprox: 54.40,
    dayChange: 1.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Renewable fiber-based containerboard, corrugated packaging & absorbent pulp"
  },
  {
    symbol: "NUE",
    name: "Nucor Corporation",
    subIndustry: "Steel",
    marketCapNum: 36.0,
    priceApprox: 152.80,
    dayChange: 0.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Electric arc furnace mini-mills, recycled sheet steel, joists & engineered beams"
  },
  {
    symbol: "VMC",
    name: "Vulcan Materials Company",
    subIndustry: "Construction Materials",
    marketCapNum: 35.0,
    priceApprox: 268.30,
    dayChange: 0.75,
    exchange: "NYSE",
    hasOptions: true,
    description: "Construction aggregates: crushed stone, sand, gravel, ready-mix concrete & asphalt"
  },
  {
    symbol: "DD",
    name: "DuPont de Nemours, Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 35.0,
    priceApprox: 84.60,
    dayChange: 0.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "Specialty materials: Tyvek protective fabrics, Kevlar, Nomex & microcircuit films"
  },
  {
    symbol: "GOLD",
    name: "Barrick Gold Corporation",
    subIndustry: "Gold",
    marketCapNum: 34.0,
    priceApprox: 19.40,
    dayChange: 1.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global gold and copper producer: Nevada Gold Mines, Kibali & Loulo-Gounkoto"
  },
  {
    symbol: "NGLOY",
    name: "Anglo American plc (ADR)",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 33.5,
    priceApprox: 15.60,
    dayChange: 0.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global mining: copper, premium iron ore, metallurgical coal & crop nutrients"
  },
  {
    symbol: "LYB",
    name: "LyondellBasell Industries N.V.",
    subIndustry: "Commodity Chemicals",
    marketCapNum: 32.7,
    priceApprox: 97.50,
    dayChange: -0.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Polyolefin plastics, circular polymers, ethylene & chemical process technologies"
  },
  {
    symbol: "MLM",
    name: "Martin Marietta Materials, Inc.",
    subIndustry: "Construction Materials",
    marketCapNum: 32.2,
    priceApprox: 535.00,
    dayChange: 0.95,
    exchange: "NYSE",
    hasOptions: true,
    description: "Aggregates, crushed stone, cement, ready-mixed concrete & magnesia chemicals"
  },
  {
    symbol: "PPG",
    name: "PPG Industries, Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 31.0,
    priceApprox: 133.40,
    dayChange: 0.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Automotive OEM coatings, aerospace sealants, industrial finishes & architectural paints"
  },
  {
    symbol: "MOS",
    name: "The Mosaic Company",
    subIndustry: "Fertilizers & Agricultural Chemicals",
    marketCapNum: 30.6,
    priceApprox: 29.50,
    dayChange: -1.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Concentrated phosphate and potash crop nutrients & animal feed feedstocks"
  },
  {
    symbol: "WPM",
    name: "Wheaton Precious Metals Corp.",
    subIndustry: "Gold",
    marketCapNum: 30.0,
    priceApprox: 66.20,
    dayChange: 2.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Precious metals streaming: gold, silver & cobalt production purchase agreements"
  },
  {
    symbol: "PKG",
    name: "Packaging Corporation of America",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 27.2,
    priceApprox: 226.50,
    dayChange: 1.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Containerboard, corrugated shipping boxes & protective packaging products"
  },
  {
    symbol: "FNV",
    name: "Franco-Nevada Corporation",
    subIndustry: "Gold",
    marketCapNum: 26.0,
    priceApprox: 135.80,
    dayChange: 1.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Gold and precious metals royalty and stream portfolio across premier global mines"
  },
  {
    symbol: "NTR",
    name: "Nutrien Ltd.",
    subIndustry: "Fertilizers & Agricultural Chemicals",
    marketCapNum: 25.0,
    priceApprox: 51.20,
    dayChange: -0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "World's largest potash producer, nitrogen fertilizers & ag retail crop services"
  },

  // ==========================================
  // MID-TO-LARGE CAPS ($10B - $25B)
  // ==========================================
  {
    symbol: "SW",
    name: "Smurfit Westrock plc",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 24.0,
    priceApprox: 48.60,
    dayChange: 0.95,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global sustainable paper packaging, corrugated boxes & consumer containerboard"
  },
  {
    symbol: "TECK",
    name: "Teck Resources Limited",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 24.0,
    priceApprox: 47.10,
    dayChange: 1.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Copper and zinc mining operations supporting the global energy transition"
  },
  {
    symbol: "CCJ",
    name: "Cameco Corporation",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 24.0,
    priceApprox: 55.40,
    dayChange: 3.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Uranium fuel provider for nuclear power generation & fuel fabrication services"
  },
  {
    symbol: "MT",
    name: "ArcelorMittal",
    subIndustry: "Steel",
    marketCapNum: 23.0,
    priceApprox: 27.80,
    dayChange: 0.70,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global integrated steelmaking, automotive steels, heavy plate & tubular products"
  },
  {
    symbol: "STLD",
    name: "Steel Dynamics, Inc.",
    subIndustry: "Steel",
    marketCapNum: 21.0,
    priceApprox: 135.20,
    dayChange: 1.10,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Carbon steel manufacturing, metals recycling, steel joists & structural fabrication"
  },
  {
    symbol: "BALL",
    name: "Ball Corporation",
    subIndustry: "Metal, Glass & Plastic Containers",
    marketCapNum: 19.0,
    priceApprox: 62.40,
    dayChange: -0.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "Sustainable aluminum beverage cans, bottles & aerosol packaging containers"
  },
  {
    symbol: "RS",
    name: "Reliance, Inc.",
    subIndustry: "Steel",
    marketCapNum: 17.5,
    priceApprox: 312.00,
    dayChange: 0.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "North American metals service center network: carbon steel, aluminum & brass distribution"
  },
  {
    symbol: "AVY",
    name: "Avery Dennison Corporation",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 17.0,
    priceApprox: 212.50,
    dayChange: 0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Pressure-sensitive adhesive materials, RFID intelligent labels & packaging branding"
  },
  {
    symbol: "WLK",
    name: "Westlake Corporation",
    subIndustry: "Commodity Chemicals",
    marketCapNum: 16.0,
    priceApprox: 142.30,
    dayChange: -0.75,
    exchange: "NYSE",
    hasOptions: true,
    description: "PVC resin, vinyl building products, caustic soda & chlor-alkali specialty materials"
  },
  {
    symbol: "RPM",
    name: "RPM International Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 15.5,
    priceApprox: 122.80,
    dayChange: 0.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Specialty chemical coatings: Rust-Oleum, DAP sealants, Tremco roofing & Carboline"
  },
  {
    symbol: "AMCR",
    name: "Amcor plc",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 15.0,
    priceApprox: 10.35,
    dayChange: 0.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global flexible packaging, specialty cartons & rigid plastic containers for food & pharma"
  },
  {
    symbol: "JHX",
    name: "James Hardie Industries plc",
    subIndustry: "Construction Materials",
    marketCapNum: 15.0,
    priceApprox: 34.60,
    dayChange: 1.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "Fiber cement siding, interior backerboards & engineered architectural facades"
  },
  {
    symbol: "GFI",
    name: "Gold Fields Limited",
    subIndustry: "Gold",
    marketCapNum: 15.0,
    priceApprox: 16.80,
    dayChange: 2.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Globally diversified gold mining across Australia, South Africa, Ghana & the Americas"
  },
  {
    symbol: "IVPAF",
    name: "Ivanhoe Mines Ltd.",
    subIndustry: "Copper",
    marketCapNum: 14.0,
    priceApprox: 10.20,
    dayChange: 2.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "Ultra-high-grade copper and polymetallic mining at Kamoa-Kakula & Kipushi"
  },
  {
    symbol: "ALB",
    name: "Albemarle Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 13.0,
    priceApprox: 98.40,
    dayChange: 3.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Battery-grade lithium compounds for EV batteries & bromine flame retardants"
  },
  {
    symbol: "AU",
    name: "AngloGold Ashanti plc",
    subIndustry: "Gold",
    marketCapNum: 12.5,
    priceApprox: 29.80,
    dayChange: 2.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Independent global gold mining company with operations spanning Africa, Australia & Americas"
  },
  {
    symbol: "KGC",
    name: "Kinross Gold Corporation",
    subIndustry: "Gold",
    marketCapNum: 12.0,
    priceApprox: 9.80,
    dayChange: 1.70,
    exchange: "NYSE",
    hasOptions: true,
    description: "Senior gold mining company with operating mines in the US, Canada, Brazil & Mauritania"
  },
  {
    symbol: "CCK",
    name: "Crown Holdings, Inc.",
    subIndustry: "Metal, Glass & Plastic Containers",
    marketCapNum: 11.5,
    priceApprox: 96.20,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Aluminum beverage cans, aerosol containers, metal food cans & transit strapping"
  },
  {
    symbol: "SQM",
    name: "Sociedad Química y Minera de Chile",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 11.0,
    priceApprox: 38.60,
    dayChange: 2.70,
    exchange: "NYSE",
    hasOptions: true,
    description: "Lithium carbonate/hydroxide, potassium nitrate fertilizers & specialty plant nutrients"
  },
  {
    symbol: "RGLD",
    name: "Royal Gold, Inc.",
    subIndustry: "Gold",
    marketCapNum: 10.5,
    priceApprox: 161.40,
    dayChange: 1.50,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Precious metals stream and royalty acquisition on premier operating gold mines"
  },
  {
    symbol: "EXP",
    name: "Eagle Materials Inc.",
    subIndustry: "Construction Materials",
    marketCapNum: 10.0,
    priceApprox: 288.50,
    dayChange: 0.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Heavy construction products: Portland cement, gypsum wallboard, recycled paperboard & aggregates"
  },

  // ==========================================
  // MID-CAP MATERIALS ($5B - $10B)
  // ==========================================
  {
    symbol: "CX",
    name: "CEMEX, S.A.B. de C.V.",
    subIndustry: "Construction Materials",
    marketCapNum: 9.5,
    priceApprox: 6.40,
    dayChange: 0.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Global building materials: cement, ready-mix concrete, aggregates & urbanization solutions"
  },
  {
    symbol: "GPK",
    name: "Graphic Packaging Holding Company",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 8.8,
    priceApprox: 29.10,
    dayChange: 0.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Sustainable fiber-based paperboard consumer packaging for food & beverage brands"
  },
  {
    symbol: "X",
    name: "United States Steel Corporation",
    subIndustry: "Steel",
    marketCapNum: 8.8,
    priceApprox: 39.50,
    dayChange: 1.05,
    exchange: "NYSE",
    hasOptions: true,
    description: "Flat-rolled steel, Big River Steel sustainable mini-mills & tubular energy goods"
  },
  {
    symbol: "MLI",
    name: "Mueller Industries, Inc.",
    subIndustry: "Copper",
    marketCapNum: 8.5,
    priceApprox: 82.30,
    dayChange: 1.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Copper tube, brass fittings, valves, line sets & extruded industrial metals"
  },
  {
    symbol: "AGI",
    name: "Alamos Gold Inc.",
    subIndustry: "Gold",
    marketCapNum: 8.5,
    priceApprox: 20.80,
    dayChange: 2.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Low-cost Canadian gold production from Island Gold, Young-Davidson & Lynn Lake"
  },
  {
    symbol: "CE",
    name: "Celanese Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 8.5,
    priceApprox: 78.40,
    dayChange: -0.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Acetyl intermediates, cellulose acetate & engineered thermoplastic polymers"
  },
  {
    symbol: "TX",
    name: "Ternium S.A.",
    subIndustry: "Steel",
    marketCapNum: 8.2,
    priceApprox: 41.80,
    dayChange: 0.55,
    exchange: "NYSE",
    hasOptions: true,
    description: "Flat and long steel products manufacturing for automotive and construction in the Americas"
  },
  {
    symbol: "PAAS",
    name: "Pan American Silver Corp.",
    subIndustry: "Gold",
    marketCapNum: 8.2,
    priceApprox: 22.40,
    dayChange: 2.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Primary silver and gold mining across Canada, Mexico, Peru, Bolivia & Argentina"
  },
  {
    symbol: "CRS",
    name: "Carpenter Technology Corporation",
    subIndustry: "Steel",
    marketCapNum: 8.1,
    priceApprox: 165.00,
    dayChange: 1.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-performance specialty alloys, premium stainless steel & titanium for aerospace"
  },
  {
    symbol: "AXTA",
    name: "Axalta Coating Systems Ltd.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 8.0,
    priceApprox: 37.10,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Automotive refinish coatings, industrial liquid coatings & commercial vehicle paints"
  },
  {
    symbol: "UFP",
    name: "UFP Industries, Inc.",
    subIndustry: "Forest Products",
    marketCapNum: 8.0,
    priceApprox: 133.50,
    dayChange: 0.70,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Wood and composite construction materials, industrial protective packaging & trusses"
  },
  {
    symbol: "SUM",
    name: "Summit Materials, Inc.",
    subIndustry: "Construction Materials",
    marketCapNum: 8.0,
    priceApprox: 46.50,
    dayChange: 0.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Construction materials company supplying aggregates, cement, ready-mix & asphalt"
  },
  {
    symbol: "ATI",
    name: "ATI Inc.",
    subIndustry: "Steel",
    marketCapNum: 7.8,
    priceApprox: 61.20,
    dayChange: 1.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-performance aerospace alloys, nickel superalloys & titanium components"
  },
  {
    symbol: "BERY",
    name: "Berry Global Group, Inc.",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 7.8,
    priceApprox: 68.30,
    dayChange: 0.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Engineered materials, dispensing closures, nonwoven fabrics & rigid protective containers"
  },
  {
    symbol: "AA",
    name: "Alcoa Corporation",
    subIndustry: "Aluminum",
    marketCapNum: 7.5,
    priceApprox: 41.50,
    dayChange: 2.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Bauxite mining, alumina refining & low-carbon primary aluminum smelting"
  },
  {
    symbol: "FMC",
    name: "FMC Corporation",
    subIndustry: "Fertilizers & Agricultural Chemicals",
    marketCapNum: 7.5,
    priceApprox: 59.80,
    dayChange: -0.70,
    exchange: "NYSE",
    hasOptions: true,
    description: "Agricultural crop protection sciences: synthetic and biological insecticides & fungicides"
  },
  {
    symbol: "GGB",
    name: "Gerdau S.A.",
    subIndustry: "Steel",
    marketCapNum: 7.2,
    priceApprox: 3.85,
    dayChange: 0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Long steel production, structural steel shapes, wire rod & automotive special steels"
  },
  {
    symbol: "CMC",
    name: "Commercial Metals Company",
    subIndustry: "Steel",
    marketCapNum: 6.8,
    priceApprox: 59.40,
    dayChange: 0.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Electric micro-mill steel manufacturing, rebar fabrication & metals recycling"
  },
  {
    symbol: "LPX",
    name: "Louisiana-Pacific Corporation",
    subIndustry: "Forest Products",
    marketCapNum: 6.8,
    priceApprox: 98.70,
    dayChange: 1.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Engineered wood building solutions: LP SmartSide siding, structural OSB & trim"
  },
  {
    symbol: "CLF",
    name: "Cleveland-Cliffs Inc.",
    subIndustry: "Steel",
    marketCapNum: 6.5,
    priceApprox: 13.50,
    dayChange: 1.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Flat-rolled steel producer and iron ore pellet supplier for North American automotive"
  },
  {
    symbol: "ESI",
    name: "Element Solutions Inc",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 6.4,
    priceApprox: 26.80,
    dayChange: 0.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "Specialty chemical formulations for microelectronics, printed circuit boards & plating"
  },
  {
    symbol: "HMY",
    name: "Harmony Gold Mining Company Limited",
    subIndustry: "Gold",
    marketCapNum: 6.2,
    priceApprox: 9.80,
    dayChange: 2.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Underground gold mining, open-pit gold extraction & surface retreatment operations"
  },
  {
    symbol: "NEU",
    name: "NewMarket Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 5.8,
    priceApprox: 610.00,
    dayChange: 0.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Petroleum additives, fuel performance chemistry & industrial lubricating oil additives"
  },
  {
    symbol: "SLGN",
    name: "Silgan Holdings Inc.",
    subIndustry: "Metal, Glass & Plastic Containers",
    marketCapNum: 5.5,
    priceApprox: 52.80,
    dayChange: 0.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "Metal food cans, precision dispensing closures & custom thermoformed plastic containers"
  },
  {
    symbol: "BCPC",
    name: "Balchem Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 5.5,
    priceApprox: 172.50,
    dayChange: 0.40,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Nutritional choline ingredients, micro-encapsulation & medical device sterilization gases"
  },
  {
    symbol: "OLN",
    name: "Olin Corporation",
    subIndustry: "Commodity Chemicals",
    marketCapNum: 5.5,
    priceApprox: 46.20,
    dayChange: -0.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Chlor-alkali chemicals, vinyls, epoxy resins & Winchester small-caliber ammunition"
  },
  {
    symbol: "SEE",
    name: "Sealed Air Corporation",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 5.2,
    priceApprox: 36.40,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Protective packaging: Bubble Wrap, Cryovac food barrier packaging & automated bagging"
  },
  {
    symbol: "SON",
    name: "Sonoco Products Company",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 5.2,
    priceApprox: 53.60,
    dayChange: 0.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Industrial paper tubes, composite cans, thermoformed plastics & protective packaging"
  },
  {
    symbol: "BCC",
    name: "Boise Cascade Company",
    subIndustry: "Forest Products",
    marketCapNum: 5.2,
    priceApprox: 138.50,
    dayChange: 0.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Engineered wood products, structural plywood & national wholesale building distribution"
  },
  {
    symbol: "KNF",
    name: "Knife River Corporation",
    subIndustry: "Construction Materials",
    marketCapNum: 5.0,
    priceApprox: 89.20,
    dayChange: 0.75,
    exchange: "NYSE",
    hasOptions: true,
    description: "Construction aggregates, asphalt paving, ready-mix concrete & site infrastructure"
  },

  // ==========================================
  // MID-TO-SMALL CAPS ($2.5B - $5B)
  // ==========================================
  {
    symbol: "CBT",
    name: "Cabot Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 4.8,
    priceApprox: 89.60,
    dayChange: 0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Reinforcing carbon blacks, fumed silica, specialty carbons & battery conductive additives"
  },
  {
    symbol: "NXE",
    name: "NexGen Energy Ltd.",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 4.6,
    priceApprox: 8.40,
    dayChange: 3.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-grade uranium exploration and development at the Rook I Arrow deposit in Canada"
  },
  {
    symbol: "ALTM",
    name: "Arcadium Lithium plc",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 4.5,
    priceApprox: 4.15,
    dayChange: 2.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Vertically integrated lithium producer: hard-rock spodumene, brine extraction & lithium metal"
  },
  {
    symbol: "AVNT",
    name: "Avient Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 4.5,
    priceApprox: 49.80,
    dayChange: 0.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "Specialized colorants, engineered polymer formulations & sustainable functional additives"
  },
  {
    symbol: "ASH",
    name: "Ashland Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 4.2,
    priceApprox: 86.40,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Specialty additives, cellulosic polymers & bio-resorbable chemistries for pharma & care"
  },
  {
    symbol: "FUL",
    name: "H.B. Fuller Company",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 4.1,
    priceApprox: 76.80,
    dayChange: 0.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Industrial adhesives, specialty sealants & polymer bonding agents for manufacturing"
  },
  {
    symbol: "SMG",
    name: "The Scotts Miracle-Gro Company",
    subIndustry: "Fertilizers & Agricultural Chemicals",
    marketCapNum: 4.0,
    priceApprox: 70.50,
    dayChange: 1.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Consumer lawn fertilizers, Miracle-Gro potting soils, weed control & gardening products"
  },
  {
    symbol: "BTG",
    name: "B2Gold Corp.",
    subIndustry: "Gold",
    marketCapNum: 4.0,
    priceApprox: 3.05,
    dayChange: 1.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Low-cost senior gold producer operating Fekola, Masbate & Otjikoto mines"
  },
  {
    symbol: "EGO",
    name: "Eldorado Gold Corporation",
    subIndustry: "Gold",
    marketCapNum: 4.0,
    priceApprox: 19.50,
    dayChange: 2.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "Gold and base metal producer with mining assets in Greece, Turkey and Canada"
  },
  {
    symbol: "OR",
    name: "Osisko Gold Royalties Ltd",
    subIndustry: "Gold",
    marketCapNum: 3.8,
    priceApprox: 20.40,
    dayChange: 1.75,
    exchange: "NYSE",
    hasOptions: true,
    description: "Precious metals royalty company holding net smelter returns on Canadian Malartic"
  },
  {
    symbol: "HUN",
    name: "Huntsman Corporation",
    subIndustry: "Commodity Chemicals",
    marketCapNum: 3.8,
    priceApprox: 21.60,
    dayChange: -0.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "MDI polyurethanes, advanced epoxy materials & performance chemicals for construction"
  },
  {
    symbol: "SLVM",
    name: "Sylvamo Corporation",
    subIndustry: "Paper & Forest Products",
    marketCapNum: 3.8,
    priceApprox: 92.50,
    dayChange: 0.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Uncoated freesheet papers, commercial printing papers & hardwood pulp production"
  },
  {
    symbol: "CEIX",
    name: "CONSOL Energy Inc.",
    subIndustry: "Coal & Consumable Fuels",
    marketCapNum: 3.6,
    priceApprox: 118.00,
    dayChange: 1.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Low-cost high-Btu bituminous thermal coal producer & marine export terminal operator"
  },
  {
    symbol: "HL",
    name: "Hecla Mining Company",
    subIndustry: "Silver",
    marketCapNum: 3.6,
    priceApprox: 5.75,
    dayChange: 2.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Largest primary silver producer in the US: Greens Creek, Lucky Friday & Keno Hill"
  },
  {
    symbol: "AMR",
    name: "Alpha Metallurgical Resources, Inc.",
    subIndustry: "Steel",
    marketCapNum: 3.4,
    priceApprox: 260.00,
    dayChange: 1.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Premier metallurgical coal supplier delivering high-grade coking coal for steelmaking"
  },
  {
    symbol: "HBM",
    name: "Hudbay Minerals Inc.",
    subIndustry: "Copper",
    marketCapNum: 3.4,
    priceApprox: 8.70,
    dayChange: 2.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Diversified mining company producing copper concentrate, gold and zinc across the Americas"
  },
  {
    symbol: "GEF",
    name: "Greif, Inc.",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 3.3,
    priceApprox: 68.40,
    dayChange: 0.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Industrial packaging: steel drums, plastic drums, IBCs & corrugated containerboard"
  },
  {
    symbol: "HCC",
    name: "Warrior Met Coal, Inc.",
    subIndustry: "Steel",
    marketCapNum: 3.2,
    priceApprox: 62.10,
    dayChange: 1.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Non-thermal premium metallurgical coking coal extraction for global blast furnace steelmakers"
  },
  {
    symbol: "TFPM",
    name: "Triple Flag Precious Metals Corp.",
    subIndustry: "Gold",
    marketCapNum: 3.2,
    priceApprox: 15.80,
    dayChange: 1.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Precious metals streaming and royalty portfolio focused on gold and silver operations"
  },
  {
    symbol: "SXT",
    name: "Sensient Technologies Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 3.2,
    priceApprox: 76.50,
    dayChange: 0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Natural colors, synthetic food flavors & specialty cosmetic ingredients"
  },
  {
    symbol: "SID",
    name: "Companhia Siderúrgica Nacional",
    subIndustry: "Steel",
    marketCapNum: 3.2,
    priceApprox: 2.45,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Integrated Brazilian steel producer, iron ore mining, cement & port logistics"
  },
  {
    symbol: "BTU",
    name: "Peabody Energy Corporation",
    subIndustry: "Coal & Consumable Fuels",
    marketCapNum: 3.1,
    priceApprox: 25.80,
    dayChange: 0.95,
    exchange: "NYSE",
    hasOptions: true,
    description: "Thermal and metallurgical coal mining in the Powder River Basin & Australia"
  },
  {
    symbol: "CDE",
    name: "Coeur Mining, Inc.",
    subIndustry: "Silver",
    marketCapNum: 3.0,
    priceApprox: 5.60,
    dayChange: 3.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "US-based precious metals producer operating Rochester, Palmarejo & Kensington mines"
  },
  {
    symbol: "KWR",
    name: "Quaker Chemical Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 2.9,
    priceApprox: 161.20,
    dayChange: 0.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Industrial process fluids, chemical lubricants & greases for steel and automotive manufacturing"
  },
  {
    symbol: "UEC",
    name: "Uranium Energy Corp",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 2.8,
    priceApprox: 6.95,
    dayChange: 3.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "In-situ recovery (ISR) uranium extraction projects in Texas, Wyoming & Athabasca Basin"
  },
  {
    symbol: "IOSP",
    name: "Innospec Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 2.8,
    priceApprox: 114.50,
    dayChange: 0.25,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Specialty fuel additives, oilfield drilling chemicals & personal care performance surfactants"
  },
  {
    symbol: "CC",
    name: "The Chemours Company",
    subIndustry: "Commodity Chemicals",
    marketCapNum: 2.8,
    priceApprox: 18.90,
    dayChange: -0.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Titanium dioxide pigments (Ti-Pure), thermal propellants & advanced Teflon fluoropolymers"
  },
  {
    symbol: "SBSW",
    name: "Sibanye Stillwater Limited",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 2.8,
    priceApprox: 4.80,
    dayChange: 1.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Platinum group metals (PGM), gold mining operations & circular battery metals recycling"
  },
  {
    symbol: "IAG",
    name: "IAMGOLD Corporation",
    subIndustry: "Gold",
    marketCapNum: 2.8,
    priceApprox: 5.55,
    dayChange: 2.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Mid-tier gold mining company operating Essakane, Westwood & Côté Gold mine"
  },
  {
    symbol: "MP",
    name: "MP Materials Corp.",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 2.6,
    priceApprox: 15.60,
    dayChange: 3.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Rare earth mining at Mountain Pass & neodymium-praseodymium (NdPr) magnetics production"
  },

  // ==========================================
  // SMALL-TO-MID CAPS ($1B - $2.5B)
  // ==========================================
  {
    symbol: "ARCH",
    name: "Arch Resources, Inc.",
    subIndustry: "Coal & Consumable Fuels",
    marketCapNum: 2.4,
    priceApprox: 132.00,
    dayChange: 0.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-volume metallurgical coking coal supplier for global blast furnace steelmakers"
  },
  {
    symbol: "EQX",
    name: "Equinox Gold Corp.",
    subIndustry: "Gold",
    marketCapNum: 2.3,
    priceApprox: 5.70,
    dayChange: 2.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Americas-focused gold producer operating multiple mines in Brazil, Mexico, Canada & US"
  },
  {
    symbol: "MTRN",
    name: "Materion Corporation",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 2.2,
    priceApprox: 108.50,
    dayChange: 0.60,
    exchange: "NYSE",
    hasOptions: true,
    description: "Engineered beryllium alloys, advanced clad metal strips & precision optical filter coatings"
  },
  {
    symbol: "USLM",
    name: "United States Lime & Minerals, Inc.",
    subIndustry: "Construction Materials",
    marketCapNum: 2.2,
    priceApprox: 388.00,
    dayChange: 0.85,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "High-calcium limestone quarrying, quicklime, hydrated lime & pulverized stone products"
  },
  {
    symbol: "AG",
    name: "First Majestic Silver Corp.",
    subIndustry: "Silver",
    marketCapNum: 2.2,
    priceApprox: 7.30,
    dayChange: 3.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Pure-play silver producer with underground operations at San Dimas, Santa Elena & La Encantada"
  },
  {
    symbol: "PTVE",
    name: "Pactiv Evergreen Inc.",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 2.2,
    priceApprox: 12.40,
    dayChange: 0.30,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Fresh food and beverage packaging, gable top beverage cartons & food service containers"
  },
  {
    symbol: "NGD",
    name: "New Gold Inc.",
    subIndustry: "Gold",
    marketCapNum: 2.2,
    priceApprox: 3.10,
    dayChange: 2.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Canadian intermediate gold and copper producer operating Rainy River & New Afton mines"
  },
  {
    symbol: "ERO",
    name: "Ero Copper Corp.",
    subIndustry: "Copper",
    marketCapNum: 2.1,
    priceApprox: 21.30,
    dayChange: 2.70,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-grade copper concentrate producer operating Caraíba operations & Tucumã project in Brazil"
  },
  {
    symbol: "ROG",
    name: "Rogers Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 2.1,
    priceApprox: 114.20,
    dayChange: 0.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-frequency circuit laminates & engineered polyurethane foams for EV batteries and telecom"
  },
  {
    symbol: "CSTM",
    name: "Constellium SE",
    subIndustry: "Aluminum",
    marketCapNum: 2.1,
    priceApprox: 14.60,
    dayChange: 1.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Engineered aluminum rolled products and structural extrusions for aerospace & automotive"
  },
  {
    symbol: "TROX",
    name: "Tronox Holdings plc",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 2.0,
    priceApprox: 12.80,
    dayChange: 0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Vertically integrated titanium dioxide pigments, rutile, ilmenite & zircon mineral sands"
  },
  {
    symbol: "SAND",
    name: "Sandstorm Gold Ltd.",
    subIndustry: "Gold",
    marketCapNum: 1.9,
    priceApprox: 6.35,
    dayChange: 1.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Gold royalty company providing upfront financing in exchange for precious metal stream sales"
  },
  {
    symbol: "OI",
    name: "O-I Glass, Inc.",
    subIndustry: "Metal, Glass & Plastic Containers",
    marketCapNum: 1.9,
    priceApprox: 12.60,
    dayChange: -0.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Glass container manufacturing for beer, wine, distilled spirits & non-alcoholic beverages"
  },
  {
    symbol: "SCL",
    name: "Stepan Company",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 1.8,
    priceApprox: 80.50,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Surfactants for cleaning and disinfectants & aromatic polyester polyols for rigid insulation"
  },
  {
    symbol: "CENX",
    name: "Century Aluminum Company",
    subIndustry: "Aluminum",
    marketCapNum: 1.8,
    priceApprox: 19.40,
    dayChange: 2.30,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Primary aluminum reduction facilities in the US and Iceland producing value-added casthouse products"
  },
  {
    symbol: "DNN",
    name: "Denison Mines Corp.",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 1.8,
    priceApprox: 2.05,
    dayChange: 3.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Athabasca Basin uranium exploration & in-situ recovery development at Wheeler River"
  },
  {
    symbol: "SILV",
    name: "SilverCrest Metals Inc.",
    subIndustry: "Silver",
    marketCapNum: 1.7,
    priceApprox: 11.20,
    dayChange: 2.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-grade underground silver and gold bullion production from the Las Chispas mine"
  },
  {
    symbol: "MAG",
    name: "MAG Silver Corp.",
    subIndustry: "Silver",
    marketCapNum: 1.6,
    priceApprox: 15.40,
    dayChange: 2.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-grade silver production and exploration joint venture at the Juanicipio mine in Mexico"
  },
  {
    symbol: "KALU",
    name: "Kaiser Aluminum Corporation",
    subIndustry: "Aluminum",
    marketCapNum: 1.5,
    priceApprox: 94.20,
    dayChange: 0.85,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Semi-fabricated specialty aluminum plate, sheet, extrusions & rod for aerospace and defense"
  },
  {
    symbol: "SGML",
    name: "Sigma Lithium Corporation",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 1.5,
    priceApprox: 13.80,
    dayChange: 3.60,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Zero-tailings carbon-neutral green lithium concentrate production from Grota do Cirilo"
  },
  {
    symbol: "LEU",
    name: "Centrus Energy Corp.",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 1.5,
    priceApprox: 92.50,
    dayChange: 4.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Nuclear fuel components, low-enriched uranium (LEU) & High-Assay Low-Enriched Uranium (HALEU)"
  },
  {
    symbol: "FSM",
    name: "Fortuna Mining Corp.",
    subIndustry: "Gold",
    marketCapNum: 1.5,
    priceApprox: 4.85,
    dayChange: 2.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Precious and base metals mining across operating assets in Latin America and West Africa"
  },
  {
    symbol: "GATO",
    name: "Gatos Silver, Inc.",
    subIndustry: "Silver",
    marketCapNum: 1.3,
    priceApprox: 18.20,
    dayChange: 2.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-grade underground silver-lead-zinc production at the Cerro Los Gatos mine in Chihuahua"
  },
  {
    symbol: "SA",
    name: "Seabridge Gold Inc.",
    subIndustry: "Gold",
    marketCapNum: 1.3,
    priceApprox: 14.80,
    dayChange: 1.90,
    exchange: "NYSE",
    hasOptions: true,
    description: "Advanced gold-copper project exploration and development at KSM in British Columbia"
  },
  {
    symbol: "SSRM",
    name: "SSR Mining Inc.",
    subIndustry: "Gold",
    marketCapNum: 1.3,
    priceApprox: 6.20,
    dayChange: 1.50,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Precious metals mining: Marigold gold mine in Nevada, Seabee in Canada & Puna silver in Argentina"
  },
  {
    symbol: "UUUU",
    name: "Energy Fuels Inc.",
    subIndustry: "Diversified Metals & Mining",
    marketCapNum: 1.2,
    priceApprox: 7.20,
    dayChange: 3.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "White Mesa Mill conventional uranium production, rare earth carbonate & vanadium extraction"
  },
  {
    symbol: "KRO",
    name: "Kronos Worldwide, Inc.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 1.2,
    priceApprox: 10.40,
    dayChange: 0.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Titanium dioxide (TiO2) pigment manufacturing for paints, coatings, plastics & paper"
  },
  {
    symbol: "NG",
    name: "NovaGold Resources Inc.",
    subIndustry: "Gold",
    marketCapNum: 1.2,
    priceApprox: 3.60,
    dayChange: 1.70,
    exchange: "NYSE",
    hasOptions: true,
    description: "50% interest in Donlin Gold, an undeveloped tier-one gold deposit in Alaska"
  },
  {
    symbol: "LAC",
    name: "Lithium Americas Corp.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 1.1,
    priceApprox: 5.15,
    dayChange: 3.75,
    exchange: "NYSE",
    hasOptions: true,
    description: "Commercial development of the Thacker Pass sedimentary lithium deposit in Humboldt County, Nevada"
  },
  {
    symbol: "TRS",
    name: "TriMas Corporation",
    subIndustry: "Paper & Plastic Packaging Products & Materials",
    marketCapNum: 1.1,
    priceApprox: 27.40,
    dayChange: 0.20,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Engineered dispensing pumps, closures, aerospace blind bolts & specialized industrial packaging"
  },
  {
    symbol: "EXK",
    name: "Endeavour Silver Corp.",
    subIndustry: "Silver",
    marketCapNum: 1.1,
    priceApprox: 4.80,
    dayChange: 2.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Mid-tier precious metals miner operating Guanaceví and Bolañitos underground silver-gold mines"
  },
  {
    symbol: "SVM",
    name: "Silvercorp Metals Inc.",
    subIndustry: "Silver",
    marketCapNum: 1.05,
    priceApprox: 4.60,
    dayChange: 2.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Silver, lead and zinc exploration and mining at the Ying Mining District"
  },
  {
    symbol: "SXC",
    name: "SunCoke Energy, Inc.",
    subIndustry: "Steel",
    marketCapNum: 1.05,
    priceApprox: 12.30,
    dayChange: 0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Heat-recovery metallurgical coke manufacturing & bulk materials handling for blast furnace steel"
  },
  {
    symbol: "MTUS",
    name: "Metallus Inc.",
    subIndustry: "Steel",
    marketCapNum: 1.02,
    priceApprox: 23.50,
    dayChange: 0.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-performance special bar quality (SBQ) alloy steel bars, seamless tubes & custom components"
  },
  {
    symbol: "LAAC",
    name: "Lithium Americas (Argentina) Corp.",
    subIndustry: "Specialty Chemicals",
    marketCapNum: 1.02,
    priceApprox: 6.30,
    dayChange: 3.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "Caucharí-Olaroz and Pastos Grandes lithium brine production and development in Salta and Jujuy"
  },
  {
    symbol: "KOP",
    name: "Koppers Holdings Inc.",
    subIndustry: "Forest Products",
    marketCapNum: 1.0,
    priceApprox: 49.80,
    dayChange: 0.50,
    exchange: "NYSE",
    hasOptions: true,
    description: "Carbon chemical distillation, pressure-treated lumber & railroad wooden crosstie protection"
  },
  {
    symbol: "LUNMF",
    name: "Lundin Mining Corporation",
    subIndustry: "Copper",
    marketCapNum: 8.5,
    priceApprox: 10.40,
    dayChange: 1.80,
    exchange: "NYSE",
    hasOptions: true,
    description: "Base metals mining company producing copper, zinc & nickel across Chile, Brazil & Europe"
  },
  {
    symbol: "CSCCF",
    name: "Capstone Copper Corp.",
    subIndustry: "Copper",
    marketCapNum: 8.0,
    priceApprox: 7.20,
    dayChange: 2.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Americas-focused copper producer operating Pinto Valley, Cozamin, Mantos Blancos & Mantoverde"
  },
  {
    symbol: "AWI",
    name: "Armstrong World Industries, Inc.",
    subIndustry: "Construction Materials",
    marketCapNum: 6.8,
    priceApprox: 154.20,
    dayChange: 0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Mineral fiber ceiling tiles, architectural grid suspensions & acoustical wall systems"
  },
  {
    symbol: "LUGDF",
    name: "Lundin Gold Inc.",
    subIndustry: "Gold",
    marketCapNum: 6.2,
    priceApprox: 26.50,
    dayChange: 1.95,
    exchange: "NYSE",
    hasOptions: true,
    description: "High-grade underground gold mining at the Fruta del Norte deposit in southeastern Ecuador"
  },
  {
    symbol: "DPMLF",
    name: "Dundee Precious Metals Inc.",
    subIndustry: "Gold",
    marketCapNum: 1.8,
    priceApprox: 10.10,
    dayChange: 1.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Gold mining, processing and exploration operations at Chelopech and Ada Tepe in Bulgaria"
  },
  {
    symbol: "CGOOF",
    name: "Centerra Gold Inc.",
    subIndustry: "Gold",
    marketCapNum: 1.7,
    priceApprox: 8.20,
    dayChange: 1.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Canadian gold mining and exploration company operating Mount Milligan & Öksüt mines"
  },
  {
    symbol: "TGB",
    name: "Taseko Mines Limited",
    subIndustry: "Copper",
    marketCapNum: 1.0,
    priceApprox: 3.45,
    dayChange: 2.20,
    exchange: "NYSE",
    hasOptions: true,
    description: "Copper producer operating the Gibraltar mine and advancing Florence Copper ISR in Arizona"
  }
];
