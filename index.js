const dbRequest = indexedDB.open("NamanWebsiteDB", 2);
let db;

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database connected on Login Page!");
};

dbRequest.onerror = function(event) {
    console.error("Database connection failed:", event.target.error);
};

function checkLoginData() {
    console.log("Login button clicked");
    const inputName = document.getElementById('login_username').value.trim();
    const inputPass = document.getElementById('login_password').value;

    if (!inputName || !inputPass) {
        alert("Please fill all fields!");
        return;
    }

    if (!db) {
        alert("Database is not ready. Please refresh.");
        return;
    }

    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function(event) {
        const allUsers = event.target.result;
        let userFound = false;

        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].username === inputName && allUsers[i].password === inputPass) {
                userFound = true;
                break;
            }
        }

        if (userFound === true) {
            localStorage.setItem("savedUsername", inputName);
            sessionStorage.setItem("loggedInUser", inputName);
            window.location.href = "homepage.html"; 
        } else {
            alert("Invalid Username or Password! Please try again.");
        }
    };

    getAllRequest.onerror = function(event) {
        console.error("Error reading database:", event.target.error);
        alert("Something went wrong during login check.");
    };
}
