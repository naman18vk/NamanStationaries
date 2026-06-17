// 1. Database कनेक्शन सेट करना

const dbRequest = indexedDB.open("NamanWebsiteDB", 1);
let db;

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database connected on Login Page!");
};

dbRequest.onerror = function(event) {
    console.error("Database connection failed:", event.target.error);
};

// 2. लॉगिन डेटा चेक करने का फंक्शन
function checkLoginData() {
    console.log("Login button clicked")
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

    // Database से डेटा सिर्फ पढ़ने (Read) के लिए ट्रांजेक्शन शुरू करें
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");
    
    // सभी यूजर्स का डेटा एक साथ एरे (Array) में निकालें
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function(event) {
        const allUsers = event.target.result;
        let userFound = false;

        // एरे की पूरी लिस्ट पर लूप चलाकर चेक करना
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i].username === inputName && allUsers[i].password === inputPass) {
                userFound = true;
            }
        }

        if (userFound===true) {
            
            // Jab IndexedDB me password match ho jaye, tab ye line chalayein:
            localStorage.setItem("savedUsername", inputName);
            window.location.href = "C:\\Users\\user\\Downloads\\New folder\\homepage.html"; 
        } else {
            alert("Invalid Username or Password! Please try again.");
        }
    }
    getAllRequest.onerror = function(event) {
        console.error("Error reading database:", event.target.error);
        alert("Something went wrong during login check.");
    };
}
// Jab login successful ho jaye (Aapne login script mein jahan save karwaya ho)
sessionStorage.setItem("loggedInUser", "Naman Gupta"); // "Naman Gupta" ki jagah user ka dynamic name aayega





