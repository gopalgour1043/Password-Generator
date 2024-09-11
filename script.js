const inputSlider = document.querySelector("[data-lenslider]");
const lengthDisplay = document.querySelector("[data-lenNumber]");
const PasswordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copymsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*()_-=+[{]}\|;:',<.>/?";

let password = "";
let passwordlength = 10;
let checkcount = 0;
updateSlider();

// Set password length
function updateSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInt(0, 10).toString();
}

function generateLowercase() {
    return String.fromCharCode(getRandomInt(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
    const randomNum = getRandomInt(0, symbols.length);
    return symbols.charAt(randomNum);
}

function calculateStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum && hasSym) && passwordlength >= 8) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(PasswordDisplay.value);
        copymsg.innerText = "Copied";
    } catch (e) {
        copymsg.innerText = "Failed";
    }
    copymsg.classList.add("active");
    setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    updateSlider();
});

copybtn.addEventListener('click', () => {
    if (PasswordDisplay.value) {
        copyContent();
    }
});

function handleCheckBoxChange() {
    checkcount = 0;
    allcheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkcount++;
        }
    });
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        updateSlider();
    }
}

allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

generateBtn.addEventListener('click', () => {
    if (checkcount === 0) return;
    if (passwordlength < checkcount) {
        passwordlength = checkcount;
        updateSlider();
    }

    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUppercase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // Compulsory addition
    funcArr.forEach(func => password += func());

    // Remaining addition 
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = getRandomInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    PasswordDisplay.value = password;

    calculateStrength();
});
