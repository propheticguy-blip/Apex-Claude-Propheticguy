// Comprehensive US Healthcare Sector Data (> $1B Market Cap)
// All tradable on US brokerages (NYSE / NASDAQ)

export interface HCStockDef {
  symbol: string;
  name: string;
  subIndustry: string;
  marketCapNum: number; // In Billions USD
  priceApprox: number;
  dayChange: number;
  exchange: 'NYSE' | 'NASDAQ';
  hasOptions: boolean;
  description: string;
}

export const HEALTHCARE_STOCKS: HCStockDef[] = [
  // ==========================================
  // MEGA CAP ($100B+)
  // ==========================================
  {
    symbol: "LLY",
    name: "Eli Lilly and Company",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 865.0,
    priceApprox: 915.4,
    dayChange: 1.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Incretin metabolic therapies (Mounjaro, Zepbound), Trulicity, Verzenio & oncology medicines"
  },
  {
    symbol: "NVO",
    name: "Novo Nordisk A/S",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 540.0,
    priceApprox: 120.5,
    dayChange: -0.42,
    exchange: "NYSE",
    hasOptions: true,
    description: "GLP-1 semaglutide treatments: Ozempic, Wegovy, insulin therapies & rare blood disorders"
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group",
    subIndustry: "Managed Health Care",
    marketCapNum: 520.0,
    priceApprox: 565.0,
    dayChange: 0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Comprehensive managed care insurance (UnitedHealthcare) & health services analytics (Optum)"
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 395.0,
    priceApprox: 164.2,
    dayChange: -0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Innovative oncology/immunology pharmaceuticals (Darzalex, Tremfya) & MedTech surgical systems"
  },
  {
    symbol: "ABBV",
    name: "AbbVie",
    subIndustry: "Biotechnology",
    marketCapNum: 345.0,
    priceApprox: 195.3,
    dayChange: 0.82,
    exchange: "NYSE",
    hasOptions: true,
    description: "Immunology therapeutics (Skyrizi, Rinvoq, Humira), oncology treatments & Botox aesthetics"
  },
  {
    symbol: "MRK",
    name: "Merck & Co.",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 275.0,
    priceApprox: 108.5,
    dayChange: -0.55,
    exchange: "NYSE",
    hasOptions: true,
    description: "Blockbuster immuno-oncology (Keytruda), HPV vaccine Gardasil & animal health solutions"
  },
  {
    symbol: "TMO",
    name: "Thermo Fisher Scientific",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 220.0,
    priceApprox: 574.0,
    dayChange: 0.44,
    exchange: "NYSE",
    hasOptions: true,
    description: "Analytical scientific instruments, laboratory equipment, bioprocess reagents & CDMO services"
  },
  {
    symbol: "AZN",
    name: "AstraZeneca PLC",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 205.0,
    priceApprox: 66.8,
    dayChange: -0.28,
    exchange: "NYSE",
    hasOptions: true,
    description: "Targeted oncology therapies (Tagrisso, Enhertu, Imfinzi) & cardiovascular renal treatments"
  },
  {
    symbol: "ABT",
    name: "Abbott Laboratories",
    subIndustry: "Health Care Equipment",
    marketCapNum: 200.0,
    priceApprox: 115.6,
    dayChange: 0.38,
    exchange: "NYSE",
    hasOptions: true,
    description: "Cardiovascular devices, FreeStyle Libre glucose monitoring, diagnostics & adult nutrition"
  },
  {
    symbol: "ISRG",
    name: "Intuitive Surgical",
    subIndustry: "Health Care Equipment",
    marketCapNum: 185.0,
    priceApprox: 518.0,
    dayChange: 1.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "da Vinci robotic-assisted minimally invasive surgical systems & digital instrumentation"
  },
  {
    symbol: "NVS",
    name: "Novartis AG",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 180.0,
    priceApprox: 102.5,
    dayChange: -0.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Innovative cardiovascular therapies (Entresto), radioligand medicines (Pluvicto) & Cosentyx"
  },
  {
    symbol: "DHR",
    name: "Danaher Corporation",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 175.0,
    priceApprox: 242.0,
    dayChange: 0.72,
    exchange: "NYSE",
    hasOptions: true,
    description: "Biotechnology purification solutions, life science research systems & clinical diagnostics"
  },
  {
    symbol: "AMGN",
    name: "Amgen",
    subIndustry: "Biotechnology",
    marketCapNum: 165.0,
    priceApprox: 308.2,
    dayChange: -0.45,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Cardiovascular therapies (Repatha), inflammation biologic Prolia/Evenity & oncology pipeline"
  },
  {
    symbol: "SYK",
    name: "Stryker Corporation",
    subIndustry: "Health Care Equipment",
    marketCapNum: 148.0,
    priceApprox: 388.5,
    dayChange: 0.62,
    exchange: "NYSE",
    hasOptions: true,
    description: "Mako robotic-arm orthopedic joint implants, surgical navigation & neurovascular systems"
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 145.0,
    priceApprox: 25.8,
    dayChange: -0.32,
    exchange: "NYSE",
    hasOptions: true,
    description: "Bio-pharmaceutical medicines: Comirnaty, Paxlovid, Vyndaqel, Eliquis & Seagen antibody-drug conjugates"
  },
  {
    symbol: "BSX",
    name: "Boston Scientific",
    subIndustry: "Health Care Equipment",
    marketCapNum: 135.0,
    priceApprox: 91.5,
    dayChange: 1.05,
    exchange: "NYSE",
    hasOptions: true,
    description: "Farapulse pulsed field ablation, Watchman left atrial appendage closure & interventional cardiology"
  },
  {
    symbol: "MDT",
    name: "Medtronic plc",
    subIndustry: "Health Care Equipment",
    marketCapNum: 118.0,
    priceApprox: 92.4,
    dayChange: 0.22,
    exchange: "NYSE",
    hasOptions: true,
    description: "Cardiac pacemakers, neuromodulation implants, insulin pumps & spinal surgical robotics"
  },
  {
    symbol: "VRTX",
    name: "Vertex Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 118.0,
    priceApprox: 458.0,
    dayChange: 0.94,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Cystic fibrosis CFTR modulators (Trikafta), CRISPR sickle cell gene therapies & pain therapeutics"
  },
  {
    symbol: "GILD",
    name: "Gilead Sciences",
    subIndustry: "Biotechnology",
    marketCapNum: 115.0,
    priceApprox: 92.3,
    dayChange: 0.81,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "HIV antiretroviral regimens (Biktarvy, lenacapavir), cell therapy (Yescarta) & liver disease antivirals"
  },
  {
    symbol: "REGN",
    name: "Regeneron Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 108.0,
    priceApprox: 992.0,
    dayChange: -0.68,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Monoclonal antibody therapies: Dupixent eczema/asthma treatments, Eylea retinal injections & Libtayo"
  },
  {
    symbol: "BMY",
    name: "Bristol-Myers Squibb",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 108.0,
    priceApprox: 53.2,
    dayChange: -0.41,
    exchange: "NYSE",
    hasOptions: true,
    description: "Immuno-oncology checkpoint inhibitors (Opdivo, Yervoy), Eliquis anticoagulant & Cobenfy neuroscience"
  },
  {
    symbol: "SNY",
    name: "Sanofi",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 122.0,
    priceApprox: 48.6,
    dayChange: 0.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Dupixent immunology co-development, pediatric and seasonal flu vaccines & rare disease treatments"
  },
  {
    symbol: "GSK",
    name: "GSK plc",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 82.0,
    priceApprox: 39.5,
    dayChange: -0.18,
    exchange: "NYSE",
    hasOptions: true,
    description: "Shingrix shingles vaccine, Arexvy RSV immunization, respiratory medicine & HIV specialized treatments"
  },

  // ==========================================
  // LARGE CAP ($50B - $100B)
  // ==========================================
  {
    symbol: "MCK",
    name: "McKesson Corporation",
    subIndustry: "Health Care Distributors",
    marketCapNum: 78.0,
    priceApprox: 598.0,
    dayChange: 0.52,
    exchange: "NYSE",
    hasOptions: true,
    description: "Pharmaceutical logistics distribution, oncology practice management & specialty biopharma solutions"
  },
  {
    symbol: "CI",
    name: "The Cigna Group",
    subIndustry: "Health Care Services",
    marketCapNum: 86.0,
    priceApprox: 312.0,
    dayChange: 0.44,
    exchange: "NYSE",
    hasOptions: true,
    description: "Evernorth pharmacy benefit services, specialty pharmacy distribution & global healthcare coverage"
  },
  {
    symbol: "ELV",
    name: "Elevance Health",
    subIndustry: "Managed Health Care",
    marketCapNum: 88.0,
    priceApprox: 382.0,
    dayChange: -1.10,
    exchange: "NYSE",
    hasOptions: true,
    description: "Blue Cross Blue Shield commercial and government plans, Carelon behavioral & pharmacy health"
  },
  {
    symbol: "ZTS",
    name: "Zoetis Inc.",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 82.0,
    priceApprox: 182.4,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Animal healthcare medicines, vaccines, parasiticides, diagnostics & livestock genetics"
  },
  {
    symbol: "HCA",
    name: "HCA Healthcare",
    subIndustry: "Health Care Facilities",
    marketCapNum: 82.0,
    priceApprox: 326.0,
    dayChange: 1.12,
    exchange: "NYSE",
    hasOptions: true,
    description: "Acute care hospitals, outpatient surgical centers, urgent care clinics & ER networks"
  },
  {
    symbol: "BDX",
    name: "Becton, Dickinson and Company",
    subIndustry: "Health Care Equipment",
    marketCapNum: 68.0,
    priceApprox: 235.0,
    dayChange: 0.28,
    exchange: "NYSE",
    hasOptions: true,
    description: "Medical hypodermic needles, medication infusion pumps, flow cytometry & diagnostic culture systems"
  },
  {
    symbol: "COR",
    name: "Cencora, Inc.",
    subIndustry: "Health Care Distributors",
    marketCapNum: 48.0,
    priceApprox: 242.0,
    dayChange: 0.65,
    exchange: "NYSE",
    hasOptions: true,
    description: "Wholesale pharmaceutical sourcing, global clinical trial logistics & animal health distribution"
  },
  {
    symbol: "CVS",
    name: "CVS Health Corporation",
    subIndustry: "Health Care Services",
    marketCapNum: 74.0,
    priceApprox: 58.8,
    dayChange: -0.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Retail pharmacy stores, Caremark pharmacy benefit management & Aetna health insurance"
  },
  {
    symbol: "GEHC",
    name: "GE HealthCare Technologies",
    subIndustry: "Health Care Equipment",
    marketCapNum: 39.0,
    priceApprox: 86.5,
    dayChange: 0.48,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "MRI, CT scanners, ultrasound imaging devices, patient monitoring & molecular pharmaceutical imaging"
  },
  {
    symbol: "EW",
    name: "Edwards Lifesciences",
    subIndustry: "Health Care Equipment",
    marketCapNum: 42.0,
    priceApprox: 71.2,
    dayChange: 0.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Transcatheter aortic valve replacement (TAVR), surgical heart valves & hemodynamic monitoring"
  },
  {
    symbol: "HUM",
    name: "Humana Inc.",
    subIndustry: "Managed Health Care",
    marketCapNum: 32.0,
    priceApprox: 268.0,
    dayChange: -1.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Medicare Advantage health insurance programs, CenterWell primary care clinics & home healthcare"
  },
  {
    symbol: "CAH",
    name: "Cardinal Health",
    subIndustry: "Health Care Distributors",
    marketCapNum: 26.0,
    priceApprox: 109.5,
    dayChange: 0.54,
    exchange: "NYSE",
    hasOptions: true,
    description: "Pharmaceutical wholesale logistics, specialty distribution & medical-surgical hospital supply chains"
  },
  {
    symbol: "IDXX",
    name: "IDEXX Laboratories",
    subIndustry: "Health Care Equipment",
    marketCapNum: 34.0,
    priceApprox: 418.0,
    dayChange: 0.75,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Veterinary in-clinic diagnostic analyzers, reference lab testing & companion animal practice software"
  },
  {
    symbol: "IQV",
    name: "IQVIA Holdings",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 40.0,
    priceApprox: 224.0,
    dayChange: -0.42,
    exchange: "NYSE",
    hasOptions: true,
    description: "Contract clinical trial research, healthcare data analytics & commercial biopharma technology"
  },
  {
    symbol: "A",
    name: "Agilent Technologies",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 37.0,
    priceApprox: 128.5,
    dayChange: 0.32,
    exchange: "NYSE",
    hasOptions: true,
    description: "Gas/liquid chromatography, mass spectrometry analytical systems & pathology diagnostic reagents"
  },
  {
    symbol: "DXCM",
    name: "DexCom, Inc.",
    subIndustry: "Health Care Equipment",
    marketCapNum: 29.0,
    priceApprox: 74.0,
    dayChange: -0.65,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Continuous glucose monitoring (G7, Stelo) wearable biosensors for diabetes glycemic control"
  },
  {
    symbol: "RMD",
    name: "ResMed Inc.",
    subIndustry: "Health Care Equipment",
    marketCapNum: 33.0,
    priceApprox: 228.0,
    dayChange: 0.88,
    exchange: "NYSE",
    hasOptions: true,
    description: "CPAP sleep apnea machines, ventilation masks & cloud-connected SaaS out-of-hospital software"
  },
  {
    symbol: "CNC",
    name: "Centene Corporation",
    subIndustry: "Managed Health Care",
    marketCapNum: 31.0,
    priceApprox: 59.8,
    dayChange: -0.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Government-sponsored healthcare plans, Medicaid managed care programs & Affordable Care Act exchanges"
  },
  {
    symbol: "MTD",
    name: "Mettler-Toledo International",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 26.0,
    priceApprox: 1240.0,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Precision laboratory balances, analytical chemistry instruments & automated inline inspection"
  },
  {
    symbol: "BIIB",
    name: "Biogen Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 25.0,
    priceApprox: 172.0,
    dayChange: -0.78,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Alzheimer's treatment (Leqembi), spinal muscular atrophy (Spinraza) & multiple sclerosis therapies"
  },
  {
    symbol: "WST",
    name: "West Pharmaceutical Services",
    subIndustry: "Health Care Equipment",
    marketCapNum: 22.0,
    priceApprox: 304.0,
    dayChange: 0.12,
    exchange: "NYSE",
    hasOptions: true,
    description: "Injectable packaging components, elastomer syringe stoppers & high-purity containment systems"
  },
  {
    symbol: "ZBH",
    name: "Zimmer Biomet Holdings",
    subIndustry: "Health Care Equipment",
    marketCapNum: 21.0,
    priceApprox: 104.5,
    dayChange: -0.22,
    exchange: "NYSE",
    hasOptions: true,
    description: "Orthopedic reconstructive knee/hip implants, surgical robotics (ROSA) & sports medicine fixation"
  },
  {
    symbol: "WAT",
    name: "Waters Corporation",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 21.0,
    priceApprox: 355.0,
    dayChange: 0.45,
    exchange: "NYSE",
    hasOptions: true,
    description: "Ultra performance liquid chromatography (UPLC), mass spectrometry instruments & thermal analyzers"
  },
  {
    symbol: "VEEV",
    name: "Veeva Systems",
    subIndustry: "Health Care Technology",
    marketCapNum: 35.0,
    priceApprox: 214.0,
    dayChange: 0.95,
    exchange: "NYSE",
    hasOptions: true,
    description: "Cloud-based CRM, clinical data management software & regulatory compliance for life sciences"
  },
  {
    symbol: "ALGN",
    name: "Align Technology",
    subIndustry: "Health Care Equipment",
    marketCapNum: 16.5,
    priceApprox: 218.0,
    dayChange: -0.55,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Invisalign clear orthodontic aligners, iTero intraoral 3D digital dental scanners & exocad software"
  },
  {
    symbol: "LH",
    name: "Labcorp (Laboratory Corp of America)",
    subIndustry: "Health Care Services",
    marketCapNum: 19.5,
    priceApprox: 232.0,
    dayChange: 0.25,
    exchange: "NYSE",
    hasOptions: true,
    description: "Clinical laboratory diagnostic testing, esoteric biomarker screening & drug development support"
  },
  {
    symbol: "DGX",
    name: "Quest Diagnostics",
    subIndustry: "Health Care Services",
    marketCapNum: 17.5,
    priceApprox: 156.0,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Routine diagnostic blood panels, molecular anatomic pathology & consumer-initiated health assays"
  },
  {
    symbol: "STE",
    name: "STERIS plc",
    subIndustry: "Health Care Equipment",
    marketCapNum: 21.5,
    priceApprox: 218.0,
    dayChange: 0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Infection prevention autoclaves, hospital surgical endoscopy reprocessing & gamma contract sterilization"
  },
  {
    symbol: "BAX",
    name: "Baxter International",
    subIndustry: "Health Care Equipment",
    marketCapNum: 17.0,
    priceApprox: 33.5,
    dayChange: -0.30,
    exchange: "NYSE",
    hasOptions: true,
    description: "Intravenous IV solution bags, medication infusion delivery, renal dialysis & surgical hemostats"
  },
  {
    symbol: "PODD",
    name: "Insulet Corporation",
    subIndustry: "Health Care Equipment",
    marketCapNum: 18.0,
    priceApprox: 256.0,
    dayChange: 1.20,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Omnipod tubeless continuous insulin management systems with automated algorithmic dosing"
  },
  {
    symbol: "ILMN",
    name: "Illumina, Inc.",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 21.0,
    priceApprox: 132.0,
    dayChange: -0.90,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Next-generation DNA sequencing instruments (NovaSeq), sequencing reagents & genomic arrays"
  },
  {
    symbol: "MRNA",
    name: "Moderna, Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 21.0,
    priceApprox: 54.0,
    dayChange: -1.45,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "mRNA vaccines: Spikevax COVID-19, mRESVIA RSV vaccine, oncology neoantigen immunotherapies"
  },
  {
    symbol: "INCY",
    name: "Incyte Corporation",
    subIndustry: "Biotechnology",
    marketCapNum: 15.5,
    priceApprox: 73.0,
    dayChange: 0.65,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "JAK inhibitor therapeutics: Jakafi for myelofibrosis, Opzelura cream for vitiligo & atopies"
  },
  {
    symbol: "COO",
    name: "The Cooper Companies",
    subIndustry: "Health Care Equipment",
    marketCapNum: 19.8,
    priceApprox: 99.5,
    dayChange: 0.22,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Contact lenses (CooperVision specialty silicon hydrogel) & CooperSurgical fertility medical devices"
  },
  {
    symbol: "RVTY",
    name: "Revvity, Inc.",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 14.5,
    priceApprox: 118.0,
    dayChange: 0.15,
    exchange: "NYSE",
    hasOptions: true,
    description: "Translational research reagents, newborn screening diagnostics & automated bio-imaging"
  },
  {
    symbol: "TECH",
    name: "Bio-Techne Corporation",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 11.5,
    priceApprox: 73.5,
    dayChange: -0.25,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Purified recombinant proteins, cytokines, antibodies, spatial biology assays & analytical instruments"
  },
  {
    symbol: "CRL",
    name: "Charles River Laboratories",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 9.8,
    priceApprox: 190.0,
    dayChange: -0.40,
    exchange: "NYSE",
    hasOptions: true,
    description: "Preclinical drug discovery research models, safety assessment toxicology & endotoxin microbial testing"
  },
  {
    symbol: "DVA",
    name: "DaVita Inc.",
    subIndustry: "Health Care Facilities",
    marketCapNum: 12.8,
    priceApprox: 158.0,
    dayChange: 0.55,
    exchange: "NYSE",
    hasOptions: true,
    description: "Outpatient kidney dialysis centers, peritoneal home dialysis services & nephrology disease care"
  },
  {
    symbol: "SOLV",
    name: "Solventum Corporation",
    subIndustry: "Health Care Equipment",
    marketCapNum: 12.0,
    priceApprox: 69.5,
    dayChange: 0.35,
    exchange: "NYSE",
    hasOptions: true,
    description: "Advanced wound care dressings, filtration purifications, dental adhesives & health information systems"
  },
  {
    symbol: "HSIC",
    name: "Henry Schein, Inc.",
    subIndustry: "Health Care Distributors",
    marketCapNum: 9.5,
    priceApprox: 73.0,
    dayChange: 0.18,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Dental & medical practice supplies distribution, dental practice software & equipment repair services"
  },
  {
    symbol: "UHS",
    name: "Universal Health Services",
    subIndustry: "Health Care Facilities",
    marketCapNum: 13.8,
    priceApprox: 215.0,
    dayChange: 0.85,
    exchange: "NYSE",
    hasOptions: true,
    description: "Acute care hospitals, psychiatric inpatient facilities & behavioral health treatment programs"
  },
  {
    symbol: "VTRS",
    name: "Viatris Inc.",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 13.5,
    priceApprox: 11.4,
    dayChange: -0.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Generic pharmaceuticals, biosimilars, Lipitor/Norvasc legacy brands & global active ingredients"
  }
];
