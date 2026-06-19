// =======================================================
// 1. GLOBAL CONFIGURATIONS & VARIABLES
// =======================================================
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/naman18vk/NamanStationaries/main/items.json";
const DB_NAME = "DynamicAppDB";
const STORE_NAME = "Item";
const DB_VERSION = 3; 

/* -------------------------------------------------------
   2. PAGE INITIALIZATION & ROUTING CONTROL (DOMContentLoaded)
   ------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------------
    // USER PROFILE & AUTHENTICATION VIEW HANDLER
    // ---------------------------------------------------
    const usernameLabel = document.getElementById("username");
    const logoutBtn = document.getElementById("logoutBtn");
    const fetchedData = localStorage.getItem("savedUsername");

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

    // ---------------------------------------------------
    // CORE APPLICATION ENGINES TRIGGER
    // ---------------------------------------------------
    // GitHub and IndexedDB dynamic products loader
    syncAndDisplayApp();
    
    // Live UI header cart badges synchronization
    updateCartBadge();
});


/* -------------------------------------------------------
   3. CORE SYNCHRONIZATION ENGINE (FETCH & FALLBACKS)
   ------------------------------------------------------- */
async function syncAndDisplayApp() {
    let finalProducts = [];

    try {
        console.log("GitHub se fresh items fetch kiye ja rahe hain...");
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) throw new Error("Network Response directly block ho gaya");
        const rawData = await response.json();

        // Data Structure Formatter (Extra trimming and sanitization)
        finalProducts = rawData.map(item => ({
            id: String(item.id).trim(),
            name: String(item.name).trim(),
            price: String(item.price).trim(),
            image: String(item.image).trim()
        }));

        console.log("Cleaned JSON parsed successfully:", finalProducts);

        // Background indexing thread call
        saveToDBAsBackup(finalProducts);

    } catch (error) {
        console.warn("GitHub offline mode block trigger. DB Local Cache search:", error);
        // Fallback Layer: Router switches automatically to local backup store
        finalProducts = await readFromDBBackup();
    }

    // Products dynamic grid printer interface trigger
    displayItem(finalProducts);
}


/* -------------------------------------------------------
   4. INDEXEDDB BACKUP UTILITIES (WRITERS & READERS)
   ------------------------------------------------------- */
function saveToDBAsBackup(data) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "id" });
            console.log(`Table '${STORE_NAME}' successfully auto-generated.`);
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        store.clear(); // Purane data anomalies block bypass reset
        data.forEach(item => store.put(item)); // Inserting sanitized payloads
        
        transaction.oncomplete = () => db.close();
    };
}

function readFromDBBackup() {
    return new Promise((resolve) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onsuccess = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                resolve([]);
                return;
            }
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => { resolve(req.result); db.close(); };
        };
        request.onerror = () => resolve([]);
    });
}


/* -------------------------------------------------------
   5. UI RENDERING PIPELINE (CARDS COMPONENT GENERATION)
   ------------------------------------------------------- */
function displayItem(Item) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (!Item || Item.length === 0) {
        productGrid.innerHTML = `<h3>Samaan nahi mil paya. Internet connection ya JSON repositories check karein.</h3>`;
        return;
    }

    Item.forEach(product => {
        const idString = product.id ? String(product.id) : '';

        // Image Path Validation (Local standard C:\\ path mapping patch conversion engine)
        let finalImagePath = product.image;
        if (product.image && product.image.includes("C:\\")) {
            const fileName = product.image.split('\\').pop();
            finalImagePath = `./image/${fileName}`;
        }

        // Output UI template buffer string injection
        productGrid.innerHTML += `
        <div class="product-card">
            <div class="card img">
                <img src="${finalImagePath}" alt="${product.name}" onerror="this.src='./image/hero books.png'">
            </div>
            <h3>${product.name}</h3>
            <p class="price">Rs. ${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${idString}')">Add to Cart</button>
        </div>
        `;
    });
}


/* -------------------------------------------------------
   6. E-COMMERCE transactional LOGIC (CART & STORAGE OPERATIONS)
   ------------------------------------------------------- */
function addToCart(productId) {
    if (!productId) {
        alert("Product ID missing!");
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
    
    // Refresh counter nodes live view context tracking
    updateCartBadge();
    
    alert("Item added to cart successfully!");
}

function updateCartBadge() {
    const cartCountLabel = document.getElementById("cart-count");
    if (!cartCountLabel) return;

    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartCountLabel.textContent = totalItems;
    cartCountLabel.style.display = totalItems === 0 ? "none" : "inline-block";
}


/* -------------------------------------------------------
   7. APPLICATION AUTHENTICATION ROUTING TRIGGERS
   ------------------------------------------------------- */
function logoutUser() {
    localStorage.removeItem("savedUsername");
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html"; // Redirect paths mapping structure defaults
}


/* -------------------------------------------------------
   8. VISUAL INTERFACES EFFECTS ANIMATION ENGINE (HERO BANNER SLIDERS)
   ------------------------------------------------------- */
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
