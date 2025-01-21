const ConnectButtons = {
    LinkingButton: document.getElementById("LinkingButton"),
    ManualBillButton: document.getElementById("ManualBillButton")
};
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

    if (ConnectButtons.ManualBillButton) {
        ConnectButtons.ManualBillButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/My_Finances";
            
        });
    }

