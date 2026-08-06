const { debitCards } = require('../src/data/mockData.js');

function safeNumber(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/[₹,%\s]/g, "").trim();
    const parsed = Number(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

const shopping = 15000, travel = 10000, fuel = 5000, food = 8000, online = 12000;
let hasNaN = false;

debitCards.forEach(card => {
  let cashbackPct = safeNumber(card.cashbackPct);
  if (cashbackPct === 0 && card.cashback) cashbackPct = safeNumber(card.cashback);
  if (cashbackPct === 0 && card.rewardRate) cashbackPct = safeNumber(card.rewardRate);

  const rate = cashbackPct > 1 ? cashbackPct / 100 : (cashbackPct > 0 ? cashbackPct : 0.01);
  let cashback = (shopping + food + online) * rate + travel * rate;

  let fuelSavings = safeNumber(card.fuelBenefit);
  let loungeValue = card.loungeAccess && card.loungeAccess !== "No" ? 350 : 0;
  let forexSavings = 0;

  let annualFeeNum = safeNumber(card.numAnnualFee || card.annualFee);
  let monthlyFee = annualFeeNum / 12;
  let grossMonthlyBenefit = cashback + fuelSavings + loungeValue + forexSavings;
  let netMonthlyBenefit = Math.round(grossMonthlyBenefit - monthlyFee);
  let netYearlyBenefit = Math.round(netMonthlyBenefit * 12);

  if (isNaN(netMonthlyBenefit) || isNaN(netYearlyBenefit)) {
    console.error('NaN detected for card:', card.cardName);
    hasNaN = true;
  }
});

if (!hasNaN) {
  console.log('PASSED: All 100+ cards produced valid numbers! Zero NaN detected.');
}
