let budget_span = document.getElementById("budget");
let current_budget_span = document.getElementById("current_budget");
let Zone=document.getElementById("Zone");

let budget=1000;
let current_budget=800;
const ratio=current_budget/budget *100;

budget_span.innerHTML = "/"+budget;  
current_budget_span.innerHTML = current_budget;

let budget_circle = document.getElementById("budget-circle");

// Access the CSS variable
const root = document.documentElement; // Target the root element (:root)
root.style.setProperty('--remaining-percentage',`${ratio}`);
//--------------------------------------------------------------------------------


//                            FUNCTIONS 
function updateBudgetCircle() {
 
    if(ratio<30){
    Zone.innerHTML="Danger";
    root.style.setProperty('--current-color',`red`);
}
else if(ratio<60){ 
    Zone.innerHTML="Caution";
    root.style.setProperty('--current-color',`#fdd835`);
    }
else{
    Zone.innerHTML="Safe";
     root.style.setProperty('--current-color',`rgb(134, 188, 134)`);
} 
current_color = getComputedStyle(root).getPropertyValue('--current-color');
budget_span.style.color = current_color;
Zone.style.color = current_color;

}
//--------------------------------------------------------------------------------

updateBudgetCircle();
