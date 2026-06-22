/* =======================================================
   LOGIN AUTHENTICATION SYSTEM ENGINE (INDEXEDDB SYNC)
   ======================================================= */

window.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            // Form submit hone par native page refresh ko rokna
            event.preventDefault();

            const usernameInput = document.getElementById("userField").value.trim();
            const passwordInput = document.getElementById("passField").value;

            // 🛠️ naman.html wale exact database name aur version (4) ko open karna
            const dbRequest = indexedDB.open("NamanWebsiteDB", 4);

            dbRequest.onsuccess = function(e) {
                const db = e.target.result;

                // Safety Check: Agar table exist na karti ho
                if (!db.objectStoreNames.contains("users")) {
                    alert("Database initialization issue. Please register a user first!");
                    db.close();
                    return;
                }

                const transaction = db.transaction(["users"], "readonly");
                const store = transaction.objectStore("users");
                
                // Saari registered table ka data read karne ke liye range array generator
                const getAllRequest = store.getAll();

                getAllRequest.onsuccess = function() {
                    const registeredUsers = getAllRequest.result;

                    // 🔍 Database list array me check karein username aur password match ho rha hai ya nahi
                    const matchedUser = registeredUsers.find(user => 
                        String(user.username).toLowerCase() === usernameInput.toLowerCase() && 
                        String(user.password) === passwordInput
                    );

                    if (matchedUser) {
                        // Dynamic session setup keys sets
                        localStorage.setItem("savedUsername", matchedUser.username);
                        sessionStorage.setItem("loggedInUser", "true");

                        alert(`Welcome back ${matchedUser.username}! Login Successful.`);
                        // Homepage framework path redirect parameters target route
                        window.location.href = "homepage.html";
                    } else {
                        alert("Galat Username ya Password! Kripya sahi data bharein.");
                    }
                };

                transaction.oncomplete = () => db.close();
            };

            dbRequest.onerror = function() {
                console.error("Login verification database connection failed.");
                alert("Database crash verification blocks! Clear browser cache.");
            };
        });
    }
});
