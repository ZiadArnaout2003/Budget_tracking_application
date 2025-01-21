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
    actionTypeInput: document.getElementById('action-type'),
    transactionTable: document.querySelector("#transaction-table tbody")
};
// Global variables
if (localStorage.getItem('HasSetBudget') === null) {
    localStorage.setItem('HasSetBudget', 'false'); // First-time initialization
  }

let current_balance = 0;
let budget = 0;
//--------------------------------------------------------------------------
function addTransactionRow(data) {
    const newRow = `
        <tr data-id="${data.id}">
            <td>${data.store_name}</td>
            <td>${data.category}</td>
            <td>${data.amount}</td>
            <td>${data.date}</td>
            <td>${data.time}</td>
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
function LoadTransactions() {      
    fetch('/transactions', { method: 'GET' }).then(response => response.json())
    .then(transactions => {
        transactions.forEach(transaction => {
            addTransactionRow(transaction);
    })
    })};
function Barchart() {
    const ctx = document.getElementById('BarChart').getContext('2d');
    fetch('/bar-chart-data', { method: 'GET' }).then(response => response.json())
    .then(store_data => { 
        const myChart = new Chart(ctx, {
            type: 'bar', // Chart type
            data: {
                labels: store_data.store_name, // X-axis labels
                datasets: [{
                    label: 'Amount Spent ($)', // Dataset label (for legend)
                    data: store_data.amount, // Data points
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.9)',
                        'rgba(54, 162, 235, 0.9)',
                        'rgba(255, 206, 86, 0.9)',
                        'rgba(75, 192, 192, 0.9)',
                        'rgba(153, 102, 255, 0.9)',
                        'rgba(255, 159, 64, 0.9)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1 // Border width of the bars
                }]
            },
            options: {
                responsive: true, // Chart adjusts to the size of the canvas
                plugins: {
                    legend: {
                        display: false // Hide the legend
                    },
                    title: {
                        display: true, // Show the title
                        text: 'Top 6 Stores by Amount Spent', // Title text
                        font: {
                            size: 18 // Font size for the title
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true, // Start Y-axis at 0
                        title: {
                            display: true, // Show Y-axis title
                            text: 'Amount Spent ($)', // Y-axis title text
                        }
                    },
                    x: {
                        title: {
                            display: true, // Show X-axis title
                            text: 'Store Names', // X-axis title text
                        }
                    }
                }
            }
        });
    });
}
function Linechart() {
    const ctx = document.getElementById('LineChart').getContext('2d');
    
    fetch('/line-chart-data', { method: 'GET' })
        .then(response => response.json())
        .then(money_over_days => 
           {const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: money_over_days.date,
                    datasets: [{
                        data: money_over_days.money,
                        borderColor: 'rgb(134, 188, 134)', // Line color
                        backgroundColor: 'rgb(134, 188, 134,0.2)', // Fill color under the line
                        tension: 0.3, // Smooth curve
                        fill: true, // Fill area under the line
                        pointRadius: 6, // Size of the points on the line
                        pointHoverRadius: 8, // Size of the points on hover
                        pointBackgroundColor: 'rgb(134, 188, 134)', // Color of the points
                        pointBorderColor: 'rgba(255, 255, 255, 1)', // Border color of the points
                        pointBorderWidth: 2 // Border width of the points
                    }]
                },        options: {
                    responsive: true, // Chart adjusts to the size of the canvas
                    plugins: {
                        legend: {
                            display: false, // Show the legend
                           
                        },
                        title: {
                            display: true, // Show the title
                            text: 'Money spent over a month', // Title text
                            font: {
                                size: 18 // Font size for the title
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true, // Start Y-axis at 0
                            title: {
                                display: true, // Show Y-axis title
                                text: 'Amount Spent ($)', // Y-axis title text
                            }
                        },
                        x: {
                            title: {
                                display: true, // Show X-axis title
                                text: 'Time', // X-axis title text
                            }
                        }
                    }
                }
            })
        });
    }
function Piechart() {
    const ctx = document.getElementById('PieChart').getContext('2d');

    fetch('/pie-chart-data', { method: 'GET' })
        .then(response => response.json())
        .then(category_data => {
            // Check if the data is empty
            if (category_data.portion.length === 0) {
                category_data = {
                    category: ["No Data"],
                    portion: [1] // Placeholder value
                };
            }

            // Create the pie chart
            const myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: category_data.category,
                    datasets: [{
                        data: category_data.portion,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.9)',
                            'rgba(54, 162, 235, 0.9)',
                            'rgba(255, 206, 86, 0.9)',
                            'rgba(75, 192, 192, 0.9)',
                            'rgba(153, 102, 255, 0.9)',
                            'rgba(255, 159, 64, 0.9)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Amount Spent by Category',
                            font: {
                                size: 18
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.label === "No Data"
                                        ? "No data available"
                                        : context.label + ": " + context.raw + "%";
                                }
                            }
                        }
                    }
                }
            });
        });
}

Linechart();
Piechart();
Barchart();
const socket = io(); // Connect to the WebSocket server
// Listen for the 'transaction_update' event
socket.on('transaction_update', (data) => {
    LoadTransactions();
});

document.addEventListener('DOMContentLoaded', async() => {
    LoadTransactions();
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
        if (localStorage.getItem("HasSetBudget") === "true") {
            // Show confirmation alert if a budget is already set
            const confirmation = confirm(
              "Are you sure you want to set a new budget? This will remove all previous transactions!"
            );
            if (confirmation) {
            localStorage.removeItem('transactions');
            Elements.submittedForm.innerHTML=
            `<input type="hidden" name="actionType" id="action-type" value="balance">
            <label for="balance"> 
            Set your budget </label>
            <input type="text" name="balance" id="balance" required/>
            <button type="submit" class="button" >Submit</button>`;
            Elements.actionTypeInput.value = "balance";
            toggleVisibility(Elements.appearingDivs.shadow, true);
            toggleVisibility(Elements.appearingDivs.manualDataEntry, true);
            }
        }
         else {
            Elements.submittedForm.innerHTML=
        `<input type="hidden" name="actionType" id="action-type" value="balance">
        <label for="balance"> 
        Set your budget </label>
        <input type="text" name="balance" id="balance" required/>
        <button type="submit" class="button" >Submit</button>`;
        Elements.actionTypeInput.value = "balance";
        toggleVisibility(Elements.appearingDivs.shadow, true);
        toggleVisibility(Elements.appearingDivs.manualDataEntry, true);
        }
        
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

            //Add an input if others is selected

            let selectElement= document.getElementById('category-select');
            let inputOthersContainer= document.getElementById('inputOthersContainer');
            selectElement.addEventListener('change', function() {
                if (this.value === "others") {
                    inputOthersContainer.style.display = 'block';
                } else {
                    inputOthersContainer.style.display = 'none';
                }
            })
        });
    }
    // Close the manual data entry div
    if (Elements.connectButtons.manualCloseButton) {
        Elements.connectButtons.manualCloseButton.addEventListener('click', (e) => {
            e.preventDefault();
            toggleVisibility(Elements.appearingDivs.shadow, false);
            toggleVisibility(Elements.appearingDivs.manualDataEntry, false);
        });
    }
    // Handle form submission
    if (Elements.submittedForm) {
            Elements.submittedForm.addEventListener("submit", (e) => {
                e.preventDefault();  
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
                        localStorage.setItem("HasSetBudget", true);
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
    // Tavle row deletion
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



