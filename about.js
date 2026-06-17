let db;

// 1. IndexedDB Database Open karna
const request = indexedDB.open("NamanStationariesDB", 1);

request.onupgradeneeded = function(e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("reports")) {
        db.createObjectStore("reports", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function(e) {
    db = e.target.result;
    console.log("IndexedDB Connected Successfully!");
};

request.onerror = function(e) {
    console.error("Database connection error: ", e.target.error);
};

// 2. Page Load hote hi Login User ka Name display karna
document.addEventListener("DOMContentLoaded", function() {
    checkAndSetLoginUser();

    const form = document.getElementById("reportForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById("name").value || "Guest User",
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value,
                date: new Date().toLocaleString()
            };

            const transaction = db.transaction(["reports"], "readwrite");
            const store = transaction.objectStore("reports");
            const addRequest = store.add(formData);

            addRequest.onsuccess = function() {
                alert("Your report has been saved successfully!");
                
                // Form reset karein (Isse baaki saare inputs khali ho jayenge)
                form.reset();
                
                // Form reset hone ke baad Login user ka naam wapas set rakhein
                checkAndSetLoginUser();
            };

            addRequest.onerror = function() {
                alert("Error saving data to IndexedDB.");
            };
        });
    }
});

// Function: LocalStorage se logged in user ka naam check karke input me dalna (UPDATED)
function checkAndSetLoginUser() {
    // यहाँ sessionStorage की जगह localStorage और "savedUsername" का उपयोग किया गया है
    const loggedInName = localStorage.getItem("savedUsername");
    const nameField = document.getElementById("name");
    
    if (nameField) {
        if (loggedInName) {
            nameField.value = loggedInName.trim(); // फालतू स्पेस और गुप्ता हटाने के लिए क्लीनअप नियम
        } else {
            nameField.value = "Guest User"; // अगर कोई लॉगिन नहीं है
        }
    }
}
