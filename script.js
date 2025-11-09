// Lightweight calculator for average price, net P/L and return %
(function(){
  const $ = id => document.getElementById(id);

  const toMoney = n => {
    const sign = n < 0 ? '-' : '';
    n = Math.abs(n);
    return sign + n.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  };

  const calculate = () => {
    const buyPrice = parseFloat($('buyPrice').value) || 0;
    const sellPriceRaw = $('sellPrice').value;
    const sellPrice = sellPriceRaw === '' ? NaN : parseFloat(sellPriceRaw);
    const qty = parseFloat($('qty').value) || 0;
    const buyBroker = parseFloat($('buyBroker').value) || 0;
    const sellBroker = parseFloat($('sellBroker').value) || 0;
    const taxes = parseFloat($('taxes').value) || 0;

    if(qty <= 0 || buyPrice <= 0){
      alert('Please enter a valid Buy price and Quantity.');
      return;
    }

    // total buy cost includes buyBroker and proportion of taxes
    const totalBuy = (buyPrice * qty) + buyBroker + taxes;
    const avgBuy = totalBuy / qty;

    // prepare display
    $('avgPrice').textContent = toMoney(avgBuy);

    // compute realized/unrealized only if sell price provided
    if(!isNaN(sellPrice)){
      const grossSell = sellPrice * qty;
      const totalSell = grossSell - sellBroker - taxes;
      const netPL = totalSell - totalBuy;
      const returnPct = (netPL / totalBuy) * 100;

      $('netPL').textContent = (netPL >= 0 ? '+' : '') + toMoney(netPL);
      $('returnPct').textContent = (returnPct >= 0 ? '+' : '') + returnPct.toFixed(2) + '%';
      $('totalBuy').textContent = toMoney(totalBuy);
      $('totalSell').textContent = toMoney(totalSell);
      $('details').classList.remove('hidden');
    } else {
      // unrealized — hide PL and show placeholders
      $('netPL').textContent = '-';
      $('returnPct').textContent = '-';
      $('totalBuy').textContent = toMoney(totalBuy);
      $('totalSell').textContent = '-';
      $('details').classList.remove('hidden');
    }
  };

  const reset = () => {
    document.getElementById('calculator').reset();
    $('avgPrice').textContent = '—';
    $('netPL').textContent = '—';
    $('returnPct').textContent = '—';
    $('totalBuy').textContent = '—';
    $('totalSell').textContent = '—';
    $('details').classList.add('hidden');
  };

  document.getElementById('calculateBtn').addEventListener('click', calculate);
  document.getElementById('resetBtn').addEventListener('click', reset);

  // Initialize state
  reset();
})();