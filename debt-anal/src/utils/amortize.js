export function amortize(balance, rate, emi) {
  if (emi <= 0) return { months: 0, totalPaid: 0, totalInterest: 0 };

  const r = rate / 100 / 12;
  let m = 0;
  let totalPaid = 0;
  let totalInterest = 0;
  let bal = balance;

  while (bal > 0.5 && m < 1000) {
    const interest = bal * r;
    const principal = Math.min(emi - interest, bal);
    if (principal <= 0) {
      return { months: 999, totalPaid: Infinity, totalInterest: Infinity };
    }
    bal -= principal;
    totalInterest += interest;
    totalPaid += interest + principal;
    m++;
  }

  return { months: m, totalPaid, totalInterest };
}

export function simulate(loans, strategy, prepayAmount, monthlyIncome) {
  let pool = loans.map((l) => ({ ...l }));
  let prepay = prepayAmount;

  if (strategy === 'snowball') {
    pool.sort((a, b) => a.balance - b.balance);
  } else {
    pool.sort((a, b) => b.rate - a.rate);
  }

  if (prepay > 0 && pool.length > 0) {
    pool[0].balance = Math.max(0, pool[0].balance - prepay);
  }

  const timeline = [];
  const maxMonths = 240;
  const active = pool.map((l) => ({ ...l }));
  let month = 0;

  for (month = 1; month <= maxMonths; month++) {
    const outstanding = active.filter((a) => a.balance > 0);
    if (outstanding.length === 0) break;

    for (const loan of outstanding) {
      const r = loan.rate / 100 / 12;
      const interest = loan.balance * r;
      const principal = Math.min(Math.max(loan.emi - interest, 0), loan.balance);
      loan.balance = Math.max(0, loan.balance - principal);
    }

    const cleared = active.filter((a) => a.balance <= 0 && !a._notedClear);
    for (const c of cleared) {
      c._notedClear = true;
      const targets = active.filter((a) => a.balance > 0 && a.id !== c.id);
      if (targets.length > 0) {
        targets[0].emi += c.emi;
      }
    }

    if (month <= 24) {
      timeline.push({
        month,
        totalOutstanding: active.reduce((s, a) => s + a.balance, 0),
        totalEmi: active.reduce((s, a) => s + a.emi, 0),
      });
    }
  }

  const monthsToClear = month <= maxMonths ? month : Infinity;
  const totalOutstandingNow = active.reduce((s, a) => s + a.balance, 0);
  const totalEmiNow = active.reduce((s, a) => s + a.emi, 0);
  const dtiBefore = loans.reduce((s, l) => s + l.emi, 0) / (monthlyIncome || 1);
  const dtiAfter = totalEmiNow / (monthlyIncome || 1);

  const insights = [];
  insights.push(`<b>Strategy:</b> ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}`);
  insights.push(`<b>Applied prepayment:</b> ₹${prepay.toLocaleString('en-IN')}`);
  insights.push(`<b>Estimated months to clear (sim):</b> ${isFinite(monthsToClear) ? `${monthsToClear} months` : '>240 months'}`);
  insights.push(`<b>DTI before:</b> ${(dtiBefore * 100).toFixed(1)}% • <b>after:</b> ${(dtiAfter * 100).toFixed(1)}%`);

  if (dtiAfter > 0.6) {
    insights.push('<b>Suggestion:</b> Consider consolidation or larger prepayment to high-rate accounts.');
  } else if (dtiAfter > 0.4) {
    insights.push('<b>Suggestion:</b> Target highest EMI loans for prepayment — aim to free one EMI within 3 months.');
  } else {
    insights.push('<b>Suggestion:</b> Good progress — maintain emergency reserve of at least 3 months of EMI.');
  }

  return {
    timeline,
    insights,
    updatedLoans: active,
  };
}
