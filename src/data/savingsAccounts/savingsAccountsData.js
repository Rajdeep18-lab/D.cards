import { savingsAccounts as rawSavingsAccounts } from "../mockSavingsAccounts.js";
import { validateSavingsAccount } from "../../utils/dataValidation.js";

/**
 * NORMALIZED SAVINGS ACCOUNTS CATALOGUE
 * All 35 existing savings accounts preserved with 100% fidelity,
 * and enriched with standard parameters and safe fallbacks.
 */
export const savingsAccountsData = (rawSavingsAccounts || []).map(acc => validateSavingsAccount(acc));

export default savingsAccountsData;
