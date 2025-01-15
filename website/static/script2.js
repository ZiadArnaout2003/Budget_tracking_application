// const ConnectButtons = {
    LinkingButton: document.getElementById("LinkingButton")
    // ManualBillButton: document.getElementById("ManualBillButton"),
    // ManualCloseButton: document.getElementById("closeManual")
// };
// const appearingDiv = {
//     ManualDataEntry: document.getElementById("ManualDataEntry"),
//     Shadow: document.getElementById("Shadow")
// };
function toggleVisibility(element, show) {
    if (show) {
        element.classList.remove('invisible');
        element.classList.add('visible');
    } else {
        element.classList.remove('visible');
        element.classList.add('invisible');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (LinkingButton) {
        LinkingButton.addEventListener("click", (e) => {
            e.preventDefault();
            let LinkingFlashMessage = document.querySelector('.LinkingFlashMessage');
            
            if (!LinkingFlashMessage) {
                LinkingFlashMessage = document.createElement('div');
                LinkingFlashMessage.classList.add('LinkingFlashMessage', 'error');
                const messageSpan = document.createElement('span');
                messageSpan.innerHTML = 'Sorry, this feature is not available.';
                const Xbutton = document.createElement('button');
                Xbutton.innerHTML = "x";
                Xbutton.classList.add('close');
                
                Xbutton.addEventListener("click", () => {
                    LinkingFlashMessage.remove();
                });
                
                LinkingFlashMessage.appendChild(messageSpan);
                LinkingFlashMessage.appendChild(Xbutton);
                document.body.appendChild(LinkingFlashMessage);
            }
        });
    }    
});

//     if (ConnectButtons.ManualBillButton) {
//         ConnectButtons.ManualBillButton.addEventListener("click", (e) => {
//             e.preventDefault();
//             toggleVisibility(appearingDiv.Shadow, true);
//             toggleVisibility(appearingDiv.ManualDataEntry, true);
//             // Get the select element
//         });
//     }

//     if (ConnectButtons.ManualCloseButton) {
//         ConnectButtons.ManualCloseButton.addEventListener("click", (e) => {
//             e.preventDefault();
//             toggleVisibility(appearingDiv.Shadow, false);
//             toggleVisibility(appearingDiv.ManualDataEntry, false);
//         });}

//         const submittedForm = document.getElementById("SubmittedForm");

//         if (submittedForm) {
//             submittedForm.addEventListener("submit", (e) => {
//                 e.preventDefault();  // Prevent the form from submitting the traditional way
//                toggleVisibility(appearingDiv.Shadow, false);
//                 toggleVisibility(appearingDiv.ManualDataEntry, false);
        
//                 // Get the form data
//                 const formData = new FormData(submittedForm);
        
//                 // Send the form data to the server
//                 fetch('/Connect_Bank', {
//                     method: 'POST',
//                     body: formData
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     // Store the new transaction data in localStorage
//                     const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
//                     transactions.push(data);  // Add the new transaction
//                     localStorage.setItem("transactions", JSON.stringify(transactions));  // Save it back to localStorage
        
//                     // Add the new row to the table dynamically
//                     addTransactionRow(data);
//                 })
//             });
//         }
        
//         // Function to add a transaction row to the table dynamically
//         function addTransactionRow(data) {
//             const table = document.querySelector("#transaction-table tbody");
//             const newRow = `
//                 <tr data-id="${data.id}" >
//                     <td>${data.store_name}</td>
//                     <td>${data.category}</td>
//                     <td>${data.amount}</td>
//                     <td>${data.date}</td>
//                     <td><button data-action="delete" id="delete">DELETE</button></td>
//                 </tr>
//             `;
//             table.insertAdjacentHTML('beforeend', newRow);
//         }
        
//         // Load transactions from localStorage when the page loads
//         window.onload = function() {
//             const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
//             transactions.forEach(transaction => {
//                 addTransactionRow(transaction);
//             });
//         };
        
   
//     const selectElement = document.getElementById('category-select');

//     // Get the container for the "Others" input
//     const inputOthersContainer = document.getElementById('inputOthersContainer');   
//     selectElement.addEventListener('change', () => {
//         // Check if the selected option is "others"
//         if (selectElement.value === "others") {
//             // Show the input field for "others"
//             inputOthersContainer.style.display = "block";
//         } else {
//             // Hide the input field if the selected option is not "others"
//             inputOthersContainer.style.display = "none";
//         }
//     });
//     document.querySelector('table').addEventListener('click', (e) => {
//         // Check if the clicked element's id contains 'delete'
//         if (e.target.id && e.target.id.includes('delete')) {
//             // Get the parent row of the clicked delete button
//             console.log("Delete button clicked");
//             const row = e.target.closest('tr');
    
//             // Ensure the row exists and has a data-id attribute
//             if (row && row.dataset.id) {
//                 const transactionId = row.dataset.id;
    
//                 // Remove the row from the table
//                 row.remove();
    
//                 // Remove the transaction from localStorage
//                 removeTransactionFromLocalStorage(transactionId);
//                 // Send a DELETE request to the server
//                 fetch(`/delete-transaction/${transactionId}`, {
//                     method: 'DELETE',
//                 })
//                     .then((response) => {
//                         if (response.ok) {
//                             console.log(`Transaction ${transactionId} deleted successfully.`);
//                         } else {
//                             console.error(`Failed to delete transaction ${transactionId}.`);
//                         }
//                     })
//                     .catch((error) => console.error('Error:', error));
//             } else {
//                 console.error('Row or data-id not found.');
//             }
//         }
//         function removeTransactionFromLocalStorage(transactionId) {
//             const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
//             // Find the index of the transaction in the array
//             let transactionFound = false;  // Flag to check if the transaction is found
            
//             console.log(`TransactionId = ${transactionId}`);
//             for (let i = 0; i < transactions.length; i++) {
//                 console.log(`Element {i} = `,transactions[i].id);
//                 if (transactions[i].id == transactionId) {
//                     // Remove the transaction from the array
//                     transactions.splice(i, 1);
//                     localStorage.removeItem('transactions')
//                     // Save the updated transactions array back to localStorage
//                     localStorage.setItem('transactions', JSON.stringify(transactions));
//                     console.log("Transaction removed successfully.");
//                     transactionFound = true;  // Set the flag to true
//                     break;  // Exit the loop once the transaction is removed
//                 }
//             }
        
//             // If transaction is not found, log this message
//             if (!transactionFound) {
//                 console.log("Transaction with this id not found.");
//             }
//         }
        
//     });
// });


