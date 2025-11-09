// SavgCalc — Lightweight average price + return calculator
(function(){
  const $ = id => document.getElementById(id);

  function fmt(n){
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

    // Determine total shares and total buy cost
    const shares1 = qty;
    const shares2 = (isNaN(addPrice) || addQty <= 0) ? 0 : addQty;
    const totalShares = shares1 + shares2;

    const cost1 = buyPrice * shares1;
    const cost2 = (!isNaN(addPrice) && shares2 > 0) ? addPrice * shares2 : 0;

    // total buy includes buyBroker and taxes as provided (simple model)
    const totalBuy = cost1 + cost2 + buyBroker + taxes;
    const avgBuy = totalBuy / totalShares;

    $('avgPrice').textContent = fmt(avgBuy);
    $('totalBuy').textContent = fmt(totalBuy);

    if (!isNaN(sellPrice) && sellPrice > 0){
      const grossSell = sellPrice * totalShares;
      const totalSell = grossSell - sellBroker - taxes;
      const netPL = totalSell - totalBuy;
      const returnPct = (netPL / totalBuy) * 100;

      $('netPL').textContent = (netPL >= 0 ? '+' : '') + fmt(netPL);
      $('returnPct').textContent = (returnPct >= 0 ? '+' : '') + (isFinite(returnPct) ? returnPct.toFixed(2) + '%' : '—');
      $('totalSell').textContent = fmt(totalSell);
    } else {
      $('netPL').textContent = '—';
      $('returnPct').textContent = '—';
      $('totalSell').textContent = '—';
    }

    // reveal details block
    const details = $('detailBlock');
    if(details && details.hasAttribute('open') === false){
      // keep as user toggled; do not auto-open to avoid focus surprises
    }
  }

  function reset(){
    $('calcForm').reset();
    $('avgPrice').textContent = '—';
    $('netPL').textContent = '—';
    $('returnPct').textContent = '—';
    $('totalBuy').textContent = '—';
    $('totalSell').textContent = '—';
  }

  document.getElementById('calculateBtn').addEventListener('click', calculate);
  document.getElementById('resetBtn').addEventListener('click', reset);

  // init
  reset();
})();
