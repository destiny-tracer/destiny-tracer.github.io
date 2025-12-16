import React, { useState, useRef } from 'react';
import { Calculator, Trash2, Download, RotateCcw, Plus, X, TrendingUp, History } from 'lucide-react';

export default function EnhancedConverters() {
  const [activeTab, setActiveTab] = useState('denomination');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // ===== DENOMINATION CALCULATOR =====
  const [totalAmount, setTotalAmount] = useState('');
  const [denominationBreakdown, setDenominationBreakdown] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [selectedDenominations, setSelectedDenominations] = useState({
    INR: [500, 200, 100, 50, 1],
    USD: [100, 50, 20, 10, 1],
    EUR: [500, 200, 100, 50, 20, 10, 5, 1]
  });
  const [customDenominations, setCustomDenominations] = useState({
    INR: false,
    USD: false,
    EUR: false
  });
  const [denomInput, setDenomInput] = useState('');

  const allDenominationOptions = {
    INR: [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1],
    USD: [100, 50, 20, 10, 5, 2, 1],
    EUR: [500, 200, 100, 50, 20, 10, 5, 2, 1]
  };

  const toggleDenomination = (currency, denom) => {
    const current = selectedDenominations[currency] || [];
    const updated = current.includes(denom)
      ? current.filter(d => d !== denom)
      : [...current, denom].sort((a, b) => b - a);

    setSelectedDenominations({
      ...selectedDenominations,
      [currency]: updated
    });
  };

  const addCustomDenomination = () => {
    const value = parseInt(denomInput);
    if (value > 0 && !selectedDenominations[selectedCurrency].includes(value)) {
      const updated = [...selectedDenominations[selectedCurrency], value].sort((a, b) => b - a);
      setSelectedDenominations({
        ...selectedDenominations,
        [selectedCurrency]: updated
      });
      setDenomInput('');
    }
  };

  const removeCustomDenomination = (denom) => {
    const updated = selectedDenominations[selectedCurrency].filter(d => d !== denom);
    setSelectedDenominations({
      ...selectedDenominations,
      [selectedCurrency]: updated
    });
  };

  const calculateDenomination = () => {
    if (!totalAmount || isNaN(totalAmount)) return;

    let amount = parseInt(totalAmount);
    const breakdown = {};
    const denoms = selectedDenominations[selectedCurrency] || [];

    if (denoms.length === 0) {
      alert('Please select at least one denomination');
      return;
    }

    const sortedDenoms = [...denoms].sort((a, b) => b - a);

    for (let denom of sortedDenoms) {
      if (amount >= denom) {
        breakdown[denom] = Math.floor(amount / denom);
        amount %= denom;
      }
    }

    if (amount > 0) {
      breakdown['remainder'] = amount;
    }

    setDenominationBreakdown(breakdown);

    // Add to history
    const entry = {
      id: Date.now(),
      type: 'denomination',
      currency: selectedCurrency,
      amount: totalAmount,
      denominations: denoms,
      result: breakdown,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory([entry, ...history.slice(0, 9)]);
  };

  // ===== DENOMINATION TO AMOUNT =====
  const [denomAmounts, setDenomAmounts] = useState({});
  const [selectedCurrency2, setSelectedCurrency2] = useState('INR');
  const [selectedDenominations2, setSelectedDenominations2] = useState({
    INR: [500, 200, 100, 50, 1],
    USD: [100, 50, 20, 10, 1],
    EUR: [500, 200, 100, 50, 20, 10, 5, 1]
  });

  const toggleDenomination2 = (currency, denom) => {
    const current = selectedDenominations2[currency] || [];
    const updated = current.includes(denom)
      ? current.filter(d => d !== denom)
      : [...current, denom].sort((a, b) => b - a);

    setSelectedDenominations2({
      ...selectedDenominations2,
      [currency]: updated
    });
  };

  const updateDenomAmount = (denom, value) => {
    const newAmounts = { ...denomAmounts };
    if (value === '' || value === '0') {
      delete newAmounts[denom];
    } else {
      newAmounts[denom] = parseInt(value) || 0;
    }
    setDenomAmounts(newAmounts);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(denomAmounts).forEach(([denom, count]) => {
      total += parseInt(denom) * count;
    });
    return total;
  };

  // ===== BATCH CALCULATOR =====
  const [batchEntries, setBatchEntries] = useState([{ id: 1, amount: '' }]);
  const [batchTotal, setBatchTotal] = useState(0);

  const addBatchEntry = () => {
    setBatchEntries([...batchEntries, { id: Date.now(), amount: '' }]);
  };

  const updateBatchEntry = (id, value) => {
    setBatchEntries(batchEntries.map(e =>
      e.id === id ? { ...e, amount: value } : e
    ));
  };

  const removeBatchEntry = (id) => {
    setBatchEntries(batchEntries.filter(e => e.id !== id));
  };

  const calculateBatchTotal = () => {
    const total = batchEntries.reduce((sum, e) =>
      sum + (parseInt(e.amount) || 0), 0
    );
    setBatchTotal(total);
    return total;
  };

  // ===== PERCENTAGE CALCULATOR =====
  const [percentAmount, setPercentAmount] = useState('');
  const [percentValue, setPercentValue] = useState('');
  const [percentResult, setPercentResult] = useState(null);

  const calculatePercent = () => {
    if (!percentAmount || !percentValue) return;
    const amount = parseFloat(percentAmount);
    const percent = parseFloat(percentValue);
    const result = (amount * percent) / 100;
    setPercentResult({
      percentage: percent,
      of: amount,
      result: result,
      remaining: amount - result
    });
  };

  // ===== EXPORT FUNCTIONS =====
  const exportAsCSV = () => {
    if (Object.keys(denominationBreakdown).length === 0) {
      alert('No data to export');
      return;
    }

    let csv = 'Denomination,Count,Total Value\n';
    Object.entries(denominationBreakdown).forEach(([denom, count]) => {
      if (denom !== 'remainder') {
        csv += `${selectedCurrency} ${denom},${count},${count * denom}\n`;
      }
    });
    csv += `\nTotal Amount,${totalAmount}\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `denomination_${Date.now()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printResult = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    let html = '<h2>Denomination Breakdown Report</h2>';
    html += `<p><strong>Total Amount:</strong> ${selectedCurrency} ${totalAmount}</p>`;
    html += '<table border="1" cellpadding="10"><tr><th>Denomination</th><th>Count</th><th>Total Value</th></tr>';

    Object.entries(denominationBreakdown).forEach(([denom, count]) => {
      if (denom !== 'remainder') {
        html += `<tr><td>${selectedCurrency} ${denom}</td><td>${count}</td><td>${count * denom}</td></tr>`;
      }
    });

    if (denominationBreakdown.remainder) {
      html += `<tr><td>Cannot be divided</td><td>-</td><td>${denominationBreakdown.remainder}</td></tr>`;
    }
    html += '</table>';

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setDenominationBreakdown({});
    setTotalAmount('');
  };

  const resetAll = () => {
    setTotalAmount('');
    setDenominationBreakdown({});
    setDenomInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Enhanced Denomination Converter</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">100% Browser-based • No Data Storage • Export & Print Options</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 md:gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('denomination')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${activeTab === 'denomination'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            💵 Amount to Denominations
          </button>
          <button
            onClick={() => setActiveTab('total')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${activeTab === 'total'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            🧮 Denominations to Amount
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${activeTab === 'batch'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            📦 Batch Totals
          </button>
          <button
            onClick={() => setActiveTab('percent')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base ${activeTab === 'percent'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            📈 Percentage Calc
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition text-sm md:text-base bg-purple-600 text-white hover:bg-purple-700"
          >
            <History className="w-4 h-4 inline mr-2" />
            History
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📜 Calculation History</h3>
            {history.length === 0 ? (
              <p className="text-gray-500">No history yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map(entry => (
                  <div key={entry.id} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-600 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">{entry.currency} {entry.amount}</span>
                      <span className="text-gray-600">{entry.timestamp}</span>
                    </div>
                    <div className="text-gray-600 mt-1">
                      Denominations: {entry.denominations.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB 1: AMOUNT TO DENOMINATIONS ===== */}
        {activeTab === 'denomination' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💵 Amount to Denominations</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none"
                  >
                    <option value="INR">INR (Indian Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Denominations</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    {allDenominationOptions[selectedCurrency].map(denom => (
                      <label key={denom} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDenominations[selectedCurrency]?.includes(denom) || false}
                          onChange={() => toggleDenomination(selectedCurrency, denom)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="font-semibold text-gray-700 text-sm">{selectedCurrency} {denom}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Add Custom Denomination</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={denomInput}
                      onChange={(e) => setDenomInput(e.target.value)}
                      placeholder="e.g., 250"
                      className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none text-sm"
                    />
                    <button
                      onClick={addCustomDenomination}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {selectedDenominations[selectedCurrency].length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDenominations[selectedCurrency].map(denom => (
                      <span key={denom} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {denom}
                        <button
                          onClick={() => removeCustomDenomination(denom)}
                          className="hover:text-indigo-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="e.g., 487881"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none text-lg"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={calculateDenomination}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={resetAll}
                    className="px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Denomination Breakdown</h3>
              {Object.keys(denominationBreakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(denominationBreakdown).map(([denom, count]) => (
                    <div key={denom} className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-l-4 border-indigo-600">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm md:text-base">
                          {denom === 'remainder' ? 'Cannot be divided' : `${selectedCurrency} ${denom}`}
                        </div>
                        {denom !== 'remainder' && (
                          <div className="text-xs md:text-sm text-gray-600">× {denom} = {count * denom}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl md:text-3xl font-bold ${denom === 'remainder' ? 'text-orange-600' : 'text-indigo-600'}`}>
                          {count}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-8 pt-4 border-t-2 border-gray-300 flex justify-between items-center">
                    <div className="font-bold text-gray-800">Total Amount:</div>
                    <div className="text-2xl md:text-3xl font-bold text-indigo-600">{selectedCurrency} {totalAmount}</div>
                  </div>

                  <div className="flex gap-2 mt-6 flex-wrap">
                    <button
                      onClick={exportAsCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                    <button
                      onClick={printResult}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      🖨️ Print
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg">Enter an amount to see breakdown</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== TAB 2: DENOMINATIONS TO TOTAL ===== */}
        {activeTab === 'total' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧮 Denominations to Amount</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select
                    value={selectedCurrency2}
                    onChange={(e) => setSelectedCurrency2(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none"
                  >
                    <option value="INR">INR (Indian Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Denominations</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    {allDenominationOptions[selectedCurrency2].map(denom => (
                      <label key={denom} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDenominations2[selectedCurrency2]?.includes(denom) || false}
                          onChange={() => toggleDenomination2(selectedCurrency2, denom)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="font-semibold text-gray-700 text-sm">{selectedCurrency2} {denom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Enter Count for Each Denomination</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(selectedDenominations2[selectedCurrency2] || []).sort((a, b) => b - a).map(denom => (
                  <div key={denom} className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-l-4 border-indigo-600">
                    <label className="flex-1 text-sm font-bold text-gray-700">
                      {selectedCurrency2} {denom}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={denomAmounts[denom] || ''}
                        onChange={(e) => updateDenomAmount(denom, e.target.value)}
                        placeholder="0"
                        className="w-20 p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none text-right"
                      />
                      <span className="text-right text-sm font-semibold text-indigo-600 w-24">
                        = {(denomAmounts[denom] || 0) * denom}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {(selectedDenominations2[selectedCurrency2] || []).length > 0 && (
                <div className="mt-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg p-8 text-center">
                  <div className="text-gray-200 text-sm mb-2">Total Amount</div>
                  <div className="text-5xl font-bold text-white">
                    {selectedCurrency2} {calculateTotal()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== TAB 3: BATCH TOTALS ===== */}
        {activeTab === 'batch' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Batch Totals</h2>
              <p className="text-gray-600 mb-6 text-sm">Add multiple amounts and get total</p>

              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {batchEntries.map((entry, idx) => (
                  <div key={entry.id} className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-200 rounded-lg text-sm font-bold text-gray-700">#{idx + 1}</span>
                    <input
                      type="number"
                      value={entry.amount}
                      onChange={(e) => updateBatchEntry(entry.id, e.target.value)}
                      placeholder="Enter amount"
                      className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none"
                    />
                    {batchEntries.length > 1 && (
                      <button
                        onClick={() => removeBatchEntry(entry.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addBatchEntry}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
                <button
                  onClick={calculateBatchTotal}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
                >
                  Calculate
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Total Summary</h3>
              {batchTotal > 0 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 text-center border-l-4 border-green-600">
                    <div className="text-gray-600 text-sm mb-2">Grand Total</div>
                    <div className="text-5xl font-bold text-green-600">
                      ₹ {batchTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Breakdown:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Entries:</span>
                        <span className="font-bold">{batchEntries.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span className="font-bold">₹ {(batchTotal / batchEntries.length).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {batchTotal === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <p>Add amounts and click Calculate</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== TAB 4: PERCENTAGE CALCULATOR ===== */}
        {activeTab === 'percent' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Percentage Calculator</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={percentAmount}
                    onChange={(e) => setPercentAmount(e.target.value)}
                    placeholder="e.g., 1000"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Percentage (%)</label>
                  <input
                    type="number"
                    value={percentValue}
                    onChange={(e) => setPercentValue(e.target.value)}
                    placeholder="e.g., 18"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 outline-none text-lg"
                  />
                </div>

                <button
                  onClick={calculatePercent}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                  Calculate
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">💰 Result</h3>
              {percentResult ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600">
                    <div className="text-gray-600 text-sm mb-2">{percentResult.percentage}% of ₹{percentResult.of}</div>
                    <div className="text-4xl font-bold text-blue-600">
                      ₹ {percentResult.result.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border-l-4 border-orange-600">
                    <div className="text-gray-600 text-sm mb-2">Remaining ({100 - percentResult.percentage}%)</div>
                    <div className="text-3xl font-bold text-orange-600">
                      ₹ {percentResult.remaining.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <p>Enter amount and percentage to calculate</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}