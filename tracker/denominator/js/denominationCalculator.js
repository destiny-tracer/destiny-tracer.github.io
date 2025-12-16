// Denomination Calculator Functions

class DenominationCalculator {
    constructor() {
        this.selectedDenominations1 = { ...DEFAULT_DENOMINATIONS };
        this.selectedDenominations2 = { ...DEFAULT_DENOMINATIONS };
        this.denomAmounts = {};
        this.batchEntries = [{ id: 1, amount: '' }];
        this.batchTotal = 0;
    }

    calculateDenomination() {
        const totalAmount = parseInt(document.getElementById('totalAmount').value);
        const currency = document.getElementById('currency1').value;

        if (!totalAmount || isNaN(totalAmount)) {
            alert('Please enter a valid amount');
            return;
        }

        const denoms = this.selectedDenominations1[currency];
        if (denoms.length === 0) {
            alert('Please select at least one denomination');
            return;
        }

        let amount = totalAmount;
        const breakdown = {};
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

        this.renderBreakdown(breakdown, totalAmount, currency);

        saveToHistory({
            currency,
            amount: totalAmount,
            denominations: denoms,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    renderBreakdown(breakdown, totalAmount, currency) {
        const result = document.getElementById('breakdownResult');
        let html = '';

        Object.entries(breakdown).forEach(([denom, count]) => {
            if (denom === 'remainder') {
                html += `
                    <div class="breakdown-item remainder">
                        <div class="breakdown-info">
                            <div class="breakdown-label">Cannot be divided</div>
                        </div>
                        <div class="breakdown-count">${count}</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="breakdown-item">
                        <div class="breakdown-info">
                            <div class="breakdown-label">${currency} ${denom}</div>
                            <div class="breakdown-detail">× ${denom} = ${count * denom}</div>
                        </div>
                        <div class="breakdown-count">${count}</div>
                    </div>
                `;
            }
        });

        html += `
            <div class="total-line">
                <div>Total Amount:</div>
                <div>${formatCurrency(totalAmount, currency)}</div>
            </div>
            <div class="export-buttons">
                <button class="btn-export btn-export-csv" onclick="app.exportCSV()">📥 Export CSV</button>
                <button class="btn-export btn-export-print" onclick="app.printResult()">🖨️ Print</button>
            </div>
        `;

        result.innerHTML = html;
    }

    addCustomDenom() {
        const customDenom = document.getElementById('customDenom');
        const value = parseInt(customDenom.value);
        const currency = document.getElementById('currency1').value;

        if (value > 0 && !this.selectedDenominations1[currency].includes(value)) {
            this.selectedDenominations1[currency] = [...this.selectedDenominations1[currency], value]
                .sort((a, b) => b - a);
            customDenom.value = '';
            this.updateDenomDisplay(currency);
        }
    }

    removeDenom(denom, currency) {
        this.selectedDenominations1[currency] = this.selectedDenominations1[currency].filter(d => d !== denom);
        this.updateDenomDisplay(currency);
    }

    updateDenomDisplay(currency) {
        createCheckboxGroup(currency, this.selectedDenominations1[currency], 'denomCheckboxes', (denom, checked) => {
            if (checked) {
                this.selectedDenominations1[currency].push(denom);
            } else {
                this.selectedDenominations1[currency] = this.selectedDenominations1[currency].filter(d => d !== denom);
            }
            this.updateDenomDisplay(currency);
        });

        renderTags(this.selectedDenominations1[currency], 'selectedTags', (denom) => {
            this.removeDenom(denom, currency);
        });

        document.getElementById('selectedCount').textContent = this.selectedDenominations1[currency].length;
    }

    resetDenom() {
        document.getElementById('totalAmount').value = '';
        document.getElementById('breakdownResult').innerHTML = '';
        document.getElementById('customDenom').value = '';
    }

    exportCSV() {
        const totalAmount = document.getElementById('totalAmount').value;
        const currency = document.getElementById('currency1').value;

        if (!totalAmount) {
            alert('No data to export');
            return;
        }

        let csv = 'Denomination,Count,Total Value\n';

        const items = document.querySelectorAll('.breakdown-item:not(.remainder)');
        items.forEach(item => {
            const label = item.querySelector('.breakdown-label').textContent;
            const count = item.querySelector('.breakdown-count').textContent;
            const denom = parseInt(label.split(' ')[1]);
            csv += `${label},${count},${denom * count}\n`;
        });

        csv += `\nTotal Amount,${totalAmount}\n`;

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `denomination_${Date.now()}.csv`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    printResult() {
        const printWindow = window.open('', '', 'height=600,width=800');
        const content = document.getElementById('breakdownResult').innerHTML;
        printWindow.document.write('<h2>Denomination Breakdown Report</h2>' + content);
        printWindow.document.close();
        printWindow.print();
    }

    calculateTotal() {
        let total = 0;
        Object.entries(this.denomAmounts).forEach(([denom, count]) => {
            total += parseInt(denom) * (parseInt(count) || 0);
        });
        return total;
    }

    updateDenomToAmount() {
        const currency = document.getElementById('currency2').value;
        const denoms = this.selectedDenominations2[currency];
        const countInputs = document.getElementById('countInputs');

        countInputs.innerHTML = denoms.map(denom => `
            <div class="breakdown-item">
                <label style="margin: 0; font-weight: 600; flex: 1;">${currency} ${denom}</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="number" min="0" value="${this.denomAmounts[denom] || ''}" 
                        onchange="calculator.denomAmounts[${denom}] = this.value; calculator.updateTotal();"
                        style="width: 80px; padding: 8px; border: 2px solid #e0e0e0; border-radius: 6px;">
                    <span style="width: 100px; text-align: right; font-weight: bold; color: #667eea;">
                        = ${(this.denomAmounts[denom] || 0) * denom}
                    </span>
                </div>
            </div>
        `).join('');

        this.updateTotal();
    }

    updateTotal() {
        const total = this.calculateTotal();
        const display = document.getElementById('totalDisplay');
        const value = document.getElementById('totalValue');

        if (total > 0) {
            display.classList.remove('hidden');
            value.textContent = formatCurrency(total);
        } else {
            display.classList.add('hidden');
        }
    }
}

const calculator = new DenominationCalculator();