let slider=document.querySelector("#slider");
let passLen=document.querySelector(".passLen");
let displayPassword=document.querySelector("[displayPassword]");
let copyMsg=document.querySelector(".copyMsg");
let copyBtn=document.querySelector(".copyBtn");
let upperCase=document.querySelector("#upperCase");
let lowerCase=document.querySelector("#lowerCase");
let numbers=document.querySelector("#numbers");
let symbols=document.querySelector("#symbols");
let generatePass=document.querySelector(".generatePass");
let circle=document.querySelector(".circle");
let allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password="";
let passwordLength=10;
let allSymbol='@~!#$%^&*_+-./|[]{}';
let checkCnt=0;
handleSlider();
function handleSlider(){
     slider.value=passwordLength;
     passLen.innerText=passwordLength;

     //Slider background
  const min = Number(slider.min);
  const max = Number(slider.max);
  const val = Number(slider.value);

  const percent = ((val - min) * 100) / (max - min);

  slider.style.background = `linear-gradient(to right, purple 0%, purple ${percent}%, black ${percent}%, black 100%)`;
}

function setColor(color) {
   circle.style.backgroundColor=color;
   circle.style.boxShadow="0px 4px 10px rgba(0,0,0,0.5)";
}

function getRandomInteger(max,min){
   return Math.floor(Math.random()*(max-min)) + min;
}

function getRandomNumber(){
    return getRandomInteger(0,9);
}

function getLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function getUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function getSymbol(){
    return allSymbol[getRandomInteger(0,allSymbol.length)];
}

function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumbers=false;
    let hasSymbols=false;
    if(upperCase.checked)hasUpper=true;
    if(lowerCase.checked)hasLower=true;
    if(numbers.checked)hasNumbers=true;
    if(symbols.checked)hasSymbols=true;
if (hasUpper && hasLower && (hasNumbers || hasSymbols) && passwordLength >= 8) {
setColor("#0f0");
} else if (
(hasLower || hasUpper) &&
(hasNumbers || hasSymbols) &&
passwordLength >= 6)setColor("#ff0");
else setColor("#f00");
}

async function copyContent(){
  try {
    await navigator.clipboard.writeText(displayPassword.value);
    copyMsg.innerText = "Copied";
    copyMsg.style.width = "70px";

} catch (e) {
    copyMsg.innerText = "Failed";
}
copyMsg.classList.add("active"); // Removed the dot here
setTimeout(() => {
    copyMsg.classList.remove("active"); // Removed the dot here
}, 1000);
}
function shufflePassword(array){
 //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  // Convert shuffled array to string
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBox(){
    checkCnt=0;
    allCheckBox.forEach((checkbox)=>{
     if(checkbox.checked) checkCnt++;
   }
)
//Special-Case
if(passwordLength<checkCnt){
    passwordLength=checkCnt;
    handleSlider();
}
}


// Event-Listener
allCheckBox.forEach((checkbox)=>
    {
        checkbox.addEventListener('change',handleCheckBox);
        console.log("Checking the Checkboxes");
    }
);

slider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(displayPassword.value) copyContent();
}
)

generatePass.addEventListener('click', () => {
    if(checkCnt<=0) {
        calculateStrength();
        displayPassword.value="";
        alert("You need to tick atleast one of the checkBox");
        return;
    }
    handleCheckBox();
    console.log("Generating the Password");
    let fun = [];
    if (upperCase.checked) fun.push(getUpperCase);
    if (lowerCase.checked) fun.push(getLowerCase);
    if (numbers.checked) fun.push(getRandomNumber);
    if (symbols.checked) fun.push(getSymbol);
    //Hamesha password ko reset karenge 
     password="";
    // Ensure at least one character from each selected type
   
        for (let i = 0; i < fun.length; i++) {
        password += fun[i]();
    }

    // Fill the rest
    for (let i = 0; i < passwordLength - fun.length; i++) {
        let randomIndex = getRandomInteger(0, fun.length);
        password += fun[randomIndex]();
    }
    // Shuffle to remove predictable order
    password = shufflePassword(Array.from(password));

    
     // Display on UI
    displayPassword.value = password;
    //Update strength
    calculateStrength();
    
});
