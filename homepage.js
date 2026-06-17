window.addEventListener("DOMContentLoaded", () => {

    const usernameLabel =
        document.getElementById("username");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const fetchedData =
        localStorage.getItem("savedUsername");

    // Welcome User

    if (fetchedData && usernameLabel) {

        usernameLabel.textContent =
            `Welcome ${fetchedData}`;

        if (logoutBtn) {
            logoutBtn.style.display =
                "inline-block";
        }

    } else {

        if (usernameLabel) {
            usernameLabel.textContent =
                "Welcome";
        }

        if (logoutBtn) {
            logoutBtn.style.display =
                "none";
        }
    }

    // Load Item From IndexedDB

    loadItem();
});


/* -----------------------------
   LOGOUT
----------------------------- */

function logout() {

    localStorage.removeItem(
        "savedUsername"
    );

    window.location.href =
        "div.html";
}


/* -----------------------------
   INDEXEDDB
----------------------------- */

const DB_NAME = "DynamicAppDB";


function loadItem() {

    const request =
        indexedDB.open(DB_NAME);

    request.onsuccess = (event) => {

        const db =
            event.target.result;

        // Check Item Table

        if (
            !db.objectStoreNames.contains(
                "Item"
            )
        ) {

            console.log(
                "Item table not found"
            );

            return;
        }

        const transaction =
            db.transaction(
                "Item",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "Item"
            );

        const getAllRequest =
            store.getAll();

        getAllRequest.onsuccess =
            () => {

            const Item =
                getAllRequest.result;

            displayItem(
                Item
            );
        };

        getAllRequest.onerror =
            () => {

            console.log(
                "Failed to load Item"
            );
        };
    };

    request.onerror = () => {

        console.log(
            "Database open failed"
        );
    };
}


/* -----------------------------
   DISPLAY Item (UPDATED WITH ADD TO CART BUTTON)
----------------------------- */

function displayItem(Item) {

    const productGrid =
        document.getElementById(
            "productGrid"
        );

    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (
        !Item ||
        Item.length === 0
    ) {
        productGrid.innerHTML =
        `<h3>No Item Found</h3>`;
        return;
    }

    // Dynamic grid nodes creation array loops
    Item.forEach(product => {

        // unique string identifier logic parsing handler rule
        const idString = product.id ? String(product.id) : '';

        productGrid.innerHTML += `
        <div class="product-card">
            <div class="card img">
                <img
                    src="${product.image}"
                    alt="${product.name}">
            </div>
            <h3>
                ${product.name}
            </h3>
            <p class="price">
                Rs. ${product.price}
            </p>
            
            <!-- यहाँ नया Add to Cart बटन जोड़ दिया गया है -->
            <button class="add-to-cart-btn" onclick="addToCart('${idString}')">
                Add to Cart
            </button>
        </div>
        `;
    });
}


/* -----------------------------
   ADD TO CART LOGIC (NEW FUNCTION)
----------------------------- */
function addToCart(productId) {
    if (!productId) {
        alert("Product ID not found!");
        return;
    }

    // LocalStorage से पुराना कार्ट डेटा लाएं, या खाली एरे [] सेट करें
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];

    // चेक करें कि क्या प्रोडक्ट पहले से कार्ट में है
    let existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1; // यदि है, तो संख्या 1 बढ़ाएं
    } else {
        cart.push({ id: productId, quantity: 1 }); // यदि नया है, तो जोड़ें
    }

    // अपडेटेड कार्ट को वापस LocalStorage में सेव करें
    localStorage.setItem("userCart", JSON.stringify(cart));

    // यूजर को अलर्ट दिखाएं
    alert("Item added to cart successfully!");
}


// =======================================================
// 5. HERO TWO-SIDE TRACK SLIDER INTERFACES LOGIC
// =======================================================
const trackLeft = document.getElementById('image-track-left');
const trackRight = document.getElementById('image-track-right');
let currentIndex = 0;
const stepWidth = 280; // Individual slide image wrapper configuration width

function slideImages() {
    // Agar kisi vajah se html structure nodes update na hon to crash block safe check rule
    if (!trackLeft || !trackRight) return;

    currentIndex++;

    // Dono layout blocks tracking animations ko parallel sync shift karein
    trackLeft.style.transition = "transform 0.5s ease-in-out";
    trackRight.style.transition = "transform 0.5s ease-in-out";
    
    trackLeft.style.transform = `translateX(-${currentIndex * stepWidth}px)`;
    trackRight.style.transform = `translateX(-${currentIndex * stepWidth}px)`;

    // Har 4th position complete hone par bina jhatke loop reset karein (Index 4)
    if (currentIndex >= 4) {
        setTimeout(() => {
            trackLeft.style.transition = "none";
            trackRight.style.transition = "none";
            
            currentIndex = 0;
            
            trackLeft.style.transform = `translateX(0px)`;
            trackRight.style.transform = `translateX(0px)`;
        }, 500); // 0.5 second animation transitions frames timing configuration delay
    }
}

// Har 1 second (1000 milliseconds) mein sliding operation automatic run karein
setInterval(slideImages, 1000);
/* -----------------------------
   UPDATE CART COUNT VISUALLY
----------------------------- */
function updateCartBadge() {
    const cartCountLabel = document.getElementById("cart-count");
    if (!cartCountLabel) return;

    // LocalStorage से कार्ट डेटा लाएं
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    
    // कार्ट में मौजूद सभी सामानों की कुल संख्या (Total Quantity) जोड़ें
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // कार्ट आइकॉन के ऊपर नंबर को अपडेट करें
    cartCountLabel.textContent = totalItems;
    
    // अगर कार्ट खाली है तो संख्या को छिपा दें (ऑप्शनल सुंदर लुक के लिए)
    if (totalItems === 0) {
        cartCountLabel.style.display = "none";
    } else {
        cartCountLabel.style.display = "inline-block";
    }
}

/* -----------------------------
   ADD TO CART LOGIC (UPDATED)
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

    // क्लिक करते ही तुरंत आइकॉन का नंबर लाइव अपडेट करें (बिना पेज रीफ्रेश किए)
    updateCartBadge();

    alert("Item added to cart successfully!");
}

// जब पहली बार वेबसाइट का पेज खुले, तो कार्ट में पहले से ऐड सामान की संख्या दिखाने के लिए:
window.addEventListener("DOMContentLoaded", () => {
    // आपकी पुरानी कोड लाइन्स यहाँ पहले से मौजूद हैं...
    
    // इस लाइन को सबसे नीचे जोड़ें ताकि पुराना सेव डेटा लोड हो सके
    updateCartBadge();
});
