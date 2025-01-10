Buttons={
    LoginButton:document.getElementById("LoginButton"),
    LogoutButton:document.getElementById("LogoutButton"),
    FlashedMessage:document.querySelector(".flashed-message"),
    CloseButtons : document.querySelectorAll('.close')

}

document.addEventListener('DOMContentLoaded', () => {
    if (Buttons.LoginButton) {
        Buttons.LoginButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/Login";
            console.log("Redirected to login");
        });
    }
    else if (Buttons.LogoutButton) {
        Buttons.LogoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/Logout";
            console.log("Redirected to login");
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {

    Buttons.CloseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const messageDiv = button.closest('.flashed-message');
            if (messageDiv) {
                messageDiv.style.display = "none";
            }
        });
    });
});
