/* =======================================================
   LOGIN AUTHENTICATION SYSTEM ENGINE
   ======================================================= */

function handleLoginSystem(event) {
    // Form submit hone par page refresh ko rokne ke liye
    event.preventDefault();

    // Inputs se value nikal kar space clean karna
    const usernameInput = document.getElementById("userField").value.trim();
    const passwordInput = document.getElementById("passField").value.trim();
    const errorPanel = document.getElementById("loginError");

    // Static Safe Check Validation
    // Agar dono fields khali nahi hain, toh login successful
    if (usernameInput !== "" && passwordInput !== "") {
        
        // Error banner ko chhipayein
        if (errorPanel) errorPanel.style.display = "none";

        // 🔥 LOCALSTORAGE FLOW UPDATER LOCKS
        // Username ko local storage me save karna taaki homepage 'Welcome name' dikha sake
        localStorage.setItem("savedUsername", usernameInput);
        sessionStorage.setItem("loggedInUser", "true");

        alert("Login Successful! Redirecting to shop dashboard.");
        
        // Homepage dashboard par send (redirect) karna
        window.location.href = "homepage.html";
        
    } else {
        // Agar koi galti hai toh invalid message highlight karein
        if (errorPanel) errorPanel.style.display = "block";
    }
}
