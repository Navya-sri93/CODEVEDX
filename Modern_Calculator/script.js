class Calculator {
    constructor(previousOperandElement, currentOperandElement, historyListElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.historyListElement = historyListElement;
        this.history = [];
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operator = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }

    chooseOperator(operator) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operator = operator;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operator) {
            case '+':
                computation = prev + current;
                break;
            case '−':
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '/':
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        // Format expression for the history log
        const expression = `${this.previousOperand} ${this.operator} ${this.currentOperand}`;
        
        // Fix JavaScript floating point precision issues (e.g., 0.1 + 0.2)
        this.currentOperand = Math.round(computation * 1e12) / 1e12;
        this.currentOperand = this.currentOperand.toString();
        
        // Push to history array and update display
        this.addHistoryItem(expression, this.currentOperand);
        
        this.previousOperand = '';
        this.operator = undefined;
    }

    addHistoryItem(expression, result) {
        this.history.push({ expression, result });
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        if (this.history.length === 0) {
            this.historyListElement.innerHTML = '<div class="empty-history-msg">No history yet</div>';
            return;
        }

        this.historyListElement.innerHTML = '';
        this.history.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('history-item');
            itemElement.innerHTML = `
                <div class="hist-expr">${item.expression} =</div>
                <div class="hist-res">${item.result}</div>
            `;
            // If user clicks a historical record, it restores the value back to screen
            itemElement.addEventListener('click', () => {
                this.currentOperand = item.result;
                this.updateDisplay();
            });
            this.historyListElement.appendChild(itemElement);
        });
    }

    clearHistory() {
        this.history = [];
        this.updateHistoryUI();
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operator != null) {
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operator}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Element Selectors
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-clear]');
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');

const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Initialize Class Engine
const calculator = new Calculator(previousOperandElement, currentOperandElement, historyList);

// Event Listeners for Matrix Buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText === '·' ? '.' : button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperator(button.getAttribute('data-operator'));
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// History Interface Controls
historyToggle.addEventListener('click', () => {
    historyPanel.classList.toggle('open');
});

clearHistoryBtn.addEventListener('click', () => {
    calculator.clearHistory();
});