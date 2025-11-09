// Kotak Brokerage Calculator — updated to use supplied rates and product/mode mapping
(function(){
  const $ = id => document.getElementById(id);
  const format = v => (typeof v !== 'number' || !isFinite(v)) ? '—' : '₹ ' + v.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

  // lot defaults (editable)
  const lotMap = {
    'SENSEX': 50,
    'NIFTY': 50,
    'BANKNIFTY': 15,
    'NIFTY_NXT50': 25,
    'NIFTY_MIDCAP': 50,
    'OTHER': 1
  };

  // rates mapping based on product + mode (user-supplied values)
  // Values are decimals (e.g., 0.001 = 0.1%)
  const rates = {
    equity: {
      intraday: {
        brokeragePerOrder: 10.0,
        stt: 0.00025,     // 0.025%
        sebi: 0.000001,   // 0.0001%
        txn: 0.0000297,   // 0.00297%
        gst: 0.18,
        stamp: 0.00003    // 0.003%
      },
      delivery: {
        brokeragePerOrder: 0.0,
        stt: 0.001,       // 0.1%
        sebi: 0.000001,
        txn: 0.0000297,
        gst: 0.18,
        stamp: 0.00015    // 0.015%
      }
    },
    option: {
      intraday: {
        brokeragePerOrder: 10.0,
        stt: 0.001,       // 0.1%
        sebi: 0.000001,
        txn: 0.0003503,   // 0.03503%
        gst: 0.18,
        stamp: 0.00003
      },
      delivery: {
        brokeragePerOrder: 10.0,
        stt: 0.001,
        sebi: 0.000001,
        txn: 0.0003503,
        gst: 0.18,
        stamp: 0.00003
      }
    }
  };

  // nodes
  const product = $('product');
  const instrument = $('instrument');
  const modeButtons = document.querySelectorAll('.seg-btn');

  const lot = $('lot');
  const lotSize = $('lotSize');
  const buyPrice = $('buyPrice');
  const sellPrice = $('sellPrice');

  const sttRate = $('sttRate');
  const sebiRate = $('sebiRate');
  const txnRate = $('txnRate');
  const gstRate = $('gstRate');
  const stampRate = $('stampRate');

  const planRadios = () => document.querySelectorAll('input[name="plan"]');

  const calculateBtn = $('calculate');
  const resetBtn = $('reset');
  const toggleBreakup = $('toggleBreakup');

  const qtyDisplay = $('qtyDisplay');
  const grossProfitEl = $('grossProfit');
  const brokerageEl = $('brokerage');
  const otherChargesTotalEl = $('otherChargesTotal');
  const netPnlEl = $('netPnl');

  const sttVal = $('sttVal');
  const sebiVal = $('sebiVal');
  const txnVal = $('txnVal');
  const gstVal = $('gstVal');
  const stampVal = $('stampVal');
  const breakup = $('breakup');

  // helper to get current mode (intraday/delivery)
  function currentMode(){
    const active = Array.from(modeButtons).find(b => b.classList.contains('active'));
    return active ? active.dataset.mode : 'delivery';
  }

  // when product or mode changes, update the rates inputs to the defaults
  function applyDefaultRates(){
    const p = product.value; // equity | option
    const m = currentMode(); // intraday | delivery
    const def = (rates[p] && rates[p][m]) ? rates[p][m] : null;
    if(def){
      sttRate.value = def.stt;
      sebiRate.value = def.sebi;
      txnRate.value = def.txn;
      gstRate.value = def.gst;
      stampRate.value = def.stamp;
      // set plan brokerage defaults visible in DOM if you want; plans are flat per order (UI cost spans)
      // For equity delivery where brokeragePerOrder = 0, we don't auto-change plan-cost spans here.
    }
  }

  // update lot size when instrument changes
  instrument.addEventListener('change', () => {
    const key = instrument.value;
    if(lotMap[key] !== undefined) {
      lotSize.value = lotMap[key];
      updateQtyDisplay();
    }
  });

  // update qty display
  function updateQtyDisplay(){
    const lots = parseInt(lot.value) || 0;
    const size = parseInt(lotSize.value) || 1;
    const total = lots * size;
    qtyDisplay.textContent = total ? total.toLocaleString('en-IN') : '—';
    return total;
  }
  lot.addEventListener('input', updateQtyDisplay);
  lotSize.addEventListener('input', updateQtyDisplay);

  // get plan per-order brokerage from DOM
  function getSelectedBrokeragePerOrder(){
    const radios = planRadios();
    const selected = Array.from(radios).find(r => r.checked);
    if(selected){
      const planLabel = selected.parentElement;
      const costSpan = planLabel.querySelector('.plan-cost');
      if(costSpan) return parseFloat(costSpan.textContent) || 0;
    }
    return 0;
  }

  // main calculate
  function calculate(){
    const lots = parseInt(lot.value) || 0;
    const size = parseInt(lotSize.value) || 1;
    const qty = lots * size;
    const bp = parseFloat(buyPrice.value);
    const sp = parseFloat(sellPrice.value);

    if(!qty || !isFinite(bp) || !isFinite(sp)){
      alert('Please enter Lot, Lot size, Buy price and Sell price.');
      return;
    }

    // auto-apply defaults to rates so they reflect chosen product/mode (but user can still edit)
    applyDefaultRates();

    // read rates from inputs (user-editable)
    const stt = parseFloat(sttRate.value) || 0;
    const sebi = parseFloat(sebiRate.value) || 0;
    const txn = parseFloat(txnRate.value) || 0;
    const gst = parseFloat(gstRate.value) || 0;
    const stamp = parseFloat(stampRate.value) || 0;

    // compute amounts
    const grossBuy = bp * qty;
    const grossSell = sp * qty;
    const turnover = grossBuy + grossSell;
    const grossProfit = (sp - bp) * qty;

    // brokerage per order from selected plan (flat)
    const brokeragePerOrder = getSelectedBrokeragePerOrder();

    // for some modes the brokerage might be zero (eg delivery), but user controls plan pricing
    const brokerageTotal = brokeragePerOrder * 2;

    // STT applies on sell side (simple model)
    const sttNum = grossSell * stt;

    const sebiNum = turnover * sebi;
    const txnNum = turnover * txn;
    const stampNum = turnover * stamp;

    // GST applied on (brokerage + txn) — simplified model as discussed
    const gstNum = (brokerageTotal + txnNum) * gst;

    const otherTotal = sttNum + sebiNum + txnNum + gstNum + stampNum;

    const netPnl = grossProfit - brokerageTotal - otherTotal;

    // write UI
    qtyDisplay.textContent = qty.toLocaleString('en-IN');
    grossProfitEl.textContent = format(grossProfit);

    brokerageEl.textContent = (brokerageTotal > 0 ? '- ' : '') + format(brokerageTotal);
    otherChargesTotalEl.textContent = (otherTotal > 0 ? '- ' : '') + format(otherTotal);
    netPnlEl.textContent = (netPnl >= 0 ? '+ ' : '- ') + format(Math.abs(netPnl));

    // breakup
    sttVal.textContent = format(sttNum);
    sebiVal.textContent = format(sebiNum);
    txnVal.textContent = format(txnNum);
    gstVal.textContent = format(gstNum);
    stampVal.textContent = format(stampNum);

    // ensure details remain collapsed by default (user toggles)
    if(!breakup.classList.contains('hidden')) {
      // keep as user toggled
    }
  }

  // toggle breakdown
  toggleBreakup.addEventListener('click', () => {
    breakup.classList.toggle('hidden');
    toggleBreakup.textContent = breakup.classList.contains('hidden') ? 'Show breakup ▾' : 'Hide breakup ▴';
  });

  calculateBtn.addEventListener('click', calculate);

  resetBtn.addEventListener('click', () => {
    $('kotakForm').reset();
    // restore defaults
    instrument.value = 'NIFTY';
    lot.value = 1;
    lotSize.value = lotMap['NIFTY'];
    qtyDisplay.textContent = '—';
    grossProfitEl.textContent = '—';
    brokerageEl.textContent = '—';
    otherChargesTotalEl.textContent = '—';
    netPnlEl.textContent = '—';
    sttVal.textContent = '—';
    sebiVal.textContent = '—';
    txnVal.textContent = '—';
    gstVal.textContent = '—';
    stampVal.textContent = '—';
    applyDefaultRates();
  });

  // segment buttons toggle
  modeButtons.forEach(b => b.addEventListener('click', () => {
    modeButtons.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    applyDefaultRates();
  }));

  // initial state
  product.value = 'equity';
  instrument.value = 'NIFTY';
  lotSize.value = lotMap['NIFTY'];
  applyDefaultRates();
  updateQtyDisplay();
})();
