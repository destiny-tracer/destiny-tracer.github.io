// Home Loan EMI Calculator — client-side
(function(){
  const $ = id => document.getElementById(id);
  const formatINR = v => {
    if (typeof v !== 'number' || !isFinite(v)) return '—';
    return '₹ ' + v.toLocaleString('en-IN', {minimumFractionDigits:0, maximumFractionDigits:0});
  };

  // nodes
  const loanAmount = $('loanAmount');
  const loanAmountNumber = $('loanAmountNumber');
  const tenureYears = $('tenureYears');
  const tenureYearsNumber = $('tenureYearsNumber');
  const interestRate = $('interestRate');
  const interestRateNumber = $('interestRateNumber');

  const calcBtn = $('calc');
  const resetBtn = $('reset');

  const emiEl = $('emi');
  const principalEl = $('principal');
  const interestTotalEl = $('interestTotal');
  const totalPayableEl = $('totalPayable');
  const pie = $('pie');
  const qtyDisplay = $('qtyDisplay'); // unused, kept consistent pattern

  // sync inputs (range <-> number)
  function syncRange(rangeEl, numberEl){
    rangeEl.addEventListener('input', () => numberEl.value = rangeEl.valueAsNumber);
    numberEl.addEventListener('input', () => {
      let v = parseFloat(numberEl.value) || 0;
      // clamp
      if(rangeEl.min) v = Math.max(v, Number(rangeEl.min));
      if(rangeEl.max) v = Math.min(v, Number(rangeEl.max));
      rangeEl.value = v;
    });
  }
  syncRange(loanAmount, loanAmountNumber);
  syncRange(tenureYears, tenureYearsNumber);
  syncRange(interestRate, interestRateNumber);

  // EMI calculation
  function calcEMI(){
    const P = parseFloat(loanAmount.value) || parseFloat(loanAmountNumber.value) || 0;
    const years = parseInt(tenureYears.value) || parseInt(tenureYearsNumber.value) || 0;
    const annualRate = parseFloat(interestRate.value) || parseFloat(interestRateNumber.value) || 0;

    if(!P || !years || !annualRate){
      alert('Please enter loan amount, tenure (years) and interest rate.');
      return;
    }

    const n = years * 12;
    const r = (annualRate / 12) / 100; // monthly rate
    // EMI formula
    const factor = Math.pow(1 + r, n);
    const emi = P * r * factor / (factor - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    // update UI
    emiEl.textContent = formatINR(Math.round(emi));
    principalEl.textContent = formatINR(P);
    interestTotalEl.textContent = formatINR(Math.round(totalInterest));
    totalPayableEl.textContent = formatINR(Math.round(totalPayable));

    // pie chart: interest percentage over total
    const interestPct = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;
    const principalPct = 100 - interestPct;
    // use inline style for conic gradient percentages
    pie.style.background = `conic-gradient(var(--accent-2) 0 ${interestPct}%, var(--accent-1) ${interestPct}% 100%)`;
  }

  calcBtn.addEventListener('click', calcEMI);

  resetBtn.addEventListener('click', () => {
    // reset to defaults matching earlier examples
    loanAmount.value = loanAmountNumber.value = 1000000;
    tenureYears.value = tenureYearsNumber.value = 20;
    interestRate.value = interestRateNumber.value = 9;
    emiEl.textContent = principalEl.textContent = interestTotalEl.textContent = totalPayableEl.textContent = '—';
    pie.style.background = '';
  });

  // init defaults and calculate once
  loanAmount.value = loanAmountNumber.value = 1000000;
  tenureYears.value = tenureYearsNumber.value = 20;
  interestRate.value = interestRateNumber.value = 9;
  // calculate initial results
  calcEMI();
})();
