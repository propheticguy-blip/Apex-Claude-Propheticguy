// Comprehensive Healthcare Universe Extension
// Covers Large, Mid, and Small Cap US Healthcare stocks ($1B to $100B+)

import { HCStockDef } from './healthcareSeed';

export const HEALTHCARE_EXTENDED_A: HCStockDef[] = [
  // ==========================================
  // MID-LARGE CAP BIOTECH & PHARMA ($10B - $50B)
  // ==========================================
  {
    symbol: "ARGX",
    name: "argenx SE",
    subIndustry: "Biotechnology",
    marketCapNum: 33.5,
    priceApprox: 554.0,
    dayChange: 1.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "FcRn antagonist antibody Vyvgart for generalized myasthenia gravis & autoimmune diseases"
  },
  {
    symbol: "UTHR",
    name: "United Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 16.5,
    priceApprox: 358.0,
    dayChange: 0.85,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Pulmonary arterial hypertension prostacyclins (Tyvaso, Remodulin) & xenotransplantation research"
  },
  {
    symbol: "ALNY",
    name: "Alnylam Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 34.0,
    priceApprox: 268.0,
    dayChange: 1.45,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "RNA interference (RNAi) therapeutics: Amvuttra, Onpattro & Givlaari for rare genetic diseases"
  },
  {
    symbol: "BMRN",
    name: "BioMarin Pharmaceutical",
    subIndustry: "Biotechnology",
    marketCapNum: 13.5,
    priceApprox: 70.0,
    dayChange: -0.35,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Enzyme therapies for rare genetic diseases: Voxzogo for achondroplasia & Roctavian gene therapy"
  },
  {
    symbol: "NBIX",
    name: "Neurocrine Biosciences",
    subIndustry: "Biotechnology",
    marketCapNum: 12.8,
    priceApprox: 124.0,
    dayChange: 0.65,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "VMAT2 inhibitors (Ingrezza) for tardive dyskinesia & neuroendocrine hormone therapeutics"
  },
  {
    symbol: "BGNE",
    name: "BeiGene, Ltd.",
    subIndustry: "Biotechnology",
    marketCapNum: 21.0,
    priceApprox: 202.0,
    dayChange: 1.10,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "BTK inhibitor Brukinsa for blood cancers & Tevimbra anti-PD-1 oncology immunotherapy"
  },
  {
    symbol: "SGEN",
    name: "Seagen / Biotech Holdings",
    subIndustry: "Biotechnology",
    marketCapNum: 10.5,
    priceApprox: 62.0,
    dayChange: 0.20,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Antibody-drug conjugates (ADCs) targeted cancer therapies and clinical oncology payloads"
  },
  {
    symbol: "INSM",
    name: "Insmed Incorporated",
    subIndustry: "Biotechnology",
    marketCapNum: 11.2,
    priceApprox: 71.0,
    dayChange: 1.80,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Inhaled liposomal Arikayce for refractory MAC lung disease & brensocatib for bronchiectasis"
  },
  {
    symbol: "SNDX",
    name: "Syndax Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 1.9,
    priceApprox: 21.5,
    dayChange: 0.40,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Menin inhibitor revumenib for acute leukemia & CSF-1R inhibitor axatilimab for chronic GVHD"
  },
  {
    symbol: "EXEL",
    name: "Exelixis, Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 8.5,
    priceApprox: 28.5,
    dayChange: 0.55,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Small molecule tyrosine kinase inhibitor Cabometyx (cabozantinib) for kidney & liver cancers"
  },
  {
    symbol: "ASND",
    name: "Ascendis Pharma A/S",
    subIndustry: "Biotechnology",
    marketCapNum: 8.2,
    priceApprox: 139.0,
    dayChange: 0.90,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "TransCon prodrug technology: Skytrofa pediatric growth hormone & Yorvipath for hypoparathyroidism"
  },
  {
    symbol: "SRPT",
    name: "Sarepta Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 12.0,
    priceApprox: 122.0,
    dayChange: -0.80,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Elevidys AAV gene therapy & phosphorodiamidate morpholino oligomer exon-skipping for Duchenne MD"
  },
  {
    symbol: "HALO",
    name: "Halozyme Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 6.8,
    priceApprox: 53.0,
    dayChange: 0.45,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "ENHANZE recombinant human hyaluronidase enzyme for subcutaneous biologics delivery"
  },
  {
    symbol: "ROIV",
    name: "Roivant Sciences",
    subIndustry: "Biotechnology",
    marketCapNum: 8.9,
    priceApprox: 12.0,
    dayChange: 0.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Biopharmaceutical Vant incubator pipeline: FcRn inhibitors, dermatalogical Vtama cream & immunology"
  },
  {
    symbol: "JAZZ",
    name: "Jazz Pharmaceuticals",
    subIndustry: "Pharmaceuticals",
    marketCapNum: 7.6,
    priceApprox: 120.0,
    dayChange: 0.30,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Sleep disorder oxybate therapies (Xywav), cannabinoid medicine Epidiolex & oncology drugs"
  },
  {
    symbol: "IONS",
    name: "Ionis Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 6.2,
    priceApprox: 42.0,
    dayChange: -0.25,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Antisense RNA oligonucleotide drugs: Spinraza, Wainua for hereditary ATTR & cardiology pipeline"
  },
  {
    symbol: "ITCI",
    name: "Intra-Cellular Therapies",
    subIndustry: "Biotechnology",
    marketCapNum: 8.4,
    priceApprox: 82.0,
    dayChange: 0.70,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Lumateperone (Caplyta) for schizophrenia, bipolar depression & major depressive disorder"
  },
  {
    symbol: "RARE",
    name: "Ultragenyx Pharmaceutical",
    subIndustry: "Biotechnology",
    marketCapNum: 4.8,
    priceApprox: 54.0,
    dayChange: 0.35,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Therapeutics for rare neurometabolic diseases: Crysvita for XLH, Dojolvi & Evkeeza biologics"
  },
  {
    symbol: "CRSP",
    name: "CRISPR Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 4.5,
    priceApprox: 51.0,
    dayChange: 1.10,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "CRISPR/Cas9 gene-editing medicines: Casgevy cell therapy for sickle cell disease & beta-thalassemia"
  },
  {
    symbol: "BEAM",
    name: "Beam Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 2.3,
    priceApprox: 27.5,
    dayChange: 0.45,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Precision base editing therapies for hematologic diseases, genetic disorders & CAR-T oncology"
  },
  {
    symbol: "NTLA",
    name: "Intellia Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 1.9,
    priceApprox: 18.5,
    dayChange: -0.30,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "In vivo CRISPR gene editing therapies for ATTR amyloidosis (NTLA-2001) and hereditary angioedema"
  },
  {
    symbol: "KYMR",
    name: "Kymera Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 2.8,
    priceApprox: 42.0,
    dayChange: 0.80,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Targeted protein degradation chimera (PROTAC) therapeutics for immunology & oncology"
  },
  {
    symbol: "AXSM",
    name: "Axsome Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 4.6,
    priceApprox: 96.0,
    dayChange: 1.25,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Auvelity for major depressive disorder, Sunosi for narcolepsy daytime sleepiness & migraine therapies"
  },
  {
    symbol: "CYTK",
    name: "Cytokinetics, Incorporated",
    subIndustry: "Biotechnology",
    marketCapNum: 6.1,
    priceApprox: 54.0,
    dayChange: -0.90,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Cardiac muscle sarcomere activator aficamten for hypertrophic cardiomyopathy & heart failure"
  },
  {
    symbol: "APLS",
    name: "Apellis Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 3.5,
    priceApprox: 28.5,
    dayChange: -0.40,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Targeted C3 complement inhibitor Syfovre for geographic atrophy macular degeneration & Empaveli"
  },
  {
    symbol: "IVIC",
    name: "Iveric Bio / Astellas",
    subIndustry: "Biotechnology",
    marketCapNum: 5.2,
    priceApprox: 39.0,
    dayChange: 0.10,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Complement C5 inhibitor Izervay for geographic atrophy secondary to age-related macular degeneration"
  },
  {
    symbol: "VERV",
    name: "Verve Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 1.1,
    priceApprox: 12.0,
    dayChange: 0.20,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Single-course in vivo gene editing medicines targeting PCSK9 & ANGPTL3 for cardiovascular disease"
  },
  {
    symbol: "KURA",
    name: "Kura Oncology",
    subIndustry: "Biotechnology",
    marketCapNum: 1.6,
    priceApprox: 18.0,
    dayChange: 0.45,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Menin inhibitor ziftomenib for NPM1-mutant and KMT2A-rearranged acute myeloid leukemia"
  },
  {
    symbol: "RYTM",
    name: "Rhythm Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 3.2,
    priceApprox: 52.0,
    dayChange: 0.75,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Melanocortin-4 receptor (MC4R) agonist Imcivree for rare genetic disorders of hyperphagic obesity"
  },
  {
    symbol: "VKTX",
    name: "Viking Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 7.8,
    priceApprox: 72.0,
    dayChange: 2.10,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Dual GLP-1/GIP receptor agonist VK2735 for obesity and VK2809 thyroid beta agonist for MASH"
  },
  {
    symbol: "MDGL",
    name: "Madrigal Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 6.2,
    priceApprox: 275.0,
    dayChange: 1.85,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Rezdiffra (resmetirom) first FDA-approved oral treatment for NASH/MASH metabolic liver fibrosis"
  },
  {
    symbol: "ARVN",
    name: "Arvinas, Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 1.8,
    priceApprox: 28.0,
    dayChange: 0.35,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "PROTAC protein degraders vepdegestrant (ARV-471) for ER+/HER2- breast cancer & ARV-766"
  },
  {
    symbol: "IMVT",
    name: "Immunovant, Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 4.1,
    priceApprox: 29.0,
    dayChange: 0.60,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Targeted subcutaneous anti-FcRn monoclonal antibody batoclimab & IMVT-1402 for autoimmune conditions"
  },
  {
    symbol: "MOR",
    name: "MorphoSys AG",
    subIndustry: "Biotechnology",
    marketCapNum: 2.9,
    priceApprox: 73.0,
    dayChange: 0.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Monoclonal antibodies & pelabresib BET inhibitor for myelofibrosis and diffuse large B-cell lymphoma"
  },
  {
    symbol: "PCVX",
    name: "Vaxcyte, Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 14.5,
    priceApprox: 112.0,
    dayChange: 1.30,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Cell-free synthesized 31-valent pneumococcal conjugate vaccines (VAX-31) protecting against invasive disease"
  },
  {
    symbol: "ACAD",
    name: "ACADIA Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 3.2,
    priceApprox: 19.5,
    dayChange: 0.25,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Nuplazid for Parkinson's disease psychosis & Daybue (trofinetide) for Rett syndrome neurodevelopment"
  },
  {
    symbol: "AGIO",
    name: "Agios Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 2.9,
    priceApprox: 46.0,
    dayChange: 0.50,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Pyruvate kinase activator Pyrukynd for hemolytic anemia, thalassemia & sickle cell disease"
  },
  {
    symbol: "PTCT",
    name: "PTC Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 3.4,
    priceApprox: 44.0,
    dayChange: 0.65,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Translational science for rare diseases: Translarna for nonsense mutation Duchenne MD & Evrysdi royalties"
  },
  {
    symbol: "BLUE",
    name: "bluebird bio, Inc.",
    subIndustry: "Biotechnology",
    marketCapNum: 1.1,
    priceApprox: 5.5,
    dayChange: -0.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Lentiviral gene therapies: Zynteglo for beta-thalassemia, Skysona for CALD & Lyfgenia for sickle cell"
  },
  {
    symbol: "BBIO",
    name: "BridgeBio Pharma",
    subIndustry: "Biotechnology",
    marketCapNum: 4.8,
    priceApprox: 25.5,
    dayChange: -0.40,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Acoramidis transthyretin stabilizer for ATTR cardiomyopathy & genetic oncology medicine"
  },
  {
    symbol: "VIR",
    name: "Vir Biotechnology",
    subIndustry: "Biotechnology",
    marketCapNum: 1.6,
    priceApprox: 11.5,
    dayChange: 0.20,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Immunological therapies for chronic hepatitis B (tobevibart, elebsiran) and infectious diseases"
  },
  {
    symbol: "DNLI",
    name: "Denali Therapeutics",
    subIndustry: "Biotechnology",
    marketCapNum: 3.5,
    priceApprox: 24.5,
    dayChange: 0.35,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Blood-brain barrier transport vehicle (TV) technology for neurodegenerative lysosomal storage diseases"
  },
  {
    symbol: "RXRX",
    name: "Recursion Pharmaceuticals",
    subIndustry: "Biotechnology",
    marketCapNum: 2.1,
    priceApprox: 7.2,
    dayChange: 0.15,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "AI-driven phenomic automated wet-lab biology platform mapping biological relationships for drug discovery"
  },
  {
    symbol: "SDGR",
    name: "Schrödinger, Inc.",
    subIndustry: "Health Care Technology",
    marketCapNum: 1.7,
    priceApprox: 22.0,
    dayChange: 0.30,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Physics-based molecular computational simulation software for chemical drug discovery and biophysics"
  },
  {
    symbol: "EXAS",
    name: "Exact Sciences Corporation",
    subIndustry: "Health Care Equipment",
    marketCapNum: 11.8,
    priceApprox: 64.0,
    dayChange: 0.75,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Cologuard noninvasive stool DNA colorectal screening, Oncotype DX breast cancer recurrence genomic assays"
  },
  {
    symbol: "GH",
    name: "Guardant Health",
    subIndustry: "Health Care Equipment",
    marketCapNum: 3.5,
    priceApprox: 27.5,
    dayChange: 0.60,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Shield FDA-approved blood test for colorectal screening & Guardant360 liquid biopsy oncology assays"
  },
  {
    symbol: "NTRA",
    name: "Natera, Inc.",
    subIndustry: "Health Care Diagnostics",
    marketCapNum: 17.5,
    priceApprox: 142.0,
    dayChange: 1.95,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Signatera personalized ctDNA molecular residual disease test & Panorama noninvasive prenatal cell-free DNA"
  },
  {
    symbol: "NEO",
    name: "NeoGenomics, Inc.",
    subIndustry: "Health Care Diagnostics",
    marketCapNum: 1.9,
    priceApprox: 14.8,
    dayChange: 0.22,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Cancer-focused genetic testing, comprehensive flow cytometry, FISH & next-gen sequencing pathology"
  },
  {
    symbol: "QDEL",
    name: "QuidelOrtho Corporation",
    subIndustry: "Health Care Diagnostics",
    marketCapNum: 2.8,
    priceApprox: 41.0,
    dayChange: -0.35,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Point-of-care Sofia immunodiagnostic analyzers, Vitros clinical chemistry & transfusion blood testing"
  },
  {
    symbol: "TXG",
    name: "10x Genomics, Inc.",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 2.2,
    priceApprox: 17.8,
    dayChange: -0.40,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Chromium single-cell sequencing instruments and Visium/Xenium spatial gene expression analyzers"
  },
  {
    symbol: "PACB",
    name: "Pacific Biosciences of California",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 1.1,
    priceApprox: 3.8,
    dayChange: 0.12,
    exchange: "NASDAQ",
    hasOptions: true,
    description: "Single Molecule Real-Time (SMRT) long-read sequencing systems (Revio) for high-fidelity genomic reads"
  },
  {
    symbol: "TMO", // Already in seed, will merge
    name: "Thermo Fisher Scientific",
    subIndustry: "Life Sciences Tools & Services",
    marketCapNum: 220.0,
    priceApprox: 574.0,
    dayChange: 0.44,
    exchange: "NYSE",
    hasOptions: true,
    description: "Analytical scientific instruments, laboratory equipment, bioprocess reagents & CDMO services"
  }
];
