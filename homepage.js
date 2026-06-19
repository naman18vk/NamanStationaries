// 1. ⚠️ APNI GITHUB RAW FILE KA URL YAHAN DALEIN
const GITHUB_JSON_URL = "https://githubusercontent.com";

const DB_NAME = "DynamicAppDB";
const STORE_NAME = "Item"; // Table ka naam

/* -----------------------------
   PAGE LOAD INITIALIZATION
----------------------------- */
window.addEventListener("DOMContentLoaded", () => {

    const usernameLabel = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");
    const fetchedData = localStorage.getItem("savedUsername");

    // Welcome User Logic
    if (fetchedData && usernameLabel) {
        usernameLabel.textContent = `Welcome ${fetchedData}`;
        if (logoutBtn) {
            logoutBtn.style.display = "inline-block";
        }
    } else {
        if (usernameLabel) {
            usernameLabel.textContent = "Welcome";
        }
        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }
    }

    // 2. 🔥 NEW: Pehle GitHub se naya data sync karein, fir load karein
    syncAndLoadData();
    
    // Cart badge numbers ko upar update karein
    updateCartBadge();
});

/* -----------------------------
   FETCH FROM GITHUB & SYNC TO INDEXEDDB
----------------------------- */
async function syncAndLoadData() {
    try {
        console.log("GitHub se fresh data fetch ho raha hai...");
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) throw new Error("GitHub File Not Found");
        const freshData = await response.json();

        // Data ko IndexedDB me background me save karein
        await saveDataToIndexedDB(freshData);
        console.log("IndexedDB successfully updated from GitHub!");

    } catch (error) {
        console.warn("GitHub se data nahi mila (Offline Mode). Existing Local Data load kiya ja raha hai.", error);
    } finally {
        // Chahe internet ho ya na ho, database me jo bacha hai use screen par dikhao
        loadItem();
    }
}

// Helper function database me naya data overwrite karne ke liye
function saveDataToIndexedDB(data) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);

        // Agar user pehli baar website khol raha hai aur table nahi bani hai
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            
            // Agar browser update nahi hua to safety check ke liye store banana
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.close();
                resolve(); // Fallback to avoid freeze
                return;
            }

            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);

            // Purana data saaf karke live data fill karein
            store.clear();

            data.forEach(product => {
                store.put(product);
            });

            transaction.oncomplete = () => { db.close(); resolve(); };
            transaction.onerror = () => reject(transaction.error);
        };

        request.onerror = () => reject(request.error);
    });
}

/* -----------------------------
   INDEXEDDB SE DATA READ KARNA
----------------------------- */
function loadItem() {
    const request = indexedDB.open(DB_NAME);

    request.onsuccess = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
            console.log("Item table not found");
            displayItem([]); // Khali array bhejkar "No Item Found" dikhayein
            return;
        }

        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const Item = getAllRequest.result;
            displayItem(Item);
        };

        getAllRequest.onerror = () => {
            console.log("Failed to load Item");
        };
    };

    request.onerror = () => {
        console.log("Database open failed");
    };
}

/* -----------------------------
   DISPLAY ITEM ON HTML GRID
----------------------------- */
function displayItem(Item) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (!Item || Item.length === 0) {
        productGrid.innerHTML = `<h3>No Item Found</h3>`;
        return;
    }

    Item.forEach(product => {
        const idString = product.id ? String(product.id) : '';

        // 🔥 Image path security fix handler (C:\ drive local path ko relative path me badalna)
        let finalImagePath = product.image;
        if (product.image && product.image.includes("C:\\")) {
            // Agar JSON me purana path hai, to use './image/FileName.extension' me change karo
            const fileName = product.image.split('\\').pop(); // 'Safari Bag.jfif' nikalega
            finalImagePath = `./image/${fileName}`;
        }

        productGrid.innerHTML += `
        <div class="product-card">
            <div class="card img">
                <img
                    src="${finalImagePath}"
                    alt="${product.name}"
                    onerror="this.src='./image/hero books.png'"> <!-- Agar photo na mile to blank placeholder -->
            </div>
            <h3>
                ${product.name}
            </h3>
            <p class="price">
                Rs. ${product.price}
            </p>
            <button class="add-to-cart-btn" onclick="addToCart('${idString}')">
                Add to Cart
            </button>
        </div>
        `;
    });
}

/* -----------------------------
   ADD TO CART LOGIC
----------------------------- */
function addToCart(productId) {
    if (!productId) {
        alert("Product ID not found!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    let existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem("userCart", JSON.stringify(cart));

    // Instant counter update
    updateCartBadge();

    alert("Item added to cart successfully!");
}

/* -----------------------------
   UPDATE CART COUNT VISUALLY
----------------------------- */
function updateCartBadge() {
    const cartCountLabel = document.getElementById("cart-count");
    if (!cartCountLabel) return;

    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartCountLabel.textContent = totalItems;
    
    if (totalItems === 0) {
        cartCountLabel.style.display = "none";
    } else {
        cartCountLabel.style.display = "inline-block";
    }
}

/* -----------------------------
   LOGOUT
----------------------------- */
function logoutUser() {
    localStorage.removeItem("savedUsername");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

/* -----------------------------
   HERO TWO-SIDE TRACK SLIDER LOGIC
----------------------------- */
const trackLeft = document.getElementById('image-track-left');
const trackRight = document.getElementById('image-track-right');
let currentIndex = 0;
const stepWidth = 280; 

function slideImages() {
    if (!trackLeft || !trackRight) return;

    currentIndex++;

    trackLeft.style.transition = "transform 0.5s ease-in-out";
    trackRight.style.transition = "transform 0.5s ease-in-out";
    
    trackLeft.style.transform = `translateX(-${currentIndex * stepWidth}px)`;
    trackRight.style.transform = `translateX(-${currentIndex * stepWidth}px)`;

    if (currentIndex >= 4) {
        setTimeout(() => {
            trackLeft.style.transition = "none";
            trackRight.style.transition = "none";
            currentIndex = 0;
            trackLeft.style.transform = `translateX(0px)`;
            trackRight.style.transform = `translateX(0px)`;
        }, 500); 
    }
}

setInterval(slideImages, 1000);
