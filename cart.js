/* =======================================================
   NAMAN STATIONARIES - SHOPPING CART LOGIC (cart.js)
   ======================================================= */

const DB_NAME = "DynamicAppDB";

// पेज लोड होते ही डेटाबेस और लोकल स्टोरेज से सामान लोड करें
document.addEventListener("DOMContentLoaded", () => {
    loadCartItems();
});

function loadCartItems() {
    // 1. LocalStorage से कार्ट लिस्ट लाएँ
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    const tbody = document.getElementById("cart-items-tbody");
    const contentDiv = document.getElementById("cart-content");

    // अगर कार्ट में कोई सामान नहीं है तो खाली कार्ट का मैसेज दिखाएं
    if (cart.length === 0) {
        contentDiv.innerHTML = `
            <div style="text-align:center; padding: 50px 20px;">
                <h3 style="font-size: 22px; color: #666;">Your cart is empty!</h3>
                <p style="color: #999; margin-top: 10px;">Add some items from our shop to get started.</p>
                <br>
                <a href="homepage.html" class="btn-shop" style="display: inline-block;">Go Shop Now</a>
            </div>
        `;
        return;
    }

    // 2. IndexedDB खोलकर प्रोडक्ट्स की डिटेल्स (नाम, प्राइस, इमेज) लाएँ
    const request = indexedDB.open(DB_NAME);

    request.onsuccess = (event) => {
        const db = event.target.result;
        
        // सुरक्षित चेक: अगर आइटम टेबल मौजूद नहीं है
        if (!db.objectStoreNames.contains("Item")) {
            console.error("Item table not found in IndexedDB");
            return;
        }

        const transaction = db.transaction("Item", "readonly");
        const store = transaction.objectStore("Item");
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const allProducts = getAllRequest.result;
            
            // टेबल को खाली करें ताकि पुराना डेटा हट जाए
            if (tbody) tbody.innerHTML = "";
            let grandTotal = 0;

            // लोकल स्टोरेज की कार्ट लिस्ट को IndexedDB के असली सामानों से मैच करें
            cart.forEach(cartItem => {
                const product = allProducts.find(p => String(p.id) === String(cartItem.id));

                if (product) {
                    let itemTotal = product.price * cartItem.quantity;
                    grandTotal += itemTotal;

                    if (tbody) {
                        tbody.innerHTML += `
                            <tr>
                                <td><img src="${product.image}" class="cart-img" alt="${product.name}"></td>
                                <td><strong>${product.name}</strong></td>
                                <td>Rs. ${product.price}</td>
                                <td>${cartItem.quantity}</td>
                                <td>Rs. ${itemTotal}</td>
                                <td>
                                    <button class="remove-btn" onclick="removeFromCart('${cartItem.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
                    }
                }
            });

            // कुल बिल (Grand Total) को स्क्रीन पर अपडेट करें
            const totalLabel = document.getElementById("cart-grand-total");
            if (totalLabel) {
                totalLabel.textContent = `Grand Total: Rs. ${grandTotal}`;
            }
        };
    };

    request.onerror = () => {
        console.error("Database open failed inside cart controller logic");
    };
}

/* --- कार्ट से आइटम पूरी तरह हटाने का फंक्शन --- */
function removeFromCart(productId) {
    if (!productId) return;

    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    
    // क्लिक की गई ID को छोड़कर बाकी सभी आइटम्स को फ़िल्टर करके बचाएं
    cart = cart.filter(item => String(item.id) !== String(productId));
    
    // नए डेटा को वापस लोकल स्टोरेज में ओवरराइट करें
    localStorage.setItem("userCart", JSON.stringify(cart));
    
    // स्क्रीन पर तुरंत नई लिस्ट दिखाने के लिए फ़ंक्शन को दोबारा चलाएँ
    loadCartItems();
}

/* --- चेकआउट बटन दबाने पर अलर्ट मैसेज --- */
function checkoutAlert() {
    alert("Thank you for your order! Your stationery items are being processed.");
}
