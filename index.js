/* =======================================================
   LOGIN AUTHENTICATION SYSTEM ENGINE (FAIL-PROOF)
   ======================================================= */

window.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            // Form submit hone par native page refresh ko rokna
            event.preventDefault();

            const usernameInput = document.getElementById("userField").value.trim();
            const passwordInput = document.getElementById("passField").value.trim();
            const errorPanel = document.getElementById("loginError");

            // Hardcoded basic check validation
            if (usernameInput !== "" && passwordInput !== "") {
                if (errorPanel) errorPanel.style.display = "none";

                // 🔥 LOCALSTORAGE UPDATER LOCKS
                localStorage.setItem("savedUsername", usernameInput);
                sessionStorage.setItem("loggedInUser", "true");

                alert("Login Successful! Redirecting to shop dashboard.");
                
                // Dashboard page framework path target route
                window.location.href = "homepage.html";
                
            } else {
                // Validation fail alerts indicator show layer
                if (errorPanel) errorPanel.style.display = "block";
            }
        });
    }
});
