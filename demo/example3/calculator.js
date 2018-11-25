let textCalc = '';
let havingSymbol = false;

window.onload = function() {
    const inputCalculator = document.getElementById('display');
    var buttons = document.getElementsByTagName('button');
    var symbols = document.querySelectorAll('input[type=button]');
    // buttons
    for (let i in buttons) {
        buttons[i].onclick = fnNumber;
    }
    // symbols
    for (let i in symbols) {
        symbols[i].onclick = fnSymbol;
    }
    // Calc when press enter
    inputCalculator.addEventListener('keyup', function(event) {
        event.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            fnCalc();
        }
    });
};

const fnNumber = (event) => {
    const inputCalculator = document.getElementById('display');
    const value = event.target.innerText;
    textCalc = `${textCalc}${value}`;
    inputCalculator.value = textCalc;
};

const fnSymbol = (event) => {
    const inputCalculator = document.getElementById('display');
    const symbol = event.target.value;
    switch (symbol) {
    case 'C': {
        fnClear();
        havingSymbol = false;
        break;
    }

    case '=': {
        const pattern = new RegExp(/[+|\-|/|*]/);
        if (pattern.test(inputCalculator.value)) {
            havingSymbol = false;
            fnCalc();
        }
        break;
    }

    default: {
        if (!havingSymbol) {
            textCalc = `${textCalc}${symbol}`;
            inputCalculator.value = textCalc;
            havingSymbol = true;
        }
    }
    }
};

const fnClear = () => {
    const inputCalculator = document.getElementById('display');
    textCalc = '';
    inputCalculator.value = '0';
};

const fnCalc = () => {
    const inputCalculator = document.getElementById('display');
    const strEquation = inputCalculator.value;
    const mathSymbol = strEquation.match(/[+|\-|/|*]/)[0];
    const arrNumbers = strEquation.split(mathSymbol);
    let result;

    switch(mathSymbol) {
    case '+': {
        result = Number(arrNumbers[0]) + Number(arrNumbers[1]);
        break;
    }

    case '-': {
        result = Number(arrNumbers[0]) - Number(arrNumbers[1]);
        break;
    }

    case '*': {
        result = Number(arrNumbers[0]) * Number(arrNumbers[1]);
        break;
    }

    case '/': {
        result  = Number(arrNumbers[0]) / Number(arrNumbers[1]);
    }
    }

    textCalc = result;
    inputCalculator.value = result;
};
