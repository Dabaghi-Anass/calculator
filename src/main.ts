import { Evaluator } from "./Evaluator";
const $ = (selector : string) => {
    let elements = document.querySelectorAll(selector);
    if(elements.length === 1) return elements[0]
    return elements
};

let buttons = $(".buttons .btn")! as NodeList;
let errContainer = $(".error")! as HTMLElement;
let resultLabel = $(".result")! as HTMLElement;
let expressionLabel = $(".operation")!  as HTMLElement;
let state = {
    lastExpression : "",
    expression : "0",
    lastResult : 0,
    result : 0
}



Array.from(buttons).forEach(button => {
    button.addEventListener("click" , changeExpression);
})
function isOperator(op : string){
    return (["+", "-","/","*","%","^"]).includes(op);
}
function performAction(action : string){
    switch (action){
        case "clean" :
            state.expression = ""
            state.result = 0
            state.lastExpression = "" 
            state.expression = "0"
            expressionLabel.textContent = ""
            updateUi()
        break;
        case "delete" :
            state.expression  = state.expression.slice(0,state.expression.trim().length - 1);
            updateUi()
        break;

    }
}
function changeExpression(e : Event){
    const btn = e.target as HTMLButtonElement;
    const isNumberButton : boolean = btn.classList.contains("number-button");
    const isActionButton : boolean = btn.classList.contains("action-button");
    const isEqualButton : boolean = btn.classList.contains("equal-button");
    if(isNumberButton) pushDigit(btn.dataset.value!);
    else if(isActionButton && isOperator(btn.dataset.value!)) pushOperator(btn.dataset.value!);
    else if(isActionButton) performAction(btn.dataset.value!);
    else if(isEqualButton) calculateExpression()
}

function pushDigit(digit : string){
    if(state.expression === "0" && digit !== ".") state.expression = ""
    state.expression += digit;
    updateUi();
}
function pushOperator(op : string){
    let trimed = state.expression.trim()
    if(isOperator(trimed[trimed.length - 1])){
        state.expression = state.expression.slice(0,trimed.length - 1);
    }
    state.expression += ` ${op} `;
    updateUi();
}
function updateUi(){
   resultLabel.textContent = state.expression;
   if(!state.expression.length) resultLabel.textContent = "0";
}

function calculateExpression(){
    try{
        errContainer.style.opacity = "0"
        state.lastExpression = state.expression;
        state.result = Evaluator.evaluate(state.expression)
        state.expression = "0" 
        pushResultToUi()
    }catch(e : any){
        showError(e.message)
    }
}
function showError(err : string){
    let errPlaceHolder = $("#error-placeholder")! as HTMLElement;
    errPlaceHolder.textContent = err; 
    errContainer.style.opacity = "1";
}
function pushResultToUi(){
    resultLabel.textContent = state.result.toString()
    expressionLabel.innerHTML = state.lastExpression.split("").map(c => {
        if(isOperator(c)) return `<span class="operator">${c}</span>`
        return c;
    }).join("");
}

function mountKeyboardTypingEvents(){
    addEventListener("keydown" , (e)=>{
        if(isOperator(e.key) || ["(",")"].includes(e.key)) pushOperator(e.key);
        else if(e.key === "=" || e.key === "Enter") calculateExpression()
        else if(!isNaN(+e.key)) pushDigit(e.key)
        else if(e.key === "." || e.key === ",") pushDigit(e.key.replace(",","."))
        else if(e.key === "Delete") {
            state.expression = ""
            state.result = 0
            state.lastExpression = "" 
            state.expression = "0"
            expressionLabel.textContent = ""
            updateUi()
        }
        else if(e.key === "Backspace") {
            state.expression  = state.expression.slice(0,state.expression.trim().length - 1);
            updateUi()
        }
    
    })
}
addEventListener("load",mountKeyboardTypingEvents)