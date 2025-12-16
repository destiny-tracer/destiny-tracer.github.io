// Main Application

const app = {
    init() {
        this.setupEventListeners();
        calculator.updateDenomDisplay('INR');
        calculator.updateDenomToAmount();
        batchCalc.addEntry();
        this.setupTabNavigation();
    },

    setupEventListeners() {
        // Currency change for tab 1
        document.getElementById('currency1').addEventListener('change', (e) => {
            calculator.selectedDenominations1[e.target.value] = DEFAULT_DENOMINATIONS[e.target.value];
            calculator.updateDenomDisplay(e.target.value);
            document.getElementById('breakdownResult').innerHTML = '';
        });

        // Currency change for tab 2
        document.getElementById('currency2').addEventListener('change', (e) => {
            calculator.denomAmounts = {};
            calculator.updateDenomToAmount();
        });

        // History button
        document.getElementById('historyBtn').addEventListener('click', () => {
            const panel = document.getElementById('historyPanel');
            panel.classList.toggle('hidden');
            if (!panel.classList.contains('hidden')) {
                renderHistory();
            }
        });
    },

    setupTabNavigation() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.dataset.tab;
                if (tabName) {
                    document.querySelectorAll('.tab-content').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    document.querySelectorAll('.tab-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    document.getElementById(tabName).classList.add('active');
                    btn.classList.add('active');
                }
            });
        });
    },

    calculateDenomination() {
        calculator.calculateDenomination();
    },

    resetDenom() {
        calculator.resetDenom();
    },

    addCustomDenom() {
        calculator.addCustomDenom();
    },

    exportCSV() {
        calculator.exportCSV();
    },

    printResult() {
        calculator.printResult();
    },

    addBatchEntry() {
        batchCalc.addEntry();
    },

    calculateBatchTotal() {
        batchCalc.calculateTotal();
    },

    calculatePercent() {
        const amount = parseFloat(document.getElementById('percentAmount').value);
        const percent = parseFloat(document.getElementById('percentValue').value);

        if (!amount || !percent) {
            alert('Please enter valid values');
            return;
        }

        const result = (amount * percent) / 100;
        const remaining = amount - result;

        const resultDiv = document.getElementById('percentResult');
        resultDiv.innerHTML = `
            <div class="batch-summary">
                <div class="batch-summary-label">${percent}% of ₹${amount}</div>
                <div class="batch-summary-value">₹ ${result.toFixed(2)}</div>
            </div>
            <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-top: 20px;">
                <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 10px;">Remaining (${100 - percent}%)</div>
                <div style="font-size: 3rem; font-weight: bold;">₹ ${remaining.toFixed(2)}</div>
            </div>
        `;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});