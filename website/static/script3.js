const Elements = {
    budgetSpan: document.getElementById("budget"),
    currentBudgetSpan: document.getElementById("current_balance"),
    zone: document.getElementById("Zone"),
    budgetCircle: document.getElementById("budget-circle"),
    root: document.documentElement,
    connectButtons: {
        manualBillButton: document.getElementById("ManualBillButton"),
        manualCloseButton: document.getElementById("closeManual"),
        setBudgetButton: document.getElementById("setBudgetButton")
    },
    appearingDivs: {
        manualDataEntry: document.getElementById("ManualDataEntry"),
        shadow: document.getElementById("Shadow"),
    },
    submittedForm : document.getElementById("SubmittedForm"),
    selectElement: document.getElementById('category-select'),
    actionTypeInput: document.getElementById('action-type'),
    inputOthersContainer: document.getElementById('inputOthersContainer'),
    transactionTable: document.querySelector("#transaction-table tbody")
};
let current_balance = 0;
let budget = 0;
function addTransactionRow(data) {
    const newRow = `
        <tr data-id="${data.id}">
            <td>${data.store_name}</td>
            <td>${data.category}</td>
            <td>${data.amount}</td>
            <td>${data.date}</td>
            <td><button data-action="delete" class="delete">DELETE</button></td>
        </tr>
    `;
    Elements.transactionTable.insertAdjacentHTML('beforeend', newRow);
}
function ClearForm(){
    Elements.submittedForm.innerHTML = ``;
}
function removeTransactionFromLocalStorage(transactionId) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const index = transactions.findIndex(t => t.id == transactionId);
    if (index !== -1) {
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        console.log("Transaction removed successfully.");
    } else {
        console.log("Transaction not found.");
    }
}

function toggleVisibility(element, show) {
    element.classList.toggle('invisible', !show);
    element.classList.toggle('visible', show);
}

function updateBudgetCircle(current_balance, budget) {
    const ratio = current_balance / (budget || 1) * 100;
    let zoneText, color;

    if (ratio < 30) {
        zoneText = "Danger";
        color = "red";
    } else if (ratio < 60) {
        zoneText = "Caution";
        color = "#fdd835";
    } else {
        zoneText = "Safe";
        color = "rgb(134, 188, 134)";
    }

    Elements.zone.innerHTML = zoneText;
    Elements.zone.style.color = color;
    Elements.budgetSpan.style.color = color;
    Elements.root.style.setProperty('--current-color', color);
    Elements.budgetCircle.style.setProperty('--remaining-percentage',ratio);
}
async function fetchCurrentBalance() {
    try {
        const response = await fetch('/get_balance');
        if (!response.ok) throw new Error('Failed to fetch balance');
        const data = await response.json();
        return data.current_balance;
    } catch (error) {
        console.error("Error fetching balance:", error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    budget = parseFloat(JSON.parse(localStorage.getItem("budget")) || 0);
    current_balance = parseFloat(await fetchCurrentBalance());
    localStorage.setItem("current_balance", JSON.stringify(current_balance));

    if (!budget) {
        Elements.budgetSpan.innerHTML = `/no budget set`;
        Elements.currentBudgetSpan.innerHTML = 0;
        updateBudgetCircle(current_balance, budget);
    } else {
        Elements.budgetSpan.innerHTML = `/${budget}`;
        Elements.currentBudgetSpan.innerHTML = current_balance;
        updateBudgetCircle(current_balance, budget);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    Elements.connectButtons.setBudgetButton.addEventListener('click', (e) => {
        e.preventDefault();
        ClearForm();
        Elements.submittedForm.innerHTML=
        `<input type="hidden" name="actionType" id="action-type" value="balance">
        <label for="balance">
        Set your budget
        <input type="text" name="balance" id="balance" required/>
        </label>
        <button type="submit" class="button" >Submit</button>`;
        Elements.actionTypeInput.value = "balance";
        toggleVisibility(Elements.appearingDivs.shadow, true);
        toggleVisibility(Elements.appearingDivs.manualDataEntry, true);
    })
    if (Elements.connectButtons.manualBillButton) {
        Elements.connectButtons.manualBillButton.addEventListener('click', (e) => {
            e.preventDefault();
            ClearForm();
            Elements.submittedForm.innerHTML=
                `<input type="hidden" name="actionType" id="action-type" value="transaction">
                <label for="store_name">
                Enter the store name
                <input type="text" name="store_name" id="store_name" required/>
              </label>
              <label for="category-select">Choose a category:</label>
              <select name="category" id="category-select">
                <option value="grocery">Grocery</option>
                <option value="clothes">Clothes</option>
                <option value="mobile">Mobile</option>
                <option value="utility bills">Utility Bills</option>
                <option value="transportation">Transportation</option>
                <option value="healthcare">Healthcare</option>
                <option value="others">Others</option>
              </select>
              <div id="inputOthersContainer" style="display: none">
                <input
                  type="text"
                  id="inputOthers"
                  name="inputOthers"
                  placeholder="enter a new category"
                />
              </div>
              <label for="amount">I have spent </label>
              <span> <input type="number" name="amount" id="amount" required/> $</span>
              <button type="submit" class="button">Submit</button>`;
            toggleVisibility(Elements.appearingDivs.shadow, true);
            toggleVisibility(Elements.appearingDivs.manualDataEntry, true);
        });
    }

    if (Elements.connectButtons.manualCloseButton) {
        Elements.connectButtons.manualCloseButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleVisibility(Elements.appearingDivs.shadow, false);
            toggleVisibility(Elements.appearingDivs.manualDataEntry, false);
        });
    }
     
    if (Elements.submittedForm) {
            Elements.submittedForm.addEventListener("submit", (e) => {
                e.preventDefault();  // Prevent the form from submitting the traditional way
                toggleVisibility(Elements.appearingDivs.shadow, false);
                toggleVisibility(Elements.appearingDivs.manualDataEntry, false);
        
                // Get the form data
                const formData = new FormData(Elements.submittedForm);
                
                // Send the form data to the server
                fetch('/My_Finances', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (Elements.actionTypeInput.value === "balance") {
                        Elements.budgetSpan.innerHTML = `/${data.balance}`;
                        Elements.currentBudgetSpan.innerHTML = data.balance;
                        budget = data.balance;
                        current_balance = data.balance;
                        updateBudgetCircle(parseFloat(current_balance),parseFloat(budget));
                        localStorage.setItem("budget", JSON.stringify(budget));
                        localStorage.setItem("current_balance", JSON.stringify(current_balance));
                        window.location.reload();
                    }
                    else{
                        
                    // Store the new transaction data in localStorage
                    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
                    transactions.push(data);  // Add the new transaction
                    localStorage.setItem("transactions", JSON.stringify(transactions));  // Save it back to localStorage
                    // Add the new row to the table dynamically
                    addTransactionRow(data);
                    window.location.reload();
                  
                }})
                });
            }
    document.querySelector('table').addEventListener('click', (e) => {
        if (e.target.dataset.action === 'delete') {
            const row = e.target.closest('tr');
            const transactionId = row.dataset.id;
            row.remove();
            removeTransactionFromLocalStorage(transactionId);
            fetch(`/delete-transaction/${transactionId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                        console.log(`Transaction ${transactionId} deleted successfully.`);
                    } else {
                        console.error(`Failed to delete transaction ${transactionId}.`);
                    }
                }).catch(console.error);
        }
    });
});
    window.onload = function() {
                
                const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
                transactions.forEach(transaction => {
                    addTransactionRow(transaction);
                })};


