// Utility functions

const DENOMINATIONS = {
    INR: [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1],
    USD: [100, 50, 20, 10, 5, 2, 1],
    EUR: [500, 200, 100, 50, 20, 10, 5, 2, 1]
};

const DEFAULT_DENOMINATIONS = {
    INR: [500, 200, 100, 50, 1],
    USD: [100, 50, 20, 10, 1],
    EUR: [500, 200, 100, 50, 20, 10, 5, 1]
};

function createCheckboxGroup(currency, selectedDenoms, containerId, onChangeCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    DENOMINATIONS[currency].forEach(denom => {
        const isChecked = selectedDenoms.includes(denom);
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        item.innerHTML = `
            <input type="checkbox" id="denom_${currency}_${denom}" ${isChecked ? 'checked' : ''}>
            <label for="denom_${currency}_${denom}">${currency} ${denom}</label>
        `;
        item.querySelector('input').addEventListener('change', () => {
            onChangeCallback(denom, item.querySelector('input').checked);
        });
        container.appendChild(item);
    });
}

function renderTags(denominations, containerId, onRemoveCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    denominations.forEach(denom => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `
            ${denom}
            <span class="tag-remove" data-denom="${denom}">×</span>
        `;
        tag.querySelector('.tag-remove').addEventListener('click', () => {
            onRemoveCallback(denom);
        });
        container.appendChild(tag);
    });
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active to clicked button
    event.target.classList.add('active');
}

function formatCurrency(amount, currency = 'INR') {
    const symbol = { INR: '₹', USD: '$', EUR: '€' }[currency];
    return `${symbol} ${amount.toLocaleString('en-IN')}`;
}

function saveToHistory(entry) {
    let history = JSON.parse(localStorage.getItem('denominationHistory') || '[]');
    history.unshift(entry);
    history = history.slice(0, 10); // Keep last 10
    localStorage.setItem('denominationHistory', JSON.stringify(history));
}

function getHistory() {
    return JSON.parse(localStorage.getItem('denominationHistory') || '[]');
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = getHistory();

    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: #999;">No history yet</p>';
        return;
    }

    historyList.innerHTML = history.map(entry => `
        <div class="history-item">
            <div><strong>${entry.currency} ${entry.amount}</strong></div>
            <div>Denominations: ${entry.denominations.join(', ')}</div>
            <div class="history-time">${entry.timestamp}</div>
        </div>
    `).join('');
}