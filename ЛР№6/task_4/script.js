let currentInput = {
    float: '',
    position: ''
};
let shouldResetDisplay = {
    float: false,
    position: false
};

function appendToDisplay(value, type) {
    const display = document.getElementById(`display-${type}`);
    
    if (shouldResetDisplay[type]) {
        display.value = '';
        shouldResetDisplay[type] = false;
    }
    
    if (value === '.' && display.value.includes('.')) {
        return;
    }
    
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
    
    currentInput[type] += value;
}

function clearDisplay(type) {
    document.getElementById(`display-${type}`).value = '0';
    currentInput[type] = '';
}

function calculate(type) {
    const display = document.getElementById(`display-${type}`);
    try {
        const result = eval(currentInput[type]);
        display.value = result.toString().replace(/\./g, ',');
        currentInput[type] = result.toString();
        shouldResetDisplay[type] = true;
    } catch (error) {
        display.value = 'Помилка';
        currentInput[type] = '';
    }
}