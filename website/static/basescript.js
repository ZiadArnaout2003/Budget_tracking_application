document.addEventListener('DOMContentLoaded', () => {
    let LoginButton = document.getElementById("LoginButton");

    LoginButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/Login";
        console.log("redirected to login");
    });
});

