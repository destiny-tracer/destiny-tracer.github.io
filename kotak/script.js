document.getElementById("calculateBtn").addEventListener("click", () => {
  const segment = document.getElementById("segment").value;
  const buyTurnover = parseFloat(document.getElementById("buyTurnover").value);
  const sellTurnover = parseFloat(document.getElementById("sellTurnover").value);

  if (isNaN(buyTurnover) || isNaN(sellTurnover) || buyTurnover <= 0 || sellTurnover <= 0) {
    alert("Please enter valid buy and sell turnover amounts.");
    return;
  }

  const totalTurnover = buyTurnover + sellTurnover;

  let brokerage = 0, gst = 0, stt = 0, sebi = 0, txn = 0, stamp = 0;

  switch (segment) {
    case "equityIntraday":
      brokerage = 10;
      stt = sellTurnover * 0.00025; // STT on Sell side
      sebi = totalTurnover * 0.000001;
      txn = totalTurnover * 0.0000297;
      stamp = buyTurnover * 0.00003; // Stamp on Buy side
      gst = brokerage * 0.18;
      break;

    case "equityDelivery":
      brokerage = 0;
      stt = sellTurnover * 0.001; // STT on Sell side
      sebi = totalTurnover * 0.000001;
      txn = totalTurnover * 0.0000297;
      stamp = buyTurnover * 0.00015; // Stamp on Buy side
      gst = 0;
      break;

    case "optionIntraday":
      brokerage = 10;
      stt = sellTurnover * 0.001; // STT on Sell side
      sebi = totalTurnover * 0.000001;
      txn = totalTurnover * 0.0003503;
      stamp = buyTurnover * 0.00003;
      gst = brokerage * 0.18;
      break;

    case "optionDelivery":
      brokerage = 10;
      stt = sellTurnover * 0.001; // STT on Sell side
      sebi = totalTurnover * 0.000001;
      txn = totalTurnover * 0.0003503;
      stamp = buyTurnover * 0.00003;
      gst = brokerage * 0.18;
      break;
  }

  const total = brokerage + gst + stt + sebi + txn + stamp;

  const resultTable = document.getElementById("resultTable");
  resultTable.innerHTML = `
    <tr><td><b>Brokerage</b></td><td>₹${brokerage.toFixed(2)}</td></tr>
    <tr><td>GST (18%)</td><td>₹${gst.toFixed(2)}</td></tr>
    <tr><td>STT</td><td>₹${stt.toFixed(2)}</td></tr>
    <tr><td>SEBI Charges</td><td>₹${sebi.toFixed(2)}</td></tr>
    <tr><td>Transaction Charges</td><td>₹${txn.toFixed(2)}</td></tr>
    <tr><td>Stamp Duty</td><td>₹${stamp.toFixed(2)}</td></tr>
    <tr><td><b>Total Charges</b></td><td><b>₹${total.toFixed(2)}</b></td></tr>
  `;

  document.getElementById("result").style.display = "block";
});
