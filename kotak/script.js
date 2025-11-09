// Kotak rates (as provided by you)
const RATES = {
  equityIntraday: {
    perOrderBrokerage: 10,
    sttRate: 0.00025,       // 0.025% on sell
    sebiRate: 0.000001,     // 0.0001%
    txnRate: 0.0000297,     // 0.00297%
    stampRateOnBuy: 0.00003 // 0.003% on buy
  },
  equityDelivery: {
    perOrderBrokerage: 0,
    sttRate: 0.001,         // 0.1% on sell
    sebiRate: 0.000001,
    txnRate: 0.0000297,
    stampRateOnBuy: 0.00015 // 0.015%
  },
  optionIntraday: {
    perOrderBrokerage: 10,
    sttRate: 0.001,         // 0.1%
    sebiRate: 0.000001,
    txnRate: 0.0003503,     // 0.03503%
    stampRateOnBuy: 0.00003
  },
  optionDelivery: {
    perOrderBrokerage: 10,
    sttRate: 0.001,
    sebiRate: 0.000001,
    txnRate: 0.0003503,
    stampRateOnBuy: 0.00003
  }
};

const el = id => document.getElementById(id);
const fmt = v => "₹" + v.toFixed(2);

function calculate() {
  const segment = el("segment").value;
  const qty = Number(el("qty").value) || 0;
  const buyPrice = Number(el("buyPrice").value) || 0;
  const sellPrice = Number(el("sellPrice").value) || 0;

  if (qty <= 0) { alert("Enter a valid quantity."); return; }
  if (buyPrice < 0 || sellPrice < 0) { alert("Enter valid prices."); return; }

  // turnovers
  const buyTurnover = buyPrice * qty;
  const sellTurnover = sellPrice * qty;
  const totalTurnover = buyTurnover + sellTurnover;

  // gross profit (sell - buy) * qty
  const gross = (sellPrice - buyPrice) * qty;

  const rates = RATES[segment];

  // brokerage: per order (count buy and sell as separate orders if >0)
  let orders = 0;
  if (qty > 0 && buyPrice > 0) orders += 1;
  if (qty > 0 && sellPrice > 0) orders += 1;
  const brokerage = rates.perOrderBrokerage * orders;

  // GST on brokerage (18%)
  const gst = brokerage * 0.18;

  // STT on sell side only
  const stt = sellTurnover * rates.sttRate;

  // SEBI & Transaction on total turnover
  const sebi = totalTurnover * rates.sebiRate;
  const txn = totalTurnover * rates.txnRate;

  // Stamp duty on buy side only
  const stamp = buyTurnover * rates.stampRateOnBuy;

  // other charges grouped (user wants single line + breakup)
  const otherCharges = stt + sebi + txn + gst + stamp;

  const totalCharges = brokerage + otherCharges;

  const netPnl = gross - totalCharges;

  // update UI
  el("grossProfit").textContent = fmt(gross);
  el("brokerage").textContent = fmt(brokerage);
  el("otherCharges").textContent = fmt(otherCharges);

  el("stt").textContent = fmt(stt);
  el("sebi").textContent = fmt(sebi);
  el("txn").textContent = fmt(txn);
  el("gst").textContent = fmt(gst);
  el("stamp").textContent = fmt(stamp);

  el("netPnl").textContent = fmt(netPnl);

  // show card
  el("resultCard").classList.remove("hidden");

  // ensure breakup initial state hidden and toggle text set
  el("breakup").classList.add("hidden");
  el("toggleBreakup").textContent = "Show breakup";
}

function resetForm() {
  el("qty").value = 1;
  el("buyPrice").value = 100;
  el("sellPrice").value = 150;
  el("resultCard").classList.add("hidden");
}

// toggle breakup visibility
function toggleBreakup() {
  const b = el("breakup");
  const t = el("toggleBreakup");
  if (b.classList.contains("hidden")) {
    b.classList.remove("hidden");
    t.textContent = "Hide breakup";
  } else {
    b.classList.add("hidden");
    t.textContent = "Show breakup";
  }
}

// event listeners
el("calcBtn").addEventListener("click", calculate);
el("resetBtn").addEventListener("click", resetForm);
el("toggleBreakup").addEventListener("click", toggleBreakup);

// allow pressing Enter in inputs to calculate
["qty","buyPrice","sellPrice"].forEach(id => {
  el(id).addEventListener("keydown", (e) => {
    if (e.key === "Enter") calculate();
  });
});
