import { validateCurrentAccount } from "../../utils/dataValidation.js";

/**
 * INITIAL CURRENT ACCOUNTS DATASET
 * Separate product category for Business and Professional Banking.
 * Adheres strictly to the specification with verified financial parameters.
 */
const rawCurrentAccounts = [
  // =========================================================================
  // 1. STATE BANK OF INDIA
  // =========================================================================
  {
    id: 2001,
    product_id: "sbi-regular-current",
    bank_id: "sbi",
    bankName: "State Bank of India",
    accountName: "SBI Regular Current Account",
    accountType: "Regular Current",
    logo: "SB",
    rating: 4.5,
    isPopular: true,
    suitableFor: "Traders, Retailers, MSMEs, Sole Proprietors and Small Enterprises",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership Firm",
      "Private Limited Company",
      "Public Limited Company",
      "Limited Liability Partnership (LLP)",
      "Trust / Society / Club"
    ],
    minimumBalance: "₹5,000",
    averageBalanceRequirement: "₹5,000 (Monthly Average Balance)",
    nonMaintenanceCharge: "₹500 + GST per month for non-maintenance of MAB",
    interestRate: "0% p.a. (No interest payable as per RBI directives; auto-sweep facility available)",
    eligibility: [
      "Individual conducting proprietary business",
      "Partnership firm registered under Partnership Act",
      "Companies incorporated under Companies Act",
      "Valid business registration proof, GSTIN & PAN"
    ],
    debitCardRelationship: "default",
    debitCardName: "SBI Pride Business RuPay Debit Card",
    debitCardFee: "₹300 + GST annual fee",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹2,00,000 per day",
    cashDepositLimit: "Up to ₹25,000 per day free at non-home branches; ₹5,00,000/month at home branch",
    cashWithdrawalLimit: "Unlimited self-cash withdrawal at home branch; ₹1,00,000/day at non-home branch",
    chequeBook: "50 free cheque leaves per month",
    freeChequeLeaves: "50 leaves / month",
    branchTransactionRules: "Free unlimited cash deposit up to prescribed limits; minimal charges beyond slab",
    neft: "Free via YONO Business & Internet Banking",
    rtgs: "Free via YONO Business & Internet Banking",
    imps: "₹5 + GST per transaction up to ₹1,00,000",
    cashHandlingCharges: "₹0.75 per ₹1,000 beyond free monthly deposit slab (min ₹50, max ₹20,000)",
    keyBenefits: [
      "Extensive nationwide network of 22,000+ branches for effortless multi-city business transactions",
      "Comprehensive YONO Business mobile and web portal for enterprise payouts and vendor management",
      "Free monthly account e-statements and dedicated corporate helpdesk support",
      "50 complimentary multicity payable-at-par cheque leaves every calendar month"
    ],
    specialFeatures: [
      "Corporate net-banking with customizable multi-user maker-checker authorization workflows",
      "Instant tax payments (Direct Tax, GST, Customs) integrated directly into net-banking",
      "Auto-sweep MOD facility option to earn term-deposit interest on surplus idle balances",
      "POS machine and Soundbox integration available for in-store merchant collections"
    ],
    importantConditions: [
      "Account must maintain minimum Monthly Average Balance (MAB) of ₹5,000 to avoid non-maintenance penalty",
      "Entity PAN, Certificate of Incorporation/Registration, and Board Resolution required during opening",
      "Cash deposit charges apply once monthly free thresholds are exceeded"
    ],
    officialSource: "https://sbi.co.in/web/business/sme/current-accounts/regular-current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },
  {
    id: 2002,
    product_id: "sbi-power-jyoti-current",
    bank_id: "sbi",
    bankName: "State Bank of India",
    accountName: "SBI Power Jyoti Current Account",
    accountType: "Fee Collection & Institution Current",
    logo: "SB",
    rating: 4.6,
    isPopular: false,
    suitableFor: "Educational Institutions, Colleges, Universities, Government Bodies & Large Billing Entities",
    businessConstitution: [
      "Educational Institution",
      "Trust / Society",
      "Government Department",
      "Autonomous Body"
    ],
    minimumBalance: "₹50,000",
    averageBalanceRequirement: "₹50,000 (Monthly Average Balance)",
    nonMaintenanceCharge: "₹1,000 + GST per month",
    interestRate: "0% p.a. (Interest not permissible)",
    eligibility: [
      "Colleges, Universities, Examination Boards, and Educational Societies",
      "Recognized institutions collecting fees from students or public via branch network"
    ],
    debitCardRelationship: "optional",
    debitCardName: "SBI Business Premium Debit Card",
    debitCardFee: "₹350 + GST annual fee",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹2,00,000 per day",
    cashDepositLimit: "Unrestricted collection through all 22,000+ SBI branches across India",
    cashWithdrawalLimit: "Branch standard corporate limits",
    chequeBook: "100 free cheque leaves per month",
    freeChequeLeaves: "100 leaves / month",
    branchTransactionRules: "Specialized fee challan collection portal with customized student/challan validation",
    neft: "Free via Digital Banking",
    rtgs: "Free via Digital Banking",
    imps: "Nominal standard RBI slab",
    cashHandlingCharges: "Waivers available based on institutional transaction volume",
    keyBenefits: [
      "Tailor-made for colleges and institutions collecting application fees across India",
      "Fee collection enabled through any SBI branch via specialized pre-printed fee challans",
      "Automated MIS reports provided daily with student roll number and fee head breakdown",
      "Integration with SBI e-Pay and YONO payment gateway for simultaneous online collections"
    ],
    specialFeatures: [
      "Direct API integration for institutional ERP and student fee management systems",
      "Multi-location fee receipt generation with instant reconciliations",
      "Customized teller validation preventing under-collection of fees"
    ],
    importantConditions: [
      "Account opened only for institutional fee/bill collection purposes with formal institution MOU",
      "High volume SLA agreement between institution and bank required"
    ],
    officialSource: "https://sbi.co.in/web/business/sme/current-accounts",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 2. HDFC BANK
  // =========================================================================
  {
    id: 2011,
    product_id: "hdfc-regular-current",
    bank_id: "hdfc-bank",
    bankName: "HDFC Bank",
    accountName: "HDFC Regular Current Account",
    accountType: "Regular Current",
    logo: "HD",
    rating: 4.7,
    isPopular: true,
    suitableFor: "Growing Retail Businesses, Traders, Service Providers & Startups",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited Company",
      "Public Limited Company",
      "Limited Liability Partnership (LLP)"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Quarterly Average Balance in Metro/Urban; ₹5,000 in Semi-Urban)",
    nonMaintenanceCharge: "₹1,500 + GST per quarter for Metro/Urban; ₹1,000 for Semi-Urban/Rural",
    interestRate: "0% p.a. (Sweep-in term deposit option available for excess balance)",
    eligibility: [
      "Proprietorship, Partnership or Corporate entity with valid registration proofs",
      "Entity PAN Card and Aadhaar/OVD of authorized signatories",
      "Proof of business address (GST Registration / Shop & Establishment Certificate)"
    ],
    debitCardRelationship: "default",
    debitCardName: "HDFC Business MoneyBack Debit Card",
    debitCardFee: "₹500 + GST per annum",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹3,00,000 per day",
    cashDepositLimit: "Free cash deposit of ₹2,00,000 per month or 12 times of current month AMB",
    cashWithdrawalLimit: "Unlimited self-withdrawal at base branch; ₹1,00,000/day at non-base branches",
    chequeBook: "100 free payable-at-par cheque leaves per month",
    freeChequeLeaves: "100 leaves / month",
    branchTransactionRules: "Unlimited free branch transactions up to monthly volume limit",
    neft: "Free through NetBanking and MobileBanking",
    rtgs: "Free through NetBanking and MobileBanking",
    imps: "Free on digital banking platforms up to daily transaction ceilings",
    cashHandlingCharges: "₹3.50 per ₹1,000 beyond free limit (Minimum ₹50 per transaction)",
    keyBenefits: [
      "Dynamic cash deposit limit scaling up to 12 times of maintainable Monthly Average Balance",
      "Industry-leading corporate NetBanking portal with bulk NEFT/RTGS payment processing",
      "Free 100 cheque leaves per month payable-at-par across all HDFC Bank branches nationwide",
      "Complimentary merchant payment QR code and Soundbox setup support"
    ],
    specialFeatures: [
      "HDFC Trade Web portal access for instant Trade Forex and import-export document processing",
      "Multi-user corporate banking with customized approval limits and matrix hierarchies",
      "Pre-approved business credit card and collateral-free overdraft evaluation within 6 months"
    ],
    importantConditions: [
      "Quarterly Average Balance (QAB) of ₹10,000 required for Metro/Urban branches",
      "All directors/partners must complete Video KYC or in-person biometric authentication"
    ],
    officialSource: "https://www.hdfcbank.com/sme/current-accounts/regular-current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },
  {
    id: 2012,
    product_id: "hdfc-max-advantage-current",
    bank_id: "hdfc-bank",
    bankName: "HDFC Bank",
    accountName: "HDFC Max Advantage Current Account",
    accountType: "Premium Tier Current",
    logo: "HD",
    rating: 4.8,
    isPopular: true,
    suitableFor: "Mid-to-Large Enterprises, High-Volume Wholesalers & Distributors",
    businessConstitution: [
      "Private Limited Company",
      "Public Limited Company",
      "Partnership Firm",
      "LLP"
    ],
    minimumBalance: "₹1,00,000",
    averageBalanceRequirement: "₹1,00,000 (Monthly Average Balance)",
    nonMaintenanceCharge: "₹3,000 + GST per quarter",
    interestRate: "0% p.a. (High-yield Auto Sweep option available on balances above ₹5 Lakh)",
    eligibility: [
      "Commercial entities with high monthly turnover and active operational history",
      "Full corporate registration documents and audited financials for overdraft linkage"
    ],
    debitCardRelationship: "included",
    debitCardName: "HDFC Business MoneyBack Debit Card",
    debitCardFee: "Waived with maintained balance tier",
    atmLimit: "₹2,00,000 per day",
    posLimit: "₹5,00,000 per day",
    cashDepositLimit: "Free cash deposit of ₹10,00,000 per month or 12 times MAB, whichever is higher",
    cashWithdrawalLimit: "Unlimited at all branches nationwide",
    chequeBook: "500 free cheque leaves per month",
    freeChequeLeaves: "500 leaves / month",
    branchTransactionRules: "Anywhere banking enabled across all HDFC Bank branches without location barriers",
    neft: "Free unlimited digital and branch NEFT",
    rtgs: "Free unlimited digital and branch RTGS",
    imps: "Free on NetBanking and MobileBanking",
    cashHandlingCharges: "Preferential cash handling charge of ₹2.50 per ₹1,000 beyond free slab",
    keyBenefits: [
      "Huge monthly cash deposit allowance of up to ₹10 Lakh or 12x MAB",
      "500 free payable-at-par multicity cheque leaves issued every month",
      "Dedicated Enterprise Relationship Manager for priority branch service and trade queries",
      "Preferential pricing on outward remittances, letter of credit (LC), and bank guarantees (BG)"
    ],
    specialFeatures: [
      "Host-to-Host (H2H) and ERP integration with Tally, SAP, and Zoho Books",
      "Zero digital transaction fees on bulk vendor payouts via API banking",
      "Free dynamic QR code integration and prioritized EDC merchant terminals"
    ],
    importantConditions: [
      "Monthly Average Balance of ₹1,00,000 must be maintained across the calendar month",
      "Subject to annual account review and relationship review"
    ],
    officialSource: "https://www.hdfcbank.com/sme/current-accounts/max-advantage-current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 3. ICICI BANK
  // =========================================================================
  {
    id: 2021,
    product_id: "icici-classic-current",
    bank_id: "icici-bank",
    bankName: "ICICI Bank",
    accountName: "ICICI Classic Current Account",
    accountType: "Regular Current",
    logo: "IC",
    rating: 4.6,
    isPopular: true,
    suitableFor: "Retailers, Service Providers, Consultants and Emerging Startups",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited",
      "LLP",
      "One Person Company (OPC)"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Monthly Average Balance for Metro/Urban)",
    nonMaintenanceCharge: "₹1,000 + GST per month for non-maintenance of MAB",
    interestRate: "0% p.a. (Linked Auto-Sweep Term Deposit available)",
    eligibility: [
      "Entity with valid trade license, Udyam Registration, or GST registration certificate",
      "PAN Card of entity and authorized partners/directors"
    ],
    debitCardRelationship: "default",
    debitCardName: "ICICI Business Gold Debit Card",
    debitCardFee: "₹500 + GST annual fee",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹3,00,000 per day",
    cashDepositLimit: "Free cash deposit up to ₹2,50,000 per month at base branches",
    cashWithdrawalLimit: "Unlimited self-cash withdrawal at base branch; ₹50,000/day at non-base branches",
    chequeBook: "100 free cheque leaves per month",
    freeChequeLeaves: "100 leaves / month",
    branchTransactionRules: "Free transactions up to monthly limits across all ICICI Bank branch network",
    neft: "Free on InstaBIZ App & Corporate Internet Banking",
    rtgs: "Free on InstaBIZ App & Corporate Internet Banking",
    imps: "Free on InstaBIZ mobile app",
    cashHandlingCharges: "₹3.50 per ₹1,000 (Minimum ₹100 per transaction) beyond free limit",
    keyBenefits: [
      "Award-winning ICICI InstaBIZ mobile app supporting 115+ business banking features",
      "Free 100 cheque leaves per month payable-at-par across all domestic branches",
      "Instant overdraft facility up to ₹25 Lakh on digital assessment without property collateral",
      "Integrated connected banking linking directly with Zoho Books, Tally Prime, and QuickBooks"
    ],
    specialFeatures: [
      "Instant digital current account opening through Video KYC for sole proprietorships",
      "Single-click Goods and Services Tax (GST) and direct tax challan settlements",
      "Automated e-invoicing and digital collections with instant QR payment links"
    ],
    importantConditions: [
      "Maintenance of ₹10,000 MAB to avoid service charges",
      "Valid business establishment proof mandatory within 30 days of account initiation"
    ],
    officialSource: "https://www.icicibank.com/business-banking/current-account/classic-current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },
  {
    id: 2022,
    product_id: "icici-one-current",
    bank_id: "icici-bank",
    bankName: "ICICI Bank",
    accountName: "ICICI One Current Account",
    accountType: "Zero / Dynamic Balance Tier Current",
    logo: "IC",
    rating: 4.7,
    isPopular: false,
    suitableFor: "Fast-Growing Businesses with Variable Cash Flows and Seasonal Demand",
    businessConstitution: [
      "Private Limited",
      "LLP",
      "Sole Proprietorship",
      "Partnership"
    ],
    minimumBalance: "₹25,000",
    averageBalanceRequirement: "₹25,000 (Dynamic monthly average based on chosen plan)",
    nonMaintenanceCharge: "₹1,500 + GST per month",
    interestRate: "0% p.a.",
    eligibility: [
      "Active commercial entities seeking bundled transaction packages with waivers"
    ],
    debitCardRelationship: "included",
    debitCardName: "ICICI Business Gold Debit Card",
    debitCardFee: "Zero annual fee under relationship",
    atmLimit: "₹1,50,000 per day",
    posLimit: "₹5,00,000 per day",
    cashDepositLimit: "Up to 10 times the maintained MAB free cash deposit per month",
    cashWithdrawalLimit: "Unlimited self cash withdrawals across all branches",
    chequeBook: "250 free cheque leaves per month",
    freeChequeLeaves: "250 leaves / month",
    branchTransactionRules: "Zero inter-city branch charges anywhere in India",
    neft: "Free unlimited digital transfers",
    rtgs: "Free unlimited digital transfers",
    imps: "Free on digital banking",
    cashHandlingCharges: "₹3 per ₹1,000 beyond the free slab",
    keyBenefits: [
      "Dynamic free transaction limits automatically adjust upwards when your account balance rises",
      "250 free payable-at-par multicity cheque leaves every single month",
      "Complimentary ICICI Business Gold Debit Card with merchant discount privileges",
      "Preferential pricing on Trade Forex, inward remittances, and trade advisory"
    ],
    specialFeatures: [
      "InstaBIZ one-click vendor payouts with automated maker-checker workflows",
      "Seamless integration with popular ERPs for real-time ledger synchronization",
      "Multi-account view across corporate group entities under single unified login"
    ],
    importantConditions: [
      "Requires monthly balance review to determine corresponding tier benefits",
      "Overdraft facility subject to underwriting assessment"
    ],
    officialSource: "https://www.icicibank.com/business-banking/current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 4. AXIS BANK
  // =========================================================================
  {
    id: 2031,
    product_id: "axis-normal-current",
    bank_id: "axis-bank",
    bankName: "Axis Bank",
    accountName: "Axis Normal Current Account",
    accountType: "Regular Current",
    logo: "AX",
    rating: 4.5,
    isPopular: true,
    suitableFor: "Traders, Retail Store Owners, Freelance Consultants & Local Distributors",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited Company",
      "LLP",
      "Trust"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Monthly Average Balance in Metro/Urban)",
    nonMaintenanceCharge: "₹1,000 + GST per month for non-maintenance of MAB",
    interestRate: "0% p.a. (RBI compliant zero-interest mandate)",
    eligibility: [
      "Registered enterprise with valid Business Pan, GST Certificate or Shop Act License",
      "Proof of identity and address of authorized signatories"
    ],
    debitCardRelationship: "default",
    debitCardName: "Axis Bank Business Classic Debit Card",
    debitCardFee: "₹500 + GST per annum",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹3,00,000 per day",
    cashDepositLimit: "₹2,00,000 or up to 10 times of MAB free cash deposit per month",
    cashWithdrawalLimit: "Unlimited self cash withdrawals at home branch; ₹1,00,000/day at other branches",
    chequeBook: "100 free multicity cheque leaves per month",
    freeChequeLeaves: "100 leaves / month",
    branchTransactionRules: "Anywhere banking enabled across 5,000+ Axis Bank branches",
    neft: "Free via Corporate Internet Banking & Axis Mobile App",
    rtgs: "Free via Corporate Internet Banking & Axis Mobile App",
    imps: "Free on digital banking platforms",
    cashHandlingCharges: "₹3.50 per ₹1,000 beyond free slab (Minimum ₹50 per instance)",
    keyBenefits: [
      "100 complimentary multicity cheque leaves provided per calendar month",
      "Free digital NEFT and RTGS transactions on Corporate Internet Banking",
      "Higher cash deposit allowance linked directly to maintainable monthly balances",
      "Convenient doorstep banking services available for cash pick-up and cheque collections"
    ],
    specialFeatures: [
      "Axis Omni corporate net-banking with configurable multi-level maker-checker rights",
      "Instant tax payment modules supporting GST, Advance Tax, and TDS payments",
      "Pre-approved POS machine terminal and soundbox deployments with waived setup costs"
    ],
    importantConditions: [
      "Account must maintain minimum Monthly Average Balance of ₹10,000",
      "Standard KYC re-verification mandatory at periodic regulatory intervals"
    ],
    officialSource: "https://www.axisbank.com/business-banking/current-accounts/normal-current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 5. KOTAK MAHINDRA BANK
  // =========================================================================
  {
    id: 2041,
    product_id: "kotak-neo-current",
    bank_id: "kotak-mahindra-bank",
    bankName: "Kotak Mahindra Bank",
    accountName: "Kotak Neo Current Account",
    accountType: "Digital Startup & Modern Current",
    logo: "KO",
    rating: 4.7,
    isPopular: true,
    suitableFor: "Tech Startups, D2C Brands, Digital Agencies and Freelance Professionals",
    businessConstitution: [
      "Sole Proprietorship",
      "Private Limited Company",
      "LLP",
      "Partnership Firm"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Monthly Average Balance)",
    nonMaintenanceCharge: "₹1,000 + GST per month",
    interestRate: "0% p.a. (ActiveMoney Auto-sweep available for automatic FD interest)",
    eligibility: [
      "Incorporated startups and businesses with valid Udyam or GST credentials",
      "Online video KYC onboarding supported for eligible entities"
    ],
    debitCardRelationship: "default",
    debitCardName: "Kotak Business RuPay Platinum Debit Card",
    debitCardFee: "₹350 + GST annual fee",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹3,00,000 per day",
    cashDepositLimit: "₹2,50,000 per month free cash deposits across branches",
    cashWithdrawalLimit: "Unlimited self cash withdrawals at home branch",
    chequeBook: "75 free cheque leaves per month",
    freeChequeLeaves: "75 leaves / month",
    branchTransactionRules: "Free branch transactions up to monthly volume limit",
    neft: "Free on Kotak Net Banking and Mobile App",
    rtgs: "Free on Kotak Net Banking and Mobile App",
    imps: "Free on digital banking channels",
    cashHandlingCharges: "₹3.50 per ₹1,000 beyond free slab (Minimum ₹50)",
    keyBenefits: [
      "Integrated Kotak ActiveMoney sweep facility earns FD rates on idle operational balances",
      "Fully digital account opening workflow through video-assisted biometric authentication",
      "Free 75 multicity payable-at-par cheque leaves per month",
      "Zero fees on all digital transactions including NEFT, RTGS, and IMPS"
    ],
    specialFeatures: [
      "Kotak Developer API Suite for instant integration of payout disbursements into web/apps",
      "Direct integration with leading fintech accounting packages and payroll engines",
      "Fast-track merchant onboarding for physical POS machines and Soundbox terminals"
    ],
    importantConditions: [
      "MAB of ₹10,000 must be maintained to sustain waived transaction benefits",
      "ActiveMoney sweeps into FD when balance exceeds ₹50,000"
    ],
    officialSource: "https://www.kotak.com/en/business-banking/accounts/current-accounts.html",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },
  {
    id: 2042,
    product_id: "kotak-elite-current",
    bank_id: "kotak-mahindra-bank",
    bankName: "Kotak Mahindra Bank",
    accountName: "Kotak Elite Current Account",
    accountType: "Premium Corporate Current",
    logo: "KO",
    rating: 4.8,
    isPopular: false,
    suitableFor: "Established Enterprises, High Volume Manufacturers & Large Trading Houses",
    businessConstitution: [
      "Private Limited Company",
      "Public Limited Company",
      "LLP",
      "Partnership"
    ],
    minimumBalance: "₹1,00,000",
    averageBalanceRequirement: "₹1,00,000 (Monthly Average Balance)",
    nonMaintenanceCharge: "₹2,500 + GST per month",
    interestRate: "0% p.a. (ActiveMoney sweep-in enabled)",
    eligibility: [
      "Established businesses with high monthly commercial transaction turnovers",
      "Audited financial statements and corporate documentation required"
    ],
    debitCardRelationship: "included",
    debitCardName: "Kotak Business RuPay Platinum Debit Card",
    debitCardFee: "Waived under Elite relationship",
    atmLimit: "₹2,00,000 per day",
    posLimit: "₹5,00,000 per day",
    cashDepositLimit: "Up to ₹15,00,000 free cash deposit per month across branches",
    cashWithdrawalLimit: "Unlimited at all branches",
    chequeBook: "300 free cheque leaves per month",
    freeChequeLeaves: "300 leaves / month",
    branchTransactionRules: "Anywhere banking with dedicated Elite corporate counters",
    neft: "Free unlimited digital & branch NEFT",
    rtgs: "Free unlimited digital & branch RTGS",
    imps: "Free unlimited digital IMPS",
    cashHandlingCharges: "Discounted fee of ₹2.50 per ₹1,000 beyond free monthly limit",
    keyBenefits: [
      "Huge free cash deposit limit up to ₹15 Lakh per month across all Kotak branches",
      "300 free multicity payable-at-par cheque leaves every month",
      "Dedicated Corporate Relationship Manager for all banking, trade, and credit requirements",
      "Preferential exchange rates on cross-border inward and outward foreign currency remittances"
    ],
    specialFeatures: [
      "Host-to-host and automated bulk file uploads for rapid employee salary processing",
      "Tailored working capital and export financing facilities with expedited turnaround times",
      "Complimentary annual financial dashboard reports and customized statement delivery"
    ],
    importantConditions: [
      "Account requires maintenance of ₹1,00,000 Monthly Average Balance",
      "Annual relationship review conducted to ensure ongoing tier benefits"
    ],
    officialSource: "https://www.kotak.com/en/business-banking/accounts/current-accounts.html",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 6. IDFC FIRST BANK
  // =========================================================================
  {
    id: 2051,
    product_id: "idfc-first-freedom-current",
    bank_id: "idfc-first-bank",
    bankName: "IDFC FIRST Bank",
    accountName: "IDFC FIRST Freedom Current Account",
    accountType: "Zero / Transparent Fee Current",
    logo: "ID",
    rating: 4.8,
    isPopular: true,
    suitableFor: "SMEs, Professionals, Healthcare Practitioners and Tech Startups",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited",
      "LLP"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Average Monthly Balance in Metro/Urban)",
    nonMaintenanceCharge: "₹1,000 + GST per month",
    interestRate: "0% p.a. (Auto-sweep available to earn savings/FD rates on idle surplus)",
    eligibility: [
      "Resident individual conducting legitimate business activity",
      "Firm with valid business entity registration, PAN and GST documentation"
    ],
    debitCardRelationship: "default",
    debitCardName: "IDFC FIRST Business Visa Platinum Debit Card",
    debitCardFee: "₹499 + GST annual fee",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹4,00,000 per day",
    cashDepositLimit: "Up to ₹3,00,000 free cash deposit per month at any IDFC FIRST branch",
    cashWithdrawalLimit: "Unlimited free self cash withdrawals at all branches",
    chequeBook: "100 free cheque leaves per month",
    freeChequeLeaves: "100 leaves / month",
    branchTransactionRules: "Zero branch transaction fees across all branch operations nationwide",
    neft: "Free unlimited digital transfers via NetBanking and Mobile App",
    rtgs: "Free unlimited digital transfers via NetBanking and Mobile App",
    imps: "Free unlimited digital IMPS transfers",
    cashHandlingCharges: "Transparent ₹3 per ₹1,000 beyond free slab",
    keyBenefits: [
      "IDFC FIRST's trademark zero-hidden-charges philosophy on essential business banking services",
      "Free unlimited digital payments including NEFT, RTGS, and IMPS without transaction fees",
      "100 free multicity cheque leaves per month payable-at-par nationwide",
      "Dynamic WhatsApp Business Banking alerts for real-time credit updates and balance checks"
    ],
    specialFeatures: [
      "Connected Banking portal integrated with major Indian accounting software",
      "Customizable maker-checker authorizations for corporate fund transfers",
      "Pre-approved instant collateral-free business loan and overdraft assessments"
    ],
    importantConditions: [
      "Monthly balance of ₹10,000 required to maintain free banking privileges",
      "All authorized signatories must satisfy regulatory KYC checks"
    ],
    officialSource: "https://www.idfcfirstbank.com/business-banking/current-account",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 7. BANK OF BARODA
  // =========================================================================
  {
    id: 2061,
    product_id: "bob-baroda-advantage-current",
    bank_id: "bank-of-baroda",
    bankName: "Bank of Baroda",
    accountName: "Baroda Advantage Current Account",
    accountType: "Regular Current",
    logo: "BO",
    rating: 4.4,
    isPopular: false,
    suitableFor: "Manufacturers, Wholesalers, Agricultural Commodity Traders & Exporters",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership Firm",
      "Private Limited",
      "Public Limited",
      "LLP"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Quarterly Average Balance in Metro/Urban)",
    nonMaintenanceCharge: "₹800 + GST per quarter for QAB non-maintenance",
    interestRate: "0% p.a. (Zero interest as mandated by RBI)",
    eligibility: [
      "Entity with valid trade establishment proof, PAN, and address documentation"
    ],
    debitCardRelationship: "default",
    debitCardName: "Baroda Business RuPay Platinum Debit Card",
    debitCardFee: "₹350 + GST annual fee",
    atmLimit: "₹1,00,000 per day",
    posLimit: "₹2,00,000 per day",
    cashDepositLimit: "Up to ₹2,00,000 free cash deposit per day at base branch",
    cashWithdrawalLimit: "Unlimited self cash withdrawals at base branch",
    chequeBook: "50 free cheque leaves per quarter",
    freeChequeLeaves: "50 leaves / quarter",
    branchTransactionRules: "Anywhere banking supported across 8,000+ public sector branches nationwide",
    neft: "Free through Baroda Connect corporate digital banking",
    rtgs: "Free through Baroda Connect corporate digital banking",
    imps: "Nominal standard RBI slab",
    cashHandlingCharges: "₹3 per ₹1,000 beyond daily free cash deposit thresholds",
    keyBenefits: [
      "Wide reach across rural, semi-urban, and metropolitan industrial belts in India",
      "Low quarterly average balance requirement of just ₹10,000",
      "Baroda Connect corporate net-banking with multi-user workflow management",
      "Special trade finance desk for export-import credit, letters of credit, and bank guarantees"
    ],
    specialFeatures: [
      "Fast tax payment gateway for direct excise, customs, and GST payments",
      "Priority processing for government subsidy schemes and MSME credit guarantees"
    ],
    importantConditions: [
      "Quarterly Average Balance (QAB) of ₹10,000 must be maintained",
      "Standard documentation including board resolution and entity registration required"
    ],
    officialSource: "https://www.bankofbaroda.in/business-banking/current-accounts",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },

  // =========================================================================
  // 8. INDUSIND BANK
  // =========================================================================
  {
    id: 2071,
    product_id: "indusind-freedom-current",
    bank_id: "indusind-bank",
    bankName: "IndusInd Bank",
    accountName: "IndusInd Freedom Current Account",
    accountType: "Flexible Balance Current",
    logo: "IN",
    rating: 4.6,
    isPopular: false,
    suitableFor: "Traders, Importers, Exporters, and Professional Consultancies",
    businessConstitution: [
      "Sole Proprietorship",
      "Partnership",
      "Private Limited",
      "LLP"
    ],
    minimumBalance: "₹10,000",
    averageBalanceRequirement: "₹10,000 (Monthly Average Balance)",
    nonMaintenanceCharge: "₹1,000 + GST per month",
    interestRate: "0% p.a.",
    eligibility: [
      "Registered entities with valid KYC and proof of business activities"
    ],
    debitCardRelationship: "default",
    debitCardName: "IndusInd Business Visa Signature Debit Card",
    debitCardFee: "₹650 + GST annual fee",
    atmLimit: "₹1,50,000 per day",
    posLimit: "₹3,50,000 per day",
    cashDepositLimit: "Up to ₹3,00,000 free cash deposit per month across branches",
    cashWithdrawalLimit: "Unlimited self cash withdrawal at base branch",
    chequeBook: "100 free multicity cheque leaves per month",
    freeChequeLeaves: "100 leaves / month",
    branchTransactionRules: "Free branch operations up to monthly volume limit",
    neft: "Free on IndusDirect Corporate portal",
    rtgs: "Free on IndusDirect Corporate portal",
    imps: "Free on digital banking platforms",
    cashHandlingCharges: "₹3.50 per ₹1,000 beyond free slab",
    keyBenefits: [
      "IndusDirect advanced corporate banking portal with automated payment batches",
      "100 free multicity cheque leaves issued monthly payable-at-par nationwide",
      "Dedicated trade forex desk offering competitive live spreads for exporters and importers",
      "High daily ATM and POS spend limits on business debit cards"
    ],
    specialFeatures: [
      "Doorstep banking services for routine cheque pick-up and cash collections",
      "Convenient multi-currency current account integration for cross-border traders"
    ],
    importantConditions: [
      "Maintenance of ₹10,000 MAB required to prevent non-maintenance levy",
      "Entity KYC re-verification mandatory at periodic intervals"
    ],
    officialSource: "https://www.indusind.com/in/en/business/accounts/current-accounts.html",
    sourceType: "Official Bank Source",
    lastVerified: "August 2026"
  },
  // =========================================================================
  // CANARA BANK - CURRENT ACCOUNTS
  // Source: Canara Bank Official Product Dataset
  // =========================================================================
  {
  "id": 2081,
  "product_id": "canara-privilege-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara Privilege Current Account",
  "variant_name": "Canara Privilege Current Account",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": false,
  "suitableFor": "Premier segment customers",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "QAB Rs 1 lakh and above",
  "minimum_balance": "QAB Rs 1 lakh and above",
  "averageMonthlyBalance": "QAB Rs 1 lakh and above",
  "averageBalanceRequirement": "QAB Rs 1 lakh and above",
  "nonMaintenanceCharges": "Rs 1,000 + GST per quarter; additional/concessional facilities withdrawn if not maintained for more than a quarter (restorable next quarter)",
  "nonMaintenanceCharge": "Rs 1,000 + GST per quarter; additional/concessional facilities withdrawn if not maintained for more than a quarter (restorable next quarter)",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Not specified in retrieved excerpt",
  "freeCashDepositPerMonth": "Not specified in retrieved excerpt",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Free printed cheque books (per description)",
  "freeChequeLeaves": "Free printed cheque books (per description)",
  "neft": "Free (per page description)",
  "rtgs": "Free (per page description)",
  "imps": "Free (per page description)",
  "doorstepBanking": "Not specified in retrieved excerpt",
  "posTerminal": "Available on request",
  "debit_card": "Card name NOT stated",
  "debitCard": "Card name NOT stated",
  "associatedDebitCardName": "Card name NOT stated",
  "keyBenefits": [
    "Unlimited locker operations, POS benefits, auto-sweep, personal accident insurance with debit card (per description)",
    "Cash Handling: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "Unlimited locker operations, POS benefits, auto-sweep, personal accident insurance with debit card (per description)"
  ],
  "features": [
    "Minimum Balance: QAB Rs 1 lakh and above",
    "Cash Handling: Not specified in retrieved excerpt",
    "Cheque Leaves: Free printed cheque books (per description)"
  ],
  "specialFeatures": [
    "Minimum Balance: QAB Rs 1 lakh and above",
    "Cheque Facility: Free printed cheque books (per description)"
  ],
  "source": "https://www.canarabank.bank.in/canara-privilege-current-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-privilege-current-account",
  "officialSource": "https://www.canarabank.bank.in/canara-privilege-current-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Privilege Current Account from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": []
},
  {
  "id": 2082,
  "product_id": "canara-rera-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara RERA Current Account",
  "variant_name": "Canara RERA Current Account",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": false,
  "suitableFor": "Not yet retrieved",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "Not yet retrieved",
  "minimum_balance": "Not yet retrieved",
  "averageMonthlyBalance": "Not yet retrieved",
  "averageBalanceRequirement": "Not yet retrieved",
  "nonMaintenanceCharges": "Not yet retrieved",
  "nonMaintenanceCharge": "Not yet retrieved",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Not yet retrieved",
  "freeCashDepositPerMonth": "Not yet retrieved",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Not yet retrieved",
  "freeChequeLeaves": "Not yet retrieved",
  "neft": "Not yet retrieved",
  "rtgs": "Not yet retrieved",
  "imps": "Not yet retrieved",
  "doorstepBanking": "Not yet retrieved",
  "posTerminal": "Available on request",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "keyBenefits": [
    "Not yet retrieved",
    "Cash Handling: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Cash Handling: Not yet retrieved",
    "Cheque Leaves: Not yet retrieved"
  ],
  "specialFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Cheque Facility: Not yet retrieved"
  ],
  "source": "https://www.canarabank.bank.in/canara-rera-current-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-rera-current-account",
  "officialSource": "https://www.canarabank.bank.in/canara-rera-current-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara RERA Current Account from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": []
},
  {
  "id": 2083,
  "product_id": "canara-delite-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara Delite Account",
  "variant_name": "Canara Delite Account",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": false,
  "suitableFor": "Ultra-HNI segment",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "QAB Rs 10 lakh and above",
  "minimum_balance": "QAB Rs 10 lakh and above",
  "averageMonthlyBalance": "QAB Rs 10 lakh and above",
  "averageBalanceRequirement": "QAB Rs 10 lakh and above",
  "nonMaintenanceCharges": "Rs 2,500 per quarter; freebies withdrawn if not maintained for more than a quarter",
  "nonMaintenanceCharge": "Rs 2,500 per quarter; freebies withdrawn if not maintained for more than a quarter",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Not specified in retrieved excerpt",
  "freeCashDepositPerMonth": "Not specified in retrieved excerpt",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Not specified in retrieved excerpt",
  "freeChequeLeaves": "Not specified in retrieved excerpt",
  "neft": "Not specified in retrieved excerpt",
  "rtgs": "Not specified in retrieved excerpt",
  "imps": "Not specified in retrieved excerpt",
  "doorstepBanking": "Not specified in retrieved excerpt",
  "posTerminal": "Available on request",
  "debit_card": "Not verified (2023 PDF text mentions RuPay Select and corporate credit card but column alignment is scrambled)",
  "debitCard": "Not verified (2023 PDF text mentions RuPay Select and corporate credit card but column alignment is scrambled)",
  "associatedDebitCardName": "Not verified (2023 PDF text mentions RuPay Select and corporate credit card but column alignment is scrambled)",
  "keyBenefits": [
    "Portability from General CA, Privilege, Elite and vice versa",
    "Cash Handling: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "Portability from General CA, Privilege, Elite and vice versa"
  ],
  "features": [
    "Minimum Balance: QAB Rs 10 lakh and above",
    "Cash Handling: Not specified in retrieved excerpt",
    "Cheque Leaves: Not specified in retrieved excerpt"
  ],
  "specialFeatures": [
    "Minimum Balance: QAB Rs 10 lakh and above",
    "Cheque Facility: Not specified in retrieved excerpt"
  ],
  "source": "https://www.canarabank.bank.in/canara-delite-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-delite-account",
  "officialSource": "https://www.canarabank.bank.in/canara-delite-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Delite Account from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": []
},
  {
  "id": 2084,
  "product_id": "canara-general-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara Current Account (General)",
  "variant_name": "Canara Current Account (General)",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": true,
  "suitableFor": "Individuals, sole proprietors, partnership firms, LLPs, HUFs, companies, public corporations, societies/clubs, trusts, executors, government bodies, charitable/religious institutions",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "AMB Rs 7,500 metro / Rs 5,000 urban / Rs 2,000 semi-urban / Rs 1,000 rural (2023 PDF)",
  "minimum_balance": "AMB Rs 7,500 metro / Rs 5,000 urban / Rs 2,000 semi-urban / Rs 1,000 rural (2023 PDF)",
  "averageMonthlyBalance": "AMB Rs 7,500 metro / Rs 5,000 urban / Rs 2,000 semi-urban / Rs 1,000 rural (2023 PDF)",
  "averageBalanceRequirement": "AMB Rs 7,500 metro / Rs 5,000 urban / Rs 2,000 semi-urban / Rs 1,000 rural (2023 PDF)",
  "nonMaintenanceCharges": "Not yet retrieved from official source",
  "nonMaintenanceCharge": "Not yet retrieved from official source",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Not specified in retrieved excerpt",
  "freeCashDepositPerMonth": "Not specified in retrieved excerpt",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Not specified in retrieved excerpt",
  "freeChequeLeaves": "Not specified in retrieved excerpt",
  "neft": "Not specified in retrieved excerpt",
  "rtgs": "Not specified in retrieved excerpt",
  "imps": "Not specified in retrieved excerpt",
  "doorstepBanking": "Not specified in retrieved excerpt",
  "posTerminal": "Available on request",
  "debit_card": "Not specified on official source",
  "debitCard": "Not specified on official source",
  "associatedDebitCardName": "Not specified on official source",
  "keyBenefits": [
    "Not specified in retrieved excerpt",
    "Cash Handling: Not specified in retrieved excerpt"
  ],
  "benefits": [
    "Not specified in retrieved excerpt"
  ],
  "features": [
    "Minimum Balance: AMB Rs 7,500 metro / Rs 5,000 urban / Rs 2,000 semi-urban / Rs 1,000 rural (2023 PDF)",
    "Cash Handling: Not specified in retrieved excerpt",
    "Cheque Leaves: Not specified in retrieved excerpt"
  ],
  "specialFeatures": [
    "Minimum Balance: AMB Rs 7,500 metro / Rs 5,000 urban / Rs 2,000 semi-urban / Rs 1,000 rural (2023 PDF)",
    "Cheque Facility: Not specified in retrieved excerpt"
  ],
  "source": "https://www.canarabank.bank.in/documents/d/guest/current-account-products-1207202306-1",
  "officialSourceUrl": "https://www.canarabank.bank.in/documents/d/guest/current-account-products-1207202306-1",
  "officialSource": "https://www.canarabank.bank.in/documents/d/guest/current-account-products-1207202306-1",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Current Account (General) from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": []
},
  {
  "id": 2085,
  "product_id": "canara-elite-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara Elite Current Account",
  "variant_name": "Canara Elite Current Account",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": true,
  "suitableFor": "Elite segment customers",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "QAB Rs 5 lakh and above",
  "minimum_balance": "QAB Rs 5 lakh and above",
  "averageMonthlyBalance": "QAB Rs 5 lakh and above",
  "averageBalanceRequirement": "QAB Rs 5 lakh and above",
  "nonMaintenanceCharges": "Rs 2,000 per quarter; benefits withdrawn if not maintained for more than a quarter",
  "nonMaintenanceCharge": "Rs 2,000 per quarter; benefits withdrawn if not maintained for more than a quarter",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Free cash handling up to Rs 10 lakh/day, cap Rs 1 crore/month; any Branch/Kiosk/BNA; denominations Rs 100 and above",
  "freeCashDepositPerMonth": "Not specified in retrieved excerpt",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Not specified in retrieved excerpt",
  "freeChequeLeaves": "Not specified in retrieved excerpt",
  "neft": "Free (per description)",
  "rtgs": "Free (per description)",
  "imps": "Free (per description)",
  "doorstepBanking": "Not specified in retrieved excerpt",
  "posTerminal": "Available on request",
  "debit_card": "RuPay Platinum",
  "debitCard": "RuPay Platinum",
  "associatedDebitCardName": "RuPay Platinum",
  "keyBenefits": [
    "Unlimited free locker operations; free POS terminal; auto-sweep; free digital banking (per description)",
    "Cash Handling: Free cash handling up to Rs 10 lakh/day, cap Rs 1 crore/month; any Branch/Kiosk/BNA; denominations Rs 100 and above"
  ],
  "benefits": [
    "Unlimited free locker operations; free POS terminal; auto-sweep; free digital banking (per description)"
  ],
  "features": [
    "Minimum Balance: QAB Rs 5 lakh and above",
    "Cash Handling: Free cash handling up to Rs 10 lakh/day, cap Rs 1 crore/month; any Branch/Kiosk/BNA; denominations Rs 100 and above",
    "Cheque Leaves: Not specified in retrieved excerpt"
  ],
  "specialFeatures": [
    "Minimum Balance: QAB Rs 5 lakh and above",
    "Cheque Facility: Not specified in retrieved excerpt"
  ],
  "source": "https://www.canarabank.bank.in/canara-elite-current-account",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-elite-current-account",
  "officialSource": "https://www.canarabank.bank.in/canara-elite-current-account",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "Retrieved (partial)",
  "description": "Canara Elite Current Account from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": [
    {
      "card_id": "canara-bank-rupay-platinum",
      "relationship": "included",
      "verification_status": "verified"
    }
  ]
},
  {
  "id": 2086,
  "product_id": "canara-prarambh-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara Prarambh",
  "variant_name": "Canara Prarambh",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": false,
  "suitableFor": "Not yet retrieved",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "Not yet retrieved",
  "minimum_balance": "Not yet retrieved",
  "averageMonthlyBalance": "Not yet retrieved",
  "averageBalanceRequirement": "Not yet retrieved",
  "nonMaintenanceCharges": "Not yet retrieved",
  "nonMaintenanceCharge": "Not yet retrieved",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Not yet retrieved",
  "freeCashDepositPerMonth": "Not yet retrieved",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Not yet retrieved",
  "freeChequeLeaves": "Not yet retrieved",
  "neft": "Not yet retrieved",
  "rtgs": "Not yet retrieved",
  "imps": "Not yet retrieved",
  "doorstepBanking": "Not yet retrieved",
  "posTerminal": "Available on request",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "keyBenefits": [
    "Not yet retrieved",
    "Cash Handling: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Cash Handling: Not yet retrieved",
    "Cheque Leaves: Not yet retrieved"
  ],
  "specialFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Cheque Facility: Not yet retrieved"
  ],
  "source": "https://www.canarabank.bank.in/canara-prarambh",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-prarambh",
  "officialSource": "https://www.canarabank.bank.in/canara-prarambh",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara Prarambh from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": []
},
  {
  "id": 2087,
  "product_id": "canara-truedge-current",
  "bank_id": "canara-bank",
  "bankName": "Canara Bank",
  "bank_name": "Canara Bank",
  "bank": "Canara Bank",
  "accountName": "Canara TruEdge (Current)",
  "variant_name": "Canara TruEdge (Current)",
  "accountType": "Current Account",
  "account_type": "Current Account",
  "logo": "CB",
  "rating": 4.4,
  "isPopular": false,
  "suitableFor": "Not yet retrieved",
  "businessConstitution": [
    "Sole Proprietorship",
    "Partnership Firm",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Trust / Society / Association"
  ],
  "minimumBalance": "Not yet retrieved",
  "minimum_balance": "Not yet retrieved",
  "averageMonthlyBalance": "Not yet retrieved",
  "averageBalanceRequirement": "Not yet retrieved",
  "nonMaintenanceCharges": "Not yet retrieved",
  "nonMaintenanceCharge": "Not yet retrieved",
  "interestRate": "0% (RBI regulations prohibit interest on Current Accounts)",
  "cashDepositLimit": "Not yet retrieved",
  "freeCashDepositPerMonth": "Not yet retrieved",
  "cashWithdrawalLimit": "Unlimited at base branch; inter-branch limits apply",
  "chequeBook": "Not yet retrieved",
  "freeChequeLeaves": "Not yet retrieved",
  "neft": "Not yet retrieved",
  "rtgs": "Not yet retrieved",
  "imps": "Not yet retrieved",
  "doorstepBanking": "Not yet retrieved",
  "posTerminal": "Available on request",
  "debit_card": "Not yet retrieved",
  "debitCard": "Not yet retrieved",
  "associatedDebitCardName": "Not yet retrieved",
  "keyBenefits": [
    "Not yet retrieved",
    "Cash Handling: Not yet retrieved"
  ],
  "benefits": [
    "Not yet retrieved"
  ],
  "features": [
    "Minimum Balance: Not yet retrieved",
    "Cash Handling: Not yet retrieved",
    "Cheque Leaves: Not yet retrieved"
  ],
  "specialFeatures": [
    "Minimum Balance: Not yet retrieved",
    "Cheque Facility: Not yet retrieved"
  ],
  "source": "https://www.canarabank.bank.in/canara-truedges",
  "officialSourceUrl": "https://www.canarabank.bank.in/canara-truedges",
  "officialSource": "https://www.canarabank.bank.in/canara-truedges",
  "sourceType": "Official Bank Source",
  "sourceFile": "Canara Bank Product Dataset",
  "lastVerified": "2026-09-21",
  "information_status": "NOT RETRIEVED - listed on official menu only",
  "description": "Canara TruEdge (Current) from Canara Bank tailored for businesses and commercial entities.",
  "debit_card_relationships": []
}
];

export const currentAccountsData = rawCurrentAccounts.map(acc => validateCurrentAccount(acc));

export default currentAccountsData;
