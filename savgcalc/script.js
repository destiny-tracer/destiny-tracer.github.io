// SavgCalc — Lightweight average price + return calculator
(function(){
  const $ = id => document.getElementById(id);

  function fmtNumber(n){
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    const sign = n < 0 ? '-' : '';
    n = Math.abs(n);
    return sign + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  }

  function calculate(){
    const buyPrice = parseFloat($('buyPrice').value) || 0;
    const qty = parseFloat($('qty').value) || 0;
    const addPriceRaw = $('addPrice').value;
    const addPrice = addPriceRaw === '' ? NaN : parseFloat(addPriceRaw);
    const addQty = parseFloat($('addQty').value) || 0;
    const buyBroker = parseFloat($('buyBroker').value) || 0;
    const sellBroker = parseFloat($('sellBroker').value) || 0;
    const taxes = parseFloat($('taxes').value) || 0;
    const sellPriceRaw = $('sellPrice').value;
    const sellPrice = sellPriceRaw === '' ? NaN : parseFloat(sellPriceRaw);

    if (qty <= 0 || buyPrice <= 0){
      alert('Please enter a valid buy price and quantity.');
      return;
    }

    // Compute per-purchase invested amounts (exclude fees)
    const cost1 = buyPrice * qty;
    const cost2 = (!isNaN(addPrice) && addQty > 0) ? addPrice * addQty : 0;

    const totalUnits = qty + addQty;
    const totalAmount = cost1 + cost2; // overall invested amount (shares only)

    // Average price based on shares only (matches the reference screenshot)
    const averagePrice = totalAmount / (totalUnits || 1);

    // totalBuy includes provided buyBroker and taxes (simple model)
    const totalBuyWithFees = totalAmount + buyBroker + taxes;
    const avgBuyWithFees = totalBuyWithFees / (totalUnits || 1);

    // Update visible elements
    $('invested1').textContent = fmtNumber(cost1);
    $('invested2').textContent = (cost2 > 0) ? fmtNumber(cost2) : '—';
    $('totalUnits').textContent = totalUnits || '—';
    $('avgPrice').textContent = fmtNumber(averagePrice);
    $('overallAmount').textContent = fmtNumber(totalAmount);

    $('avgBuyWithFees').textContent = fmtNumber(avgBuyWithFees);
    $('totalBuy').textContent = fmtNumber(totalBuyWithFees);

    if (!isNaN(sellPrice) && sellPrice > 0){
      const grossSell = sellPrice * totalUnits;
      const totalSell = grossSell - sellBroker - taxes;
      const netPL = totalSell - totalBuyWithFees;
      const returnPct = (netPL / totalBuyWithFees) * 100;

      $('netPL').textContent = (netPL >= 0 ? '+' : '') + fmtNumber(netPL);
      $('returnPct').textContent = (returnPct >= 0 ? '+' : '') + (isFinite(returnPct) ? returnPct.toFixed(2) + '%' : '—');
      $('totalSell').textContent = fmtNumber(totalSell);
    } else {
      $('netPL').textContent = '—';
      $('returnPct').textContent = '—';
      $('totalSell').textContent = '—';
    }
  }

  function reset(){
    $('calcForm').reset();
    $('invested1').textContent = '—';
    $('invested2').textContent = '—';
    $('totalUnits').textContent = '—';
    $('avgPrice').textContent = '—';
    $('overallAmount').textContent = '—';
    $('avgBuyWithFees').textContent = '—';
    $('totalBuy').textContent = '—';
    $('netPL').textContent = '—';
    $('returnPct').textContent = '—';
    $('totalSell').textContent = '—';
  }

  document.getElementById('calculateBtn').addEventListener('click', calculate);
  document.getElementById('resetBtn').addEventListener('click', reset);

  // init
  reset();
})();
