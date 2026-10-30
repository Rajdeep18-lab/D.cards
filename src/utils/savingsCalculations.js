/**
 * FINANCIAL CALCULATION ENGINE FOR D.CARD SAVINGS CALCULATOR
 * 
 * Implements rigorous time-value-of-money, compound interest,
 * recurring annuity, inflation adjustment, and goal planning calculations.
 * 
 * Complies with Indian banking conventions (Quarterly compounding by default for savings accounts).
 */

export const FREQUENCIES = {
  daily: { id: 'daily', label: 'Daily', periodsPerYear: 365, shortLabel: '/day' },
  weekly: { id: 'weekly', label: 'Weekly', periodsPerYear: 52, shortLabel: '/wk' },
  monthly: { id: 'monthly', label: 'Monthly', periodsPerYear: 12, shortLabel: '/mo' },
  quarterly: { id: 'quarterly', label: 'Quarterly', periodsPerYear: 4, shortLabel: '/qtr' },
  yearly: { id: 'yearly', label: 'Yearly', periodsPerYear: 1, shortLabel: '/yr' },
  once: { id: 'once', label: 'One-time deposit only', periodsPerYear: 0, shortLabel: 'one-time' },
};

export const COMPOUNDING_FREQUENCIES = {
  daily: { id: 'daily', label: 'Daily (365 times/yr)', timesPerYear: 365 },
  monthly: { id: 'monthly', label: 'Monthly (12 times/yr)', timesPerYear: 12 },
  quarterly: { id: 'quarterly', label: 'Quarterly (4 times/yr - Bank Standard)', timesPerYear: 4 },
  annually: { id: 'annually', label: 'Annually (1 time/yr)', timesPerYear: 1 },
};

export const QUICK_PRESETS = [
  {
    id: 'start-small',
    title: 'Start Small',
    titleHi: 'शुरुआत करें छोटी बचत से',
    description: '₹10 per day habit building',
    descriptionHi: 'प्रतिदिन ₹10 की नियमित आदत',
    initialDeposit: 0,
    contribution: 10,
    frequency: 'daily',
    durationValue: 1,
    durationUnit: 'years',
    annualRate: 3.0,
    targetAmount: 5000,
  },
  {
    id: 'student',
    title: 'Student Saver',
    titleHi: 'विद्यार्थी पॉकेट सेविंग्स',
    description: '₹500 per month pocket money',
    descriptionHi: 'प्रति माह ₹500 पॉकेट मनी से बचत',
    initialDeposit: 1000,
    contribution: 500,
    frequency: 'monthly',
    durationValue: 3,
    durationUnit: 'years',
    annualRate: 3.5,
    targetAmount: 25000,
  },
  {
    id: 'regular',
    title: 'Regular Saver',
    titleHi: 'नियमित बचतकर्ता',
    description: '₹2,000 per month salary reserve',
    descriptionHi: 'प्रति माह ₹2,000 वेतन से रिजर्व',
    initialDeposit: 5000,
    contribution: 2000,
    frequency: 'monthly',
    durationValue: 5,
    durationUnit: 'years',
    annualRate: 4.0,
    targetAmount: 150000,
  },
  {
    id: 'family',
    title: 'Family Goal',
    titleHi: 'पारिवारिक लक्ष्य',
    description: '₹5,000 per month future fund',
    descriptionHi: 'प्रति माह ₹5,000 भविष्य निधि',
    initialDeposit: 25000,
    contribution: 5000,
    frequency: 'monthly',
    durationValue: 7,
    durationUnit: 'years',
    annualRate: 6.0,
    targetAmount: 600000,
  },
  {
    id: 'custom',
    title: 'Custom Plan',
    titleHi: 'अपनी पसंद का प्लान',
    description: 'Personalized savings journey',
    descriptionHi: 'व्यक्तिगत वित्तीय योजना',
    initialDeposit: 0,
    contribution: 1000,
    frequency: 'monthly',
    durationValue: 2,
    durationUnit: 'years',
    annualRate: 3.5,
    targetAmount: 50000,
  }
];

/**
 * Safely parse any numerical value, guarding against NaN, Infinity, negative values, and extreme extremes.
 */
