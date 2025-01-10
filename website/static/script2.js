const ConnectButtons = {
    LinkingButton: document.getElementById("LinkingButton"),
    ManualBillButton: document.getElementById("ManualBillButton"),
    SubmitButton: document.getElementById("SubmitForm")
};
const appearingDiv = {
    ManualDataEntry: document.getElementById("ManualDataEntry"),
    Shadow: document.getElementById("Shadow")
};
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
    if (ConnectButtons.LinkingButton) {
        ConnectButtons.LinkingButton.addEventListener("click", (e) => {
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

    if (ConnectButtons.ManualBillButton) {
        ConnectButtons.ManualBillButton.addEventListener("click", (e) => {
            e.preventDefault();
            toggleVisibility(appearingDiv.Shadow, true);
            toggleVisibility(appearingDiv.ManualDataEntry, true);
            // Get the select element
        });
    }

    if (ConnectButtons.SubmitButton) {
        ConnectButtons.SubmitButton.addEventListener("click", (e) => {
            toggleVisibility(appearingDiv.Shadow, false);
            toggleVisibility(appearingDiv.ManualDataEntry, false);
        });
    }
    const selectElement = document.getElementById('category-select');

    // Get the container for the "Others" input
    const inputOthersContainer = document.getElementById('inputOthersContainer');   
    selectElement.addEventListener('change', () => {
        // Check if the selected option is "others"
        if (selectElement.value === "others") {
            // Show the input field for "others"
            inputOthersContainer.style.display = "block";
        } else {
            // Hide the input field if the selected option is not "others"
            inputOthersContainer.style.display = "none";
        }
    });
});

