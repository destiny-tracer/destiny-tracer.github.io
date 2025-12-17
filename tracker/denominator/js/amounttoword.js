// Word mappings
let currentFormat = 'indian';
let amountCache = null;

const ones = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19
};

const tens = {
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90
};

const scales = {
    'hundred': 100,
    'thousand': 1000,
    'lakh': 100000,
    'lac': 100000,
    'million': 1000000,
    'crore': 10000000,
    'billion': 1000000000
};

// Reverse mappings for numbers to words
const reverseOnes = {
    1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
    6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
    11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
    16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen'
};

const reverseTens = {
    20: 'Twenty', 30: 'Thirty', 40: 'Forty', 50: 'Fifty',
    60: 'Sixty', 70: 'Seventy', 80: 'Eighty', 90: 'Ninety'
};

// Switch tabs
function switchTab(e, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    e.target.classList.add('active');
}

// Select format
function selectFormat(e, format) {
    currentFormat = format;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
}

// Convert amount to words
function convertAmountToWords() {
    const amount = parseFloat(document.getElementById('amountInput').value);

    if (!amount && amount !== 0 || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }

    const parts = amount.toString().split('.');
    let integerPart = parseInt(parts[0]);
    let decimalPart = parts[1] ? parseInt(parts[1]) : null;

    let words = numberToWords(integerPart, currentFormat);

    if (decimalPart) {
        words += ' and ' + numberToWords(decimalPart, currentFormat) + ' Paise';
    }

    const includeRupees = document.getElementById('includeRupees').checked;
    if (includeRupees && words !== 'Zero') {
        words += ' Rupees Only';
    }

    amountCache = amount;
    displayAmountResult(words);
}

function numberToWords(num, format) {
    if (num === 0) return 'Zero';

    let result = '';

    if (format === 'indian') {
        // Indian numbering: 1,23,45,67,89,000
        // Breaking: Crore (10M), Lakh (1L), Thousand (1K), Hundred, Rest

        const crore = Math.floor(num / 10000000);
        if (crore > 0) {
            result += convertGroupToWords(crore) + ' Crore ';
            num %= 10000000;
        }

        const lakh = Math.floor(num / 100000);
        if (lakh > 0) {
            result += convertGroupToWords(lakh) + ' Lakh ';
            num %= 100000;
        }

        const thousand = Math.floor(num / 1000);
        if (thousand > 0) {
            result += convertGroupToWords(thousand) + ' Thousand ';
            num %= 1000;
        }

        if (num > 0) {
            result += convertGroupToWords(num);
        }
    } else if (format === 'international') {
        // International numbering: 1,234,567,890
        // Breaking: Billion, Million, Thousand, Rest

        const billion = Math.floor(num / 1000000000);
        if (billion > 0) {
            result += convertGroupToWords(billion) + ' Billion ';
            num %= 1000000000;
        }

        const million = Math.floor(num / 1000000);
        if (million > 0) {
            result += convertGroupToWords(million) + ' Million ';
            num %= 1000000;
        }

        const thousand = Math.floor(num / 1000);
        if (thousand > 0) {
            result += convertGroupToWords(thousand) + ' Thousand ';
            num %= 1000;
        }

        if (num > 0) {
            result += convertGroupToWords(num);
        }
    } else if (format === 'short') {
        // Short format with abbreviations

        const crore = Math.floor(num / 10000000);
        if (crore > 0) {
            result += convertGroupToWords(crore) + ' Cr ';
            num %= 10000000;
        }

        const lakh = Math.floor(num / 100000);
        if (lakh > 0) {
            result += convertGroupToWords(lakh) + ' L ';
            num %= 100000;
        }

        const thousand = Math.floor(num / 1000);
        if (thousand > 0) {
            result += convertGroupToWords(thousand) + ' K ';
            num %= 1000;
        }

        if (num > 0) {
            result += convertGroupToWords(num);
        }
    }

    return result.trim();
}

function convertGroupToWords(num) {
    if (num === 0) return '';

    let words = '';

    // Hundreds place
    const hundreds = Math.floor(num / 100);
    if (hundreds > 0) {
        words += reverseOnes[hundreds] + ' Hundred';
    }

    const remainder = num % 100;
    if (remainder > 0) {
        if (words) words += ' ';

        if (remainder <= 19) {
            words += reverseOnes[remainder] || '';
        } else {
            const ten = Math.floor(remainder / 10) * 10;
            const unit = remainder % 10;
            words += reverseTens[ten] || '';
            if (unit > 0) {
                words += ' ' + (reverseOnes[unit] || '');
            }
        }
    }

    return words.trim();
}

function displayAmountResult(words) {
    document.getElementById('amountWordsValue').textContent = words;
    document.getElementById('amountToWordsResult').classList.add('show');
    document.getElementById('amountEmpty').style.display = 'none';
}

function copyAmountResult() {
    const text = document.getElementById('amountWordsValue').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function resetAmountTab() {
    document.getElementById('amountInput').value = '';
    document.getElementById('amountToWordsResult').classList.remove('show');
    document.getElementById('amountEmpty').style.display = 'block';
}

// Convert words to amount
function convertWordsToAmount() {
    const words = document.getElementById('wordsInput').value.trim();

    if (!words) {
        alert('Please enter words');
        return;
    }

    const amount = wordsToNumber(words);

    if (amount === null) {
        alert('Could not parse the input. Please use valid number words.');
        return;
    }

    displayWordsResult(amount);
}

function wordsToNumber(text) {
    text = text.toLowerCase().trim();

    // Remove common words
    text = text.replace(/\b(rupees|rupee|only)\b/g, '').replace(/\s+/g, ' ').trim();
    // Keep 'and' but will handle it
    text = text.replace(/\s+and\s+/g, ' ');

    const words = text.split(/\s+/);
    let current = 0;
    let result = 0;

    for (let word of words) {
        if (!word) continue;

        if (word in ones) {
            current += ones[word];
        } else if (word in tens) {
            current += tens[word];
        } else if (word === 'hundred') {
            current *= 100;
        } else if (word === 'thousand') {
            current *= 1000;
            result += current;
            current = 0;
        } else if (word === 'lakh' || word === 'lac') {
            current *= 100000;
            result += current;
            current = 0;
        } else if (word === 'crore') {
            current *= 10000000;
            result += current;
            current = 0;
        } else if (word === 'million') {
            current *= 1000000;
            result += current;
            current = 0;
        } else if (word === 'billion') {
            current *= 1000000000;
            result += current;
            current = 0;
        }
    }

    result += current;
    return result > 0 ? result : null;
}

function displayWordsResult(amount) {
    document.getElementById('amountValue').textContent = '₹ ' + amount.toLocaleString('en-IN');
    document.getElementById('wordsToAmountResult').classList.add('show');
    document.getElementById('wordsEmpty').style.display = 'none';
}

function copyWordsResult() {
    const text = document.getElementById('amountValue').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function resetWordsTab() {
    document.getElementById('wordsInput').value = '';
    document.getElementById('wordsToAmountResult').classList.remove('show');
    document.getElementById('wordsEmpty').style.display = 'block';
}