export function sanitizeNumber(value, fallback = 0, { min = 0, max = 1e12 } = {}) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, value));
  }
  const str = String(value).replace(/[₹,%\s]/g, '').trim();
  const parsed = parseFloat(str);
  if (isNaN(parsed) || !isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

/**
 * Converts duration value and unit into exact years and total months.
 */
export function normalizeDuration(durationValue, durationUnit = 'years') {
  const safeVal = sanitizeNumber(durationValue, 0, { min: 0, max: 100 });
  if (durationUnit === 'months') {
    return {
      years: safeVal / 12,
      totalMonths: Math.round(safeVal),
      durationValue: safeVal,
      durationUnit: 'months'
    };
  }
  return {
    years: safeVal,
    totalMonths: Math.round(safeVal * 12),
    durationValue: safeVal,
    durationUnit: 'years'
  };
}

/**
 * Core Financial Projection Engine
 */
export function calculateSavingsProjection({
  initialDeposit = 0,
  contribution = 0,
  frequency = 'monthly',
  durationValue = 1,
  durationUnit = 'years',
  annualRate = 3.5,
  compoundingFrequency = 'quarterly',
  timing = 'end', // 'beginning' (Annuity Due) or 'end' (Ordinary Annuity)
  inflationRate = 0,
  stepUpRate = 0, // Annual % increase in recurring contribution
  targetAmount = 0
}) {
  const p0 = sanitizeNumber(initialDeposit, 0);
  const c0 = sanitizeNumber(contribution, 0);
  const rAnnual = sanitizeNumber(annualRate, 0, { min: 0, max: 100 }) / 100;
  const infRate = sanitizeNumber(inflationRate, 0, { min: 0, max: 50 }) / 100;
  const stepRate = sanitizeNumber(stepUpRate, 0, { min: 0, max: 100 }) / 100;
  const target = sanitizeNumber(targetAmount, 0);

  const { years: durationYears, totalMonths } = normalizeDuration(durationValue, durationUnit);
  const freqConfig = FREQUENCIES[frequency] || FREQUENCIES.monthly;
  const compConfig = COMPOUNDING_FREQUENCIES[compoundingFrequency] || COMPOUNDING_FREQUENCIES.quarterly;

  const mComp = compConfig.timesPerYear;
  const fContrib = freqConfig.periodsPerYear;

  // Handle edge case: duration = 0
  if (durationYears <= 0) {
    const isTargetAchieved = target > 0 ? p0 >= target : false;
    return {
      initialDeposit: p0,
      totalContributions: p0,
      recurringContributionsTotal: 0,
      nominalInterestEarned: 0,
      nominalFinalBalance: p0,
      inflationAdjustedBalance: p0,
      inflationPurchasingPowerLoss: 0,
      effectiveAnnualRate: 0,
      milestones: [],
      chartData: [{ period: 0, label: 'Start', contributed: p0, balance: p0, realBalance: p0, interest: 0 }],
      goalProgress: {
        target,
        currentBalance: p0,
        amountRemaining: Math.max(0, target - p0),
        percentageAchieved: target > 0 ? Math.min(100, (p0 / target) * 100) : 0,
        isAchieved: isTargetAchieved,
        isAchievable: isTargetAchieved,
        timeToReachYears: isTargetAchieved ? 0 : null,
        timeToReachMonths: isTargetAchieved ? 0 : null,
        requiredContribution: null,
      }
    };
  }

  // Effective Annual Rate (EAR)
  const EAR = rAnnual > 0 ? Math.pow(1 + rAnnual / mComp, mComp) - 1 : 0;

  // Rate per contribution period
  let rPer = 0;
  if (rAnnual > 0 && fContrib > 0) {
    rPer = Math.pow(1 + EAR, 1 / fContrib) - 1;
  }

  // Determine total contribution periods
  let totalPeriods = 0;
  if (fContrib > 0) {
    totalPeriods = Math.round(durationYears * fContrib);
  }

  // Track milestones at standard intervals (1 month, 6 months, 12, 24, 36, 60, 120, and final)
  const milestoneTargetMonths = [1, 6, 12, 24, 36, 60, 120].filter(m => m < totalMonths);
  if (totalMonths > 0) {
    milestoneTargetMonths.push(totalMonths);
  }
  const milestones = [];

  // Simulation of balance growth
  let currentBalance = p0;
  let totalContributed = p0;
  let recurringContributed = 0;

  // Chart points count
  const chartPointsCount = Math.min(totalMonths > 0 ? totalMonths + 1 : 13, 36);
  const sampleIntervalYears = durationYears / (chartPointsCount - 1 || 1);

  const chartData = [
    {
      period: 0,
      year: 0,
      month: 0,
      label: 'Start',
      contributed: Math.round(p0),
      balance: Math.round(p0),
      realBalance: Math.round(p0),
      interest: 0
    }
  ];

  let nextSampleTime = sampleIntervalYears;
  let sampleIndex = 1;

  if (totalPeriods === 0 || fContrib === 0 || c0 === 0) {
    // Only Initial Deposit compounding (or zero contributions)
    if (totalPeriods === 0 || fContrib === 0) {
      for (let s = 1; s < chartPointsCount; s++) {
        const t = (s / (chartPointsCount - 1)) * durationYears;
        const b = rAnnual > 0 ? p0 * Math.pow(1 + rAnnual / mComp, mComp * t) : p0;
        const realB = infRate > 0 ? b / Math.pow(1 + infRate, t) : b;
        chartData.push({
          period: s,
          year: Number(t.toFixed(2)),
          month: Math.round(t * 12),
          label: durationYears <= 1 ? `Mo ${Math.round(t * 12)}` : `Yr ${t.toFixed(1)}`,
          contributed: Math.round(p0),
          balance: Math.round(b),
          realBalance: Math.round(realB),
          interest: Math.round(Math.max(0, b - p0))
        });
      }
      currentBalance = rAnnual > 0 ? p0 * Math.pow(1 + rAnnual / mComp, mComp * durationYears) : p0;
    } else {
      let nextMilestoneIdx = 0;
      for (let k = 1; k <= totalPeriods; k++) {
        currentBalance = currentBalance * (1 + rPer);
        const tNow = k / fContrib;
        const mNow = Math.round(tNow * 12);

        // Check milestones
        if (nextMilestoneIdx < milestoneTargetMonths.length && mNow >= milestoneTargetMonths[nextMilestoneIdx]) {
          const mVal = milestoneTargetMonths[nextMilestoneIdx];
          const realB = infRate > 0 ? currentBalance / Math.pow(1 + infRate, tNow) : currentBalance;
          milestones.push({
            month: mVal,
            label: mVal < 12 ? `${mVal} ${mVal === 1 ? 'Month' : 'Months'}` : `${(mVal / 12).toFixed(mVal % 12 === 0 ? 0 : 1)} ${mVal === 12 ? 'Year' : 'Years'}`,
            contributed: Math.round(p0),
            interest: Math.round(Math.max(0, currentBalance - p0)),
            balance: Math.round(currentBalance),
            realBalance: Math.round(realB)
          });
          nextMilestoneIdx++;
        }

        if (tNow >= nextSampleTime - 1e-6 || k === totalPeriods) {
          const realB = infRate > 0 ? currentBalance / Math.pow(1 + infRate, tNow) : currentBalance;
          chartData.push({
            period: sampleIndex++,
            year: Number(tNow.toFixed(2)),
            month: mNow,
            label: durationYears <= 1 ? `Mo ${mNow}` : `Yr ${tNow.toFixed(1)}`,
            contributed: Math.round(p0),
            balance: Math.round(currentBalance),
            realBalance: Math.round(realB),
            interest: Math.round(Math.max(0, currentBalance - p0))
          });
          nextSampleTime += sampleIntervalYears;
        }
      }
    }

    // If no milestones populated yet (e.g. one-time deposit)
    if (milestones.length === 0) {
      milestoneTargetMonths.forEach(mVal => {
        const t = mVal / 12;
        const b = rAnnual > 0 ? p0 * Math.pow(1 + rAnnual / mComp, mComp * t) : p0;
        const realB = infRate > 0 ? b / Math.pow(1 + infRate, t) : b;
        milestones.push({
          month: mVal,
          label: mVal < 12 ? `${mVal} ${mVal === 1 ? 'Month' : 'Months'}` : `${(mVal / 12).toFixed(mVal % 12 === 0 ? 0 : 1)} ${mVal === 12 ? 'Year' : 'Years'}`,
          contributed: Math.round(p0),
          interest: Math.round(Math.max(0, b - p0)),
          balance: Math.round(b),
          realBalance: Math.round(realB)
        });
      });
    }
  } else {
    // Both Initial deposit and recurring contributions
    let nextMilestoneIdx = 0;

    for (let k = 1; k <= totalPeriods; k++) {
      const yearIdx = Math.floor((k - 1) / fContrib);
      const periodContrib = stepRate > 0 ? c0 * Math.pow(1 + stepRate, yearIdx) : c0;

      totalContributed += periodContrib;
      recurringContributed += periodContrib;

      if (timing === 'beginning') {
        currentBalance = (currentBalance + periodContrib) * (1 + rPer);
      } else {
        currentBalance = currentBalance * (1 + rPer) + periodContrib;
      }

      const tNow = k / fContrib;
      const mNow = Math.round(tNow * 12);

      // Check milestones
      if (nextMilestoneIdx < milestoneTargetMonths.length && mNow >= milestoneTargetMonths[nextMilestoneIdx]) {
        const mVal = milestoneTargetMonths[nextMilestoneIdx];
        const realB = infRate > 0 ? currentBalance / Math.pow(1 + infRate, tNow) : currentBalance;
        milestones.push({
          month: mVal,
          label: mVal < 12 ? `${mVal} ${mVal === 1 ? 'Month' : 'Months'}` : `${(mVal / 12).toFixed(mVal % 12 === 0 ? 0 : 1)} ${mVal === 12 ? 'Year' : 'Years'}`,
          contributed: Math.round(totalContributed),
          interest: Math.round(Math.max(0, currentBalance - totalContributed)),
          balance: Math.round(currentBalance),
          realBalance: Math.round(realB)
        });
        nextMilestoneIdx++;
      }

      if (tNow >= nextSampleTime - 1e-6 || k === totalPeriods) {
        const realB = infRate > 0 ? currentBalance / Math.pow(1 + infRate, tNow) : currentBalance;
        chartData.push({
          period: sampleIndex++,
          year: Number(tNow.toFixed(2)),
          month: mNow,
          label: durationYears <= 1 ? `Mo ${mNow}` : `Yr ${tNow.toFixed(1)}`,
          contributed: Math.round(totalContributed),
          balance: Math.round(currentBalance),
          realBalance: Math.round(realB),
          interest: Math.round(Math.max(0, currentBalance - totalContributed))
        });
        nextSampleTime += sampleIntervalYears;
      }
    }
  }

  // Ensure last point matches exact final balance
  if (chartData.length > 0) {
    const last = chartData[chartData.length - 1];
    last.balance = Math.round(currentBalance);
    last.contributed = Math.round(totalContributed);
    last.interest = Math.round(Math.max(0, currentBalance - totalContributed));
    last.realBalance = Math.round(infRate > 0 ? currentBalance / Math.pow(1 + infRate, durationYears) : currentBalance);
  }

  const nominalFinalBalance = Math.max(0, currentBalance);
  const nominalInterestEarned = Math.max(0, nominalFinalBalance - totalContributed);
  const inflationAdjustedBalance = infRate > 0 
    ? nominalFinalBalance / Math.pow(1 + infRate, durationYears) 
    : nominalFinalBalance;
  const inflationPurchasingPowerLoss = Math.max(0, nominalFinalBalance - inflationAdjustedBalance);

  // Goal Planner Metrics
  let goalProgress = {
    target,
    currentBalance: Math.round(nominalFinalBalance),
    amountRemaining: Math.max(0, Math.round(target - nominalFinalBalance)),
    percentageAchieved: target > 0 ? Math.min(100, Number(((nominalFinalBalance / target) * 100).toFixed(1))) : 0,
    isAchieved: target > 0 ? nominalFinalBalance >= target : false,
    isAchievable: true,
    timeToReachYears: null,
    timeToReachMonths: null,
    requiredContribution: null,
  };

  if (target > 0) {
    if (nominalFinalBalance >= target) {
      goalProgress.isAchieved = true;
      goalProgress.timeToReachYears = durationYears;
      goalProgress.timeToReachMonths = totalMonths;
    } else {
      // Compute required contribution to reach target within duration
      const fvP0 = rAnnual > 0 ? p0 * Math.pow(1 + EAR, durationYears) : p0;
      const shortfallFromP0 = target - fvP0;

      if (shortfallFromP0 <= 0) {
        goalProgress.requiredContribution = 0;
      } else if (totalPeriods > 0 && fContrib > 0) {
        if (rPer === 0) {
          goalProgress.requiredContribution = Math.ceil(shortfallFromP0 / totalPeriods);
        } else {
          const timingMultiplier = timing === 'beginning' ? (1 + rPer) : 1;
          const annuityFactor = ((Math.pow(1 + rPer, totalPeriods) - 1) / rPer) * timingMultiplier;
          if (annuityFactor > 0) {
            goalProgress.requiredContribution = Math.ceil(shortfallFromP0 / annuityFactor);
          }
        }
      } else {
        goalProgress.requiredContribution = null; // Unachievable with 0 recurring periods
      }

      // Compute time to reach target under current contribution rate
      if (c0 === 0 && rAnnual === 0) {
        goalProgress.isAchievable = false;
      } else if (c0 === 0 && rAnnual > 0) {
        if (p0 <= 0) {
          goalProgress.isAchievable = false;
        } else {
          const yearsReq = Math.log(target / p0) / Math.log(1 + EAR);
          if (isFinite(yearsReq) && yearsReq > 0) {
            goalProgress.timeToReachYears = Number(yearsReq.toFixed(1));
            goalProgress.timeToReachMonths = Math.ceil(yearsReq * 12);
          } else {
            goalProgress.isAchievable = false;
          }
        }
      } else if (fContrib > 0 && c0 > 0) {
        if (rPer === 0) {
          const periodsReq = Math.ceil((target - p0) / c0);
          const yearsReq = periodsReq / fContrib;
          goalProgress.timeToReachYears = Number(yearsReq.toFixed(1));
          goalProgress.timeToReachMonths = Math.ceil(yearsReq * 12);
        } else {
          const timingMult = timing === 'beginning' ? (1 + rPer) : 1;
          const num = target + (c0 * timingMult) / rPer;
          const den = p0 + (c0 * timingMult) / rPer;
          if (den > 0 && num / den > 0) {
            const periodsReq = Math.log(num / den) / Math.log(1 + rPer);
            const yearsReq = periodsReq / fContrib;
            if (isFinite(yearsReq) && yearsReq > 0) {
              goalProgress.timeToReachYears = Number(yearsReq.toFixed(1));
              goalProgress.timeToReachMonths = Math.ceil(yearsReq * 12);
            } else {
              goalProgress.isAchievable = false;
            }
          } else {
            goalProgress.isAchievable = false;
          }
        }
      }
    }
  }

  return {
    initialDeposit: p0,
    totalContributions: Math.round(totalContributed * 100) / 100,
    recurringContributionsTotal: Math.round(recurringContributed * 100) / 100,
    nominalInterestEarned: Math.round(nominalInterestEarned * 100) / 100,
    nominalFinalBalance: Math.round(nominalFinalBalance * 100) / 100,
    inflationAdjustedBalance: Math.round(inflationAdjustedBalance * 100) / 100,
    inflationPurchasingPowerLoss: Math.round(inflationPurchasingPowerLoss * 100) / 100,
    effectiveAnnualRate: Number((EAR * 100).toFixed(3)),
    milestones,
    chartData,
    goalProgress
  };
}

/**
 * Format Indian Rupee currency with standard Indian Numbering Format (lakhs, crores).
 */
export function formatINR(val, { decimals = 0, showSymbol = true } = {}) {
  const num = sanitizeNumber(val, 0);
  const symbol = showSymbol ? '₹' : '';
  
  if (decimals === 0) {
    return symbol + Math.round(num).toLocaleString('en-IN');
  }
  return symbol + num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
