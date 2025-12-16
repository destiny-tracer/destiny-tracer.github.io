// Batch Calculator

class BatchCalculator {
    addEntry() {
        const batchEntries = document.getElementById('batchEntries');
        const id = Date.now();
        const entryCount = batchEntries.children.length + 1;

        const entry = document.createElement('div');
        entry.className = 'batch-entry';
        entry.id = `batch-${id}`;
        entry.innerHTML = `
            <div class="batch-number">#${entryCount}</div>
            <input type="number" placeholder="Enter amount" data-id="${id}">
            ${entryCount > 1 ? `<button class="batch-delete" onclick="batchCalc.removeEntry(${id})">🗑️</button>` : ''}
        `;
        batchEntries.appendChild(entry);
    }

    removeEntry(id) {
        document.getElementById(`batch-${id}`).remove();
    }

    calculateTotal() {
        const inputs = document.querySelectorAll('#batchEntries input[type="number"]');
        let total = 0;

        inputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });

        this.renderBatchResult(total, inputs.length);
    }

    renderBatchResult(total, count) {
        const result = document.getElementById('batchResult');

        if (total === 0) {
            result.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">Add amounts and click Calculate</p>';
            return;
        }

        const average = (total / count).toFixed(2);
        result.innerHTML = `
            <div class="batch-summary">
                <div class="batch-summary-label">Grand Total</div>
                <div class="batch-summary-value">₹ ${total.toLocaleString('en-IN')}</div>
                <div class="batch-breakdown">
                    <div class="batch-breakdown-item">
                        <span>Entries:</span>
                        <span>${count}</span>
                    </div>
                    <div class="batch-breakdown-item">
                        <span>Average:</span>
                        <span>₹ ${average}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

const batchCalc = new BatchCalculator